/**
 * useConversation
 *
 * Owns all data and behaviour for a single roleplay conversation so the route
 * component can stay a thin view.
 *
 * Design: the Convex `conversation` query is the single source of truth for
 * messages. We never copy it into local state. The only ephemeral state is the
 * in-flight optimistic user message (`pending`) and the post-completion results
 * snapshot. Everything else (rendered messages, live feedback, milestone
 * celebrations) is derived, so there is no message-syncing effect to get wrong.
 */

import { useAction, useMutation, useQuery } from 'convex/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import type { Id } from 'convex/_generated/dataModel'
import type { Message } from '~/components/features/roleplay/ConversationView'
import type { FeedbackData } from '~/components/features/roleplay/FeedbackPanel'
import type { Celebration } from '~/components/features/roleplay/MilestoneCelebration'

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

type Analysis = {
  observation: number
  feeling: number
  need: number
  request: number
  total: number
  feedback: string
  isJackalLanguage: boolean
  jackalPhrases: Array<string>
  giraffeAlternative: string
  whatWentWell: string
  empathyShown: boolean
}

export interface EarnedAchievement {
  id: string
  title: string
  description: string
}

/**
 * Which NVC component would benefit most from a refresher, based on the last
 * few turns. Only components the user actually attempted count: a component
 * that simply was not this turn's job scores 0 and must not read as weakness.
 */
export interface SkillHint {
  component: 'observation' | 'feeling' | 'need' | 'request'
}

const SKILL_HINT_WINDOW = 3 // look at the last N scored turns
const SKILL_HINT_MIN_SAMPLES = 2 // need repeated evidence, not one rough turn
const SKILL_HINT_THRESHOLD = 12 // avg below this (of 25) suggests a refresher

function deriveSkillHint(messages: Array<Message>): SkillHint | null {
  const recent = messages
    .filter((m) => m.role === 'user' && m.nvcScore)
    .slice(-SKILL_HINT_WINDOW)
  if (recent.length < SKILL_HINT_MIN_SAMPLES) return null

  const components = ['observation', 'feeling', 'need', 'request'] as const
  let weakest: SkillHint | null = null
  let weakestAvg = SKILL_HINT_THRESHOLD

  for (const component of components) {
    const attempts = recent
      .map((m) => m.nvcScore?.[component] ?? 0)
      .filter((score) => score > 0)
    if (attempts.length < SKILL_HINT_MIN_SAMPLES) continue
    const avg = attempts.reduce((a, b) => a + b, 0) / attempts.length
    if (avg < weakestAvg) {
      weakestAvg = avg
      weakest = { component }
    }
  }

  return weakest
}

/** The five-number score, pulled out of a full analysis result. */
function toNvcScore(a: Analysis) {
  return {
    observation: a.observation,
    feeling: a.feeling,
    need: a.need,
    request: a.request,
    total: a.total,
  }
}

/** Build the feedback-panel view-model from a stored message (if any). */
function messageToFeedback(message: Message | undefined): FeedbackData | null {
  if (!message) return null
  return {
    score: {
      observation: message.nvcScore?.observation ?? 0,
      feeling: message.nvcScore?.feeling ?? 0,
      need: message.nvcScore?.need ?? 0,
      request: message.nvcScore?.request ?? 0,
      total: message.nvcScore?.total ?? 0,
    },
    feedback: message.feedback ?? '',
    whatWentWell: message.whatWentWell ?? '',
    giraffeAlternative: message.giraffeAlternative ?? '',
    isJackalLanguage: message.isJackalLanguage ?? false,
  }
}

function starsForScore(score: number): number {
  if (score >= 85) return 3
  if (score >= 70) return 2
  if (score >= 60) return 1
  return 0
}

function completionStatusForScore(
  score: number,
): 'excellent' | 'success' | 'pass' | 'incomplete' {
  if (score >= 85) return 'excellent'
  if (score >= 70) return 'success'
  if (score >= 60) return 'pass'
  return 'incomplete'
}

function scenarioStatusForScore(
  score: number,
): 'attempted' | 'passed' | 'mastered' {
  if (score >= 85) return 'mastered'
  if (score >= 60) return 'passed'
  return 'attempted'
}

type ScoreKey = 'observation' | 'feeling' | 'need' | 'request'
/**
 * Average a component over the turns where the user actually attempted it
 * (score > 0). Components are scored per turn only when present, so counting
 * absent turns as zeros would punish spreading the arc across the
 * conversation, which is exactly what we teach.
 */
function averageScore(messages: Array<Message>, key: ScoreKey): number {
  const attempts = messages
    .map((m) => m.nvcScore?.[key] ?? 0)
    .filter((score) => score > 0)
  if (attempts.length === 0) return 0
  return attempts.reduce((a, b) => a + b, 0) / attempts.length
}

/**
 * Milestone copy, in ascending order of significance. When several flip true at
 * once we celebrate the most meaningful one.
 */
const MILESTONE_CELEBRATIONS: Array<{
  key:
    | 'feelingExpressed'
    | 'needIdentified'
    | 'requestMade'
    | 'empathyShown'
    | 'resolutionReached'
  title: string
  message: (characterName: string) => string
}> = [
  {
    key: 'feelingExpressed',
    title: 'Feeling named',
    message: () => 'You put honest words to an emotion.',
  },
  {
    key: 'needIdentified',
    title: 'Need uncovered',
    message: () => 'You connected your feeling to what matters.',
  },
  {
    key: 'requestMade',
    title: 'Clear request',
    message: () => 'You asked for something concrete and doable.',
  },
  {
    key: 'empathyShown',
    title: 'You heard them',
    message: (name) => `You tuned into what ${name} might be feeling.`,
  },
  {
    key: 'resolutionReached',
    title: 'Breakthrough',
    message: (name) => `${name} feels genuinely heard.`,
  },
]

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

interface UseConversationArgs {
  scenarioId: string
  conversationId: string
  // Present when this conversation was started from a daily challenge; passed
  // through to completion so the challenge gets credited.
  dailyChallengeId?: string
}

export function useConversation({
  scenarioId,
  conversationId,
  dailyChallengeId,
}: UseConversationArgs) {
  const navigate = useNavigate()

  // --- Data --------------------------------------------------------------
  const currentUser = useQuery(api.users.getCurrentUser)
  const overallProgress = useQuery(api.userProgress.getByUserId)
  const userLevel = overallProgress?.level ?? 1

  const scenario = useQuery(api.scenarios.getById, {
    scenarioId: scenarioId as Id<'scenarios'>,
  })

  const conversation = useQuery(
    api.conversations.getById,
    conversationId
      ? { conversationId: conversationId as Id<'conversations'> }
      : 'skip',
  )

  const scenarioProgress = useQuery(
    api.scenarioProgress.getScenarioProgress,
    { scenarioId: scenarioId as Id<'scenarios'> },
  )

  const analyzeMessage = useAction(api.ai.analyzeNVCResponse)
  const generateCharacterResponse = useAction(api.ai.generateCharacterResponse)

  const addMessage = useMutation(api.conversations.addMessage)
  const completeConversation = useMutation(api.conversations.complete)
  const abandonConversation = useMutation(api.conversations.abandon)
  const createConversation = useMutation(api.conversations.create)
  const rewindMessages = useMutation(api.conversations.rewindLastMessages)
  const updateUserProgress = useMutation(api.userProgress.updateProgress)
  const updateScenarioProgress = useMutation(
    api.scenarioProgress.updateScenarioProgress,
  )

  // --- Ephemeral state ---------------------------------------------------
  const [pending, setPending] = useState<Message | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [completion, setCompletion] = useState<{
    finalScore: number
    finalStars: number
    pointsEarned: number
    newAchievements: Array<EarnedAchievement>
  } | null>(null)
  const [celebration, setCelebration] = useState<Celebration | null>(null)

  // --- Derived view data (no syncing effects) ----------------------------
  const serverMessages = useMemo(
    () => (conversation?.messages ?? []) as Array<Message>,
    [conversation?.messages],
  )

  const messages = useMemo(
    () => (pending ? [...serverMessages, pending] : serverMessages),
    [serverMessages, pending],
  )

  const feedback = useMemo(() => {
    const lastUserWithFeedback = [...serverMessages]
      .reverse()
      .find((m) => m.role === 'user' && m.feedback)
    return messageToFeedback(lastUserWithFeedback)
  }, [serverMessages])

  // A gentle pointer to the lesson or library for whichever component has
  // been consistently rough over the last few turns (null when none has).
  const skillHint = useMemo(() => deriveSkillHint(serverMessages), [serverMessages])

  // --- Milestone celebrations --------------------------------------------
  // Reacting to server-computed milestones to fire a one-shot toast is a
  // legitimate effect: it bridges an external store to a transient UI event.
  const seenMilestonesRef = useRef<Record<string, boolean> | null>(null)
  const celebrationIdRef = useRef(0)

  useEffect(() => {
    const milestones = conversation?.milestonesAchieved
    if (!milestones) return

    // First sighting: record silently so resuming never re-celebrates.
    if (seenMilestonesRef.current === null) {
      seenMilestonesRef.current = { ...milestones }
      return
    }

    const previous = seenMilestonesRef.current
    const newlyReached = [...MILESTONE_CELEBRATIONS]
      .reverse()
      .find((m) => milestones[m.key] && !previous[m.key])

    seenMilestonesRef.current = { ...milestones }

    if (newlyReached) {
      celebrationIdRef.current += 1
      setCelebration({
        id: celebrationIdRef.current,
        title: newlyReached.title,
        message: newlyReached.message(scenario?.characterName || 'They'),
      })
    }
  }, [conversation?.milestonesAchieved, scenario?.characterName])

  // --- Actions -----------------------------------------------------------
  const sendMessage = useCallback(
    async (text: string) => {
      if (!conversationId || !scenario) return

      // History captured before we persist anything, so it holds the prior
      // turns only. Each AI action appends the current message itself.
      const history = serverMessages
      const userMsg: Message = {
        role: 'user',
        content: text,
        timestamp: Date.now(),
      }

      setError(null)
      setPending(userMsg)
      setIsLoading(true)

      try {
        // Milestones reflect prior turns here (this message is not persisted
        // yet), so the coaching can point at the piece still missing.
        const milestones = conversation?.milestonesAchieved
        const arcSoFar = {
          feelingExpressed: milestones?.feelingExpressed ?? false,
          needIdentified: milestones?.needIdentified ?? false,
          requestMade: milestones?.requestMade ?? false,
        }

        // The analysis and the character's reply are independent by design
        // (the character reads the message itself, plus their current mood),
        // so both model calls run in parallel and a turn costs one round trip
        // instead of two.
        const [analysis, characterResponse] = await Promise.all([
          analyzeMessage({
            userMessage: text,
            conversationHistory: history,
            userLevel,
            componentsLanded: {
              feeling: arcSoFar.feelingExpressed,
              need: arcSoFar.needIdentified,
              request: arcSoFar.requestMade,
            },
            scenario: {
              situation: scenario.situation,
              characterName: scenario.characterName,
              learningObjectives: scenario.learningObjectives,
              focusArea: scenario.focusArea,
            },
          }),
          generateCharacterResponse({
            userMessage: text,
            conversationHistory: history,
            scenario: {
              title: scenario.title,
              characterName: scenario.characterName,
              characterPersonality: scenario.characterPersonality,
              characterInitialMood: scenario.characterInitialMood,
              characterBackground: scenario.characterBackground || '',
              characterHiddenNeeds: scenario.characterHiddenNeeds,
            },
            currentMood:
              conversation?.currentCharacterMood ??
              scenario.characterInitialMood,
            userLevel,
            arcSoFar,
          }),
        ])

        await addMessage({
          conversationId: conversationId as Id<'conversations'>,
          role: 'user',
          content: text,
          nvcScore: toNvcScore(analysis),
          feedback: analysis.feedback,
          isJackalLanguage: analysis.isJackalLanguage,
          jackalPhrases: analysis.jackalPhrases,
          giraffeAlternative: analysis.giraffeAlternative,
          whatWentWell: analysis.whatWentWell,
          empathyShown: analysis.empathyShown,
        })
        // The user message now lives on the server; drop the optimistic copy.
        setPending(null)

        await addMessage({
          conversationId: conversationId as Id<'conversations'>,
          role: 'assistant',
          content: characterResponse,
        })
      } catch (err) {
        setPending(null)
        setError('Something went wrong reading your message. Please try again.')
      } finally {
        setIsLoading(false)
      }
    },
    [
      conversationId,
      scenario,
      serverMessages,
      conversation?.milestonesAchieved,
      conversation?.currentCharacterMood,
      userLevel,
      analyzeMessage,
      generateCharacterResponse,
      addMessage,
    ],
  )

  const completeScenario = useCallback(async () => {
    if (!conversationId || !scenario) return

    try {
      const result = await completeConversation({
        conversationId: conversationId as Id<'conversations'>,
        dailyChallengeId: dailyChallengeId
          ? (dailyChallengeId as Id<'dailyChallenges'>)
          : undefined,
      })
      const stars = starsForScore(result.finalScore)

      const scoredUserMessages = serverMessages.filter(
        (m) => m.role === 'user' && m.nvcScore,
      )
      const averageComponentScores =
        scoredUserMessages.length > 0
          ? {
              observation: averageScore(scoredUserMessages, 'observation'),
              feeling: averageScore(scoredUserMessages, 'feeling'),
              need: averageScore(scoredUserMessages, 'need'),
              request: averageScore(scoredUserMessages, 'request'),
            }
          : undefined

      const isFirstCompletion =
        !scenarioProgress ||
        (scenarioProgress.status !== 'passed' &&
          scenarioProgress.status !== 'mastered')

      // Snapshot the previous best BEFORE updateScenarioProgress overwrites
      // it, so repeat completions are rewarded for improvement only.
      const previousBestStars = scenarioProgress?.bestStars ?? 0
      const previousBestScore = scenarioProgress?.bestScore ?? 0

      await updateScenarioProgress({
        scenarioId: scenarioId as Id<'scenarios'>,
        score: result.finalScore,
        stars,
        status: scenarioStatusForScore(result.finalScore),
        conversationId: conversationId as Id<'conversations'>,
        objectivesCompleted: [],
      })

      const progressResult = await updateUserProgress({
        scenarioId,
        finalScore: result.finalScore,
        finalStars: stars,
        completionStatus: completionStatusForScore(result.finalScore),
        averageComponentScores,
        isFirstCompletion,
        previousBestStars,
        previousBestScore,
        empathyShown: conversation?.milestonesAchieved?.empathyShown ?? false,
      })

      setCompletion({
        finalScore: result.finalScore,
        finalStars: stars,
        pointsEarned: progressResult.pointsEarned,
        newAchievements: progressResult.newAchievements,
      })
    } catch (err) {
      setError('We could not save your results. Please try again.')
    }
  }, [
    conversationId,
    scenario,
    serverMessages,
    scenarioProgress,
    conversation?.milestonesAchieved?.empathyShown,
    dailyChallengeId,
    completeConversation,
    updateScenarioProgress,
    updateUserProgress,
    scenarioId,
  ])

  const startNewConversation = useCallback(async () => {
    if (!currentUser || !scenario) return

    try {
      if (conversationId) {
        await abandonConversation({
          conversationId: conversationId as Id<'conversations'>,
        })
      }

      const newConversationId = await createConversation({
        userId: currentUser._id,
        scenarioId: scenarioId as Id<'scenarios'>,
      })

      // Resetting these here keeps the results screen from flashing before the
      // route swaps to the new conversation id.
      setCompletion(null)
      setError(null)
      seenMilestonesRef.current = null

      // Keep the daily challenge attached so a retry can still credit it
      // (completion of an already-credited challenge is a no-op server-side).
      navigate({
        to: `/practice/${scenarioId}/conversation/${newConversationId}`,
        search: { view: undefined, dailyChallengeId },
      })
    } catch (err) {
      setError('We could not start a new conversation. Please try again.')
    }
  }, [
    currentUser,
    scenario,
    conversationId,
    scenarioId,
    dailyChallengeId,
    abandonConversation,
    createConversation,
    navigate,
  ])

  const rewind = useCallback(async () => {
    if (!conversationId) return
    try {
      await rewindMessages({
        conversationId: conversationId as Id<'conversations'>,
      })
      // Rendered messages follow the conversation query, so nothing to set.
    } catch (err) {
      setError('We could not rewind. Please try again.')
    }
  }, [conversationId, rewindMessages])

  const goToPractice = useCallback(() => {
    navigate({ to: '/practice' })
  }, [navigate])

  const viewTranscript = useCallback(() => {
    navigate({
      to: `/practice/${scenarioId}/transcript/${conversationId}`,
    })
  }, [navigate, scenarioId, conversationId])

  return {
    // data
    scenario,
    conversation,
    currentUser,
    userLevel,
    // derived view data
    messages,
    feedback,
    skillHint,
    isLoading,
    conversationStarted: conversation != null,
    completion,
    celebration,
    error,
    // actions
    sendMessage,
    completeScenario,
    startNewConversation,
    rewind,
    goToPractice,
    viewTranscript,
    dismissCelebration: useCallback(() => setCelebration(null), []),
    dismissError: useCallback(() => setError(null), []),
  }
}

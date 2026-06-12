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
function averageScore(messages: Array<Message>, key: ScoreKey): number {
  if (messages.length === 0) return 0
  const sum = messages.reduce((acc, m) => acc + (m.nvcScore?.[key] ?? 0), 0)
  return sum / messages.length
}

/**
 * Milestone copy, in ascending order of significance. When several flip true at
 * once we celebrate the most meaningful one.
 */
const MILESTONE_CELEBRATIONS: Array<{
  key: 'feelingExpressed' | 'needIdentified' | 'requestMade' | 'resolutionReached'
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
}

export function useConversation({
  scenarioId,
  conversationId,
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
        const analysis = await analyzeMessage({
          userMessage: text,
          conversationHistory: history,
          userLevel,
        })

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
        })
        // The user message now lives on the server; drop the optimistic copy.
        setPending(null)

        const characterResponse = await generateCharacterResponse({
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
          userNVCScore: analysis.total,
          userLevel,
        })

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
      })
      const stars = starsForScore(result.finalScore)
      setCompletion({ finalScore: result.finalScore, finalStars: stars })

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

      await updateScenarioProgress({
        scenarioId: scenarioId as Id<'scenarios'>,
        score: result.finalScore,
        stars,
        status: scenarioStatusForScore(result.finalScore),
        conversationId: conversationId as Id<'conversations'>,
        objectivesCompleted: [],
      })

      await updateUserProgress({
        scenarioId,
        finalScore: result.finalScore,
        finalStars: stars,
        completionStatus: completionStatusForScore(result.finalScore),
        averageComponentScores,
        isFirstCompletion,
      })
    } catch (err) {
      setError('We could not save your results. Please try again.')
    }
  }, [
    conversationId,
    scenario,
    serverMessages,
    scenarioProgress,
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

      navigate({
        to: `/practice/${scenarioId}/conversation/${newConversationId}`,
        search: { view: undefined, dailyChallengeId: undefined },
      })
    } catch (err) {
      setError('We could not start a new conversation. Please try again.')
    }
  }, [
    currentUser,
    scenario,
    conversationId,
    scenarioId,
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

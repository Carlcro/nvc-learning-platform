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
import type { NVCComponent } from '~/lib/conversationInsights'
import { NVC_COMPONENTS } from '~/lib/conversationInsights'
import { userFacingMessage } from '~/lib/errorMessage'
import { localDateString } from '~/lib/localDate'

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

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
  component: NVCComponent
}

/** What completing the conversation changed, beyond the score itself. */
export interface CompletionSummary {
  pointsEarned: number
  challengeBonus: number
  previousBestScore?: number
  levelBefore: number
  levelAfter: number
  pointsToNextLevel: number
  currentStreak: number
  streakExtended: boolean
  newAchievements: Array<EarnedAchievement>
}

export interface Completion {
  finalScore: number
  finalStars: number
  pointsEarned: number
  newAchievements: Array<EarnedAchievement>
  summary: CompletionSummary | null
}

const SKILL_HINT_WINDOW = 3 // look at the last N scored turns
const SKILL_HINT_MIN_SAMPLES = 2 // need repeated evidence, not one rough turn
const SKILL_HINT_THRESHOLD = 12 // avg below this (of 25) suggests a refresher

function deriveSkillHint(messages: Array<Message>): SkillHint | null {
  const recent = messages
    .filter((m) => m.role === 'user' && m.nvcScore)
    .slice(-SKILL_HINT_WINDOW)
  if (recent.length < SKILL_HINT_MIN_SAMPLES) return null

  const components = NVC_COMPONENTS
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

/**
 * Milestone copy, in ascending order of significance. When several flip true at
 * once we celebrate the most meaningful one.
 */
const MILESTONE_CELEBRATIONS: Array<{
  key:
    | 'observationMade'
    | 'feelingExpressed'
    | 'needIdentified'
    | 'requestMade'
    | 'empathyShown'
    | 'resolutionReached'
  title: string
  message: (characterName: string) => string
}> = [
  {
    key: 'observationMade',
    title: 'Clear observation',
    message: () => 'You described what happened without judging it.',
  },
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
  // 'results' reopens the results screen of a finished conversation.
  view?: string
}

export function useConversation({
  scenarioId,
  conversationId,
  dailyChallengeId,
  view,
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

  const submitTurn = useAction(api.ai.submitTurn)
  const generateReflection = useAction(api.ai.generateReflection)

  const completeConversation = useMutation(api.conversations.complete)
  const abandonConversation = useMutation(api.conversations.abandon)
  const createConversation = useMutation(api.conversations.create)
  const rewindMessages = useMutation(api.conversations.rewindLastMessages)

  // --- Ephemeral state ---------------------------------------------------
  const [pending, setPending] = useState<Message | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [justCompleted, setJustCompleted] = useState<Completion | null>(null)
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

  // The results screen shows right after completing, and can be reopened
  // later (view=results) from what the server stored at completion time.
  const completion = useMemo<Completion | null>(() => {
    if (justCompleted) return justCompleted
    if (view !== 'results' || conversation?.status !== 'completed') return null
    const summary = conversation.resultSummary ?? null
    return {
      finalScore: conversation.finalScore ?? 0,
      finalStars: conversation.finalStars ?? 0,
      pointsEarned: summary?.pointsEarned ?? 0,
      newAchievements: summary?.newAchievements ?? [],
      summary,
    }
  }, [justCompleted, view, conversation])

  // One of the user's messages said another way. Written once, server-side,
  // the first time the results are shown; after that it is simply stored.
  const reflection = conversation?.reflection ?? null
  const reflectionRequestedRef = useRef<string | null>(null)
  useEffect(() => {
    if (!completion || !conversationId) return
    if (conversation?.status !== 'completed' || conversation.reflection) return
    if (reflectionRequestedRef.current === conversationId) return
    reflectionRequestedRef.current = conversationId
    // Purely additive: if it cannot be written, the results stand without it.
    generateReflection({
      conversationId: conversationId as Id<'conversations'>,
    }).catch(() => {})
  }, [
    completion,
    conversationId,
    conversation?.status,
    conversation?.reflection,
    generateReflection,
  ])

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
  /**
   * Send one turn. The server analyzes the message, generates the reply, and
   * persists both atomically, so a failed turn leaves nothing half-saved and
   * a retry never duplicates anything.
   *
   * Returns true on success so the input only clears once the message is
   * safely on its way; on failure the composed text stays in the box.
   */
  const sendMessage = useCallback(
    async (text: string): Promise<boolean> => {
      if (!conversationId || isLoading) return false

      const userMsg: Message = {
        role: 'user',
        content: text,
        timestamp: Date.now(),
      }

      setError(null)
      setPending(userMsg)
      setIsLoading(true)

      try {
        await submitTurn({
          conversationId: conversationId as Id<'conversations'>,
          message: text,
        })
        // The turn now lives on the server; drop the optimistic copy.
        setPending(null)
        return true
      } catch (err) {
        setPending(null)
        setError(
          userFacingMessage(
            err,
            'Something went wrong sending your message. Your words are still below, give it another try.',
          ),
        )
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [conversationId, isLoading, submitTurn],
  )

  // Guards completeScenario against double clicks; the server is idempotent
  // as a backstop, but this keeps the UI from firing the pipeline twice.
  const [isCompleting, setIsCompleting] = useState(false)

  const completeScenario = useCallback(async () => {
    if (!conversationId || isCompleting) return

    setIsCompleting(true)
    try {
      // The server computes the final score from its own copy of the
      // conversation and applies scenario progress, points, streak,
      // achievements, and any daily challenge bonus in one transaction.
      const result = await completeConversation({
        conversationId: conversationId as Id<'conversations'>,
        dailyChallengeId: dailyChallengeId
          ? (dailyChallengeId as Id<'dailyChallenges'>)
          : undefined,
        localDate: localDateString(),
      })

      setJustCompleted({
        finalScore: result.finalScore,
        finalStars: result.finalStars,
        pointsEarned: result.pointsEarned,
        newAchievements: result.newAchievements,
        summary: result.summary ?? null,
      })
    } catch (err) {
      setError(
        userFacingMessage(err, 'We could not save your results. Please try again.'),
      )
    } finally {
      setIsCompleting(false)
    }
  }, [conversationId, isCompleting, dailyChallengeId, completeConversation])

  // `focus` carries the takeaway from the results screen into the retry, so
  // the next attempt opens with the one thing worth working on.
  const startNewConversation = useCallback(async (focus?: NVCComponent) => {
    if (!currentUser || !scenario) return

    try {
      if (conversationId) {
        await abandonConversation({
          conversationId: conversationId as Id<'conversations'>,
        })
      }

      const newConversationId = await createConversation({
        scenarioId: scenarioId as Id<'scenarios'>,
      })

      // Resetting these here keeps the results screen from flashing before the
      // route swaps to the new conversation id.
      setJustCompleted(null)
      setError(null)
      seenMilestonesRef.current = null

      // Keep the daily challenge attached so a retry can still credit it
      // (completion of an already-credited challenge is a no-op server-side).
      navigate({
        to: `/practice/${scenarioId}/conversation/${newConversationId}`,
        search: { view: undefined, dailyChallengeId, focus },
      })
    } catch (err) {
      setError(
        userFacingMessage(
          err,
          'We could not start a new conversation. Please try again.',
        ),
      )
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

  /**
   * Take back the last turn. Resolves to the words that were taken back, so
   * the composer can offer them for editing rather than making the user
   * retype a message they only wanted to adjust.
   */
  const rewind = useCallback(async (): Promise<string | null> => {
    if (!conversationId) return null
    const lastUserMessage = [...serverMessages]
      .reverse()
      .find((m) => m.role === 'user')
    try {
      await rewindMessages({
        conversationId: conversationId as Id<'conversations'>,
      })
      // Rendered messages follow the conversation query, so nothing to set.
      return lastUserMessage?.content ?? null
    } catch (err) {
      setError(userFacingMessage(err, 'We could not rewind. Please try again.'))
      return null
    }
  }, [conversationId, rewindMessages, serverMessages])

  const goToPractice = useCallback(() => {
    navigate({ to: '/practice' })
  }, [navigate])

  const viewTranscript = useCallback(() => {
    navigate({
      to: `/practice/${scenarioId}/transcript/${conversationId}`,
      search: { from: 'results' },
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
    isCompleting,
    conversationStarted: conversation != null,
    completion,
    reflection,
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

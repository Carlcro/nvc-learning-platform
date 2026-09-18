import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'
import { userError } from './lib/errors'
import { MAX_USER_TURNS } from './lib/limits'
import { getOrCreateUserProgress } from './lib/userProgressWrite'
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from './_generated/server'
import {
  advanceStreak,
  completionStatusForScore,
  levelForPoints,
  newlyEarnedAchievements,
  pointsForCompletion,
  pointsToNextLevel,
  resolveLocalDate,
  scenarioStatusForScore,
  starsForScore,
  updateAverages,
  utcToday,
} from './lib/progress'
import type { Doc, Id } from './_generated/dataModel'
import type { MutationCtx, QueryCtx } from './_generated/server'

/**
 * Conversations - Core conversation management for roleplay practice.
 *
 * Every function derives the user from the auth context and verifies
 * ownership; a conversation is private to the person practicing in it.
 * Scores are only ever written by the server (ai.submitTurn -> recordTurn),
 * never accepted from the client.
 */

/** Load a conversation and verify it belongs to the authenticated user. */
async function getOwnedConversation(
  ctx: QueryCtx | MutationCtx,
  conversationId: Id<'conversations'>,
): Promise<Doc<'conversations'> | null> {
  const userId = await getAuthUserId(ctx)
  if (userId === null) return null

  const conversation = await ctx.db.get(conversationId)
  if (!conversation || conversation.userId !== userId) return null
  return conversation
}

// ============================================================================
// QUERIES
// ============================================================================

async function findActiveConversation(
  ctx: QueryCtx | MutationCtx,
  userId: Id<'users'>,
  scenarioId: Id<'scenarios'>,
) {
  const conversations = await ctx.db
    .query('conversations')
    .withIndex('by_user_and_scenario', (q) =>
      q.eq('userId', userId).eq('scenarioId', scenarioId),
    )
    .collect()
  return conversations.find((c) => c.status === 'in_progress') ?? null
}

/**
 * Get a conversation by id with full history.
 * Only the owner can read it; anyone else gets null.
 */
export const getById = query({
  args: { conversationId: v.id('conversations') },
  handler: async (ctx, args) => {
    return await getOwnedConversation(ctx, args.conversationId)
  },
})

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Start a conversation in a scenario for the current user.
 * If an in-progress conversation already exists for this scenario (double
 * click, second tab), it is returned instead of creating a parallel one.
 */
export const create = mutation({
  args: { scenarioId: v.id('scenarios') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      userError('Not authenticated')
    }

    const scenario = await ctx.db.get(args.scenarioId)
    if (!scenario) {
      userError('Scenario not found')
    }
    if (scenario.visibility === 'private' && scenario.ownerId !== userId) {
      userError('Scenario not found')
    }

    const existing = await findActiveConversation(ctx, userId, args.scenarioId)
    if (existing) return existing._id

    const now = Date.now()
    return await ctx.db.insert('conversations', {
      userId,
      scenarioId: args.scenarioId,
      messages: [
        {
          role: 'assistant',
          content: scenario.aiOpeningMessage,
          timestamp: now,
        },
      ],
      status: 'in_progress',
      messageCount: 1,
      averageNVCScore: 0,
      currentCharacterMood: scenario.characterInitialMood,
      giraffeStreakCount: 0,
      jackalLanguageCount: 0,
      milestonesAchieved: {
        conversationStarted: true,
        feelingExpressed: false,
        needIdentified: false,
        requestMade: false,
        resolutionReached: false,
        empathyShown: false,
      },
      rewindsUsed: 0,
      maxRewinds: 2,
      objectivesMetInConversation: [],
      createdAt: now,
      lastMessageAt: now,
    })
  },
})

// ============================================================================
// TURN RECORDING (internal, called by ai.submitTurn)
// ============================================================================

const MILESTONE_THRESHOLD = 15 // 15/25 = 60% of a component's max score

/**
 * Internal: everything ai.submitTurn needs to run one turn. Ownership is
 * checked here so the action never operates on someone else's conversation.
 */
export const getForTurn = internalQuery({
  args: {
    conversationId: v.id('conversations'),
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId)
    if (
      !conversation ||
      conversation.userId !== args.userId ||
      conversation.status !== 'in_progress'
    ) {
      return null
    }

    const scenario = await ctx.db.get(conversation.scenarioId)
    if (!scenario) return null

    const progress = await ctx.db
      .query('userProgress')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .first()

    return {
      conversation,
      scenario,
      userLevel: progress?.level ?? 1,
      userTurnCount: countUserTurns(conversation),
    }
  },
})

/** User messages sent so far, which is what the turn cap counts. */
function countUserTurns(conversation: Doc<'conversations'>): number {
  return conversation.messages.filter((m) => m.role === 'user').length
}

/**
 * Internal: persist one full turn (user message with its analysis, plus the
 * character's reply) atomically, updating mood and milestones. A turn either
 * lands completely or not at all, so a retry can never duplicate the user
 * message or lose the reply.
 */
export const recordTurn = internalMutation({
  args: {
    conversationId: v.id('conversations'),
    userId: v.id('users'),
    userContent: v.string(),
    analysis: v.object({
      nvcScore: v.object({
        observation: v.number(),
        feeling: v.number(),
        need: v.number(),
        request: v.number(),
        total: v.number(),
      }),
      feedback: v.string(),
      isJackalLanguage: v.boolean(),
      jackalPhrases: v.array(v.string()),
      giraffeAlternative: v.string(),
      whatWentWell: v.string(),
      empathyShown: v.boolean(),
    }),
    assistantContent: v.string(),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId)
    if (!conversation || conversation.userId !== args.userId) {
      userError('Conversation not found')
    }
    if (conversation.status !== 'in_progress') {
      userError('Conversation is no longer active')
    }
    // Checked again inside the transaction: submitTurn checks before spending
    // on the model, but only this re-read stops two concurrent turns from both
    // landing on the last allowed slot.
    if (countUserTurns(conversation) >= MAX_USER_TURNS) {
      userError('This conversation has run its course.')
    }

    const now = Date.now()
    const { nvcScore } = args.analysis

    // Move the character's mood based on how well this turn moved the
    // conversation toward connection. The total (0-100) is the contextual
    // turn quality, centered at 50: above 50 the character warms up, below
    // 50 they cool down. The shift is gradual (max +/-4 per turn) so a
    // single message never fully transforms them.
    const prevMood = conversation.currentCharacterMood
    const moodDelta = Math.round((nvcScore.total - 50) / 12.5)
    const newMood = Math.max(-10, Math.min(10, prevMood + moodDelta))

    const current = conversation.milestonesAchieved || {
      conversationStarted: true,
      feelingExpressed: false,
      needIdentified: false,
      requestMade: false,
      resolutionReached: false,
      empathyShown: false,
    }

    const milestones = {
      conversationStarted: true,
      feelingExpressed:
        current.feelingExpressed || nvcScore.feeling >= MILESTONE_THRESHOLD,
      needIdentified:
        current.needIdentified || nvcScore.need >= MILESTONE_THRESHOLD,
      requestMade:
        current.requestMade || nvcScore.request >= MILESTONE_THRESHOLD,
      // Resolution requires the character to have opened up (mood >= 5)
      // AND a strong turn (>= 70). Uses the freshly updated mood.
      resolutionReached:
        current.resolutionReached || (newMood >= 5 && nvcScore.total >= 70),
      empathyShown:
        (current.empathyShown ?? false) || args.analysis.empathyShown,
    }

    const messages = [
      ...conversation.messages,
      {
        role: 'user' as const,
        content: args.userContent,
        timestamp: now,
        nvcScore,
        feedback: args.analysis.feedback,
        isJackalLanguage: args.analysis.isJackalLanguage,
        jackalPhrases: args.analysis.jackalPhrases,
        giraffeAlternative: args.analysis.giraffeAlternative,
        whatWentWell: args.analysis.whatWentWell,
        empathyShown: args.analysis.empathyShown,
      },
      {
        role: 'assistant' as const,
        content: args.assistantContent,
        timestamp: now,
        // Stamp the character's mood onto their reply so the transcript can
        // show how they felt at that point, and rewind can restore it.
        characterMood: newMood,
      },
    ]

    await ctx.db.patch(args.conversationId, {
      messages,
      messageCount: messages.length,
      lastMessageAt: now,
      currentCharacterMood: newMood,
      milestonesAchieved: milestones,
      jackalLanguageCount:
        conversation.jackalLanguageCount +
        (args.analysis.isJackalLanguage ? 1 : 0),
    })

    return { success: true }
  },
})

// ============================================================================
// COMPLETION (single server-side pipeline)
// ============================================================================

/**
 * Average a component over the turns where the user actually attempted it
 * (score > 0). Components are scored per turn only when present, so counting
 * absent turns as zeros would punish spreading the arc across the
 * conversation, which is exactly what we teach.
 */
function averageAttempted(
  messages: Doc<'conversations'>['messages'],
  key: 'observation' | 'feeling' | 'need' | 'request',
): number {
  const attempts = messages
    .filter((m) => m.role === 'user' && m.nvcScore)
    .map((m) => m.nvcScore?.[key] ?? 0)
    .filter((score) => score > 0)
  if (attempts.length === 0) return 0
  return attempts.reduce((a, b) => a + b, 0) / attempts.length
}

/**
 * Complete a conversation. Computes the final score from the stored messages,
 * updates scenario progress, points, level, streak, and achievements, and
 * credits the daily challenge when one is attached. All in one transaction,
 * from server-held data only.
 *
 * Idempotent: completing an already-completed conversation returns its stored
 * results without awarding anything twice.
 */
export const complete = mutation({
  args: {
    conversationId: v.id('conversations'),
    dailyChallengeId: v.optional(v.id('dailyChallenges')),
    // The user's local calendar date, so streaks follow their day, not UTC.
    localDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      userError('Not authenticated')
    }

    const conversation = await ctx.db.get(args.conversationId)
    if (!conversation || conversation.userId !== userId) {
      userError('Conversation not found')
    }

    if (conversation.status !== 'in_progress') {
      // Already settled (double click or second tab): report stored results,
      // award nothing again.
      return {
        finalScore: conversation.finalScore ?? 0,
        finalStars: conversation.finalStars ?? 0,
        pointsEarned: 0,
        challengeBonus: 0,
        newAchievements: [],
        alreadyCompleted: true,
      }
    }

    const now = Date.now()
    const today = resolveLocalDate(args.localDate)

    // ---- Final score from server-held messages -------------------------
    const scoredMessages = conversation.messages.filter(
      (m) => m.role === 'user' && m.nvcScore,
    )

    // Nothing was actually said, so there is nothing to reflect on. Settling
    // the conversation here keeps it out of the way without paying out the
    // streak and achievements that a real attempt earns.
    if (scoredMessages.length === 0) {
      await ctx.db.patch(args.conversationId, {
        status: 'abandoned',
        completedAt: now,
      })
      return {
        finalScore: 0,
        finalStars: 0,
        pointsEarned: 0,
        challengeBonus: 0,
        newAchievements: [],
        alreadyCompleted: false,
      }
    }
    const finalScore = Math.round(
      scoredMessages.reduce((sum, m) => sum + (m.nvcScore?.total ?? 0), 0) /
        scoredMessages.length,
    )
    const finalStars = starsForScore(finalScore)
    const completionStatus = completionStatusForScore(finalScore)
    const empathyShown =
      conversation.milestonesAchieved?.empathyShown ?? false

    await ctx.db.patch(args.conversationId, {
      status: 'completed',
      finalScore,
      finalStars,
      completionStatus,
      completedAt: now,
    })

    // ---- Scenario progress ---------------------------------------------
    let scenarioProgress = await ctx.db
      .query('scenarioProgress')
      .withIndex('by_user_and_scenario', (q) =>
        q.eq('userId', userId).eq('scenarioId', conversation.scenarioId),
      )
      .first()

    if (!scenarioProgress) {
      const progressId = await ctx.db.insert('scenarioProgress', {
        userId,
        scenarioId: conversation.scenarioId,
        status: 'available',
        attempts: 0,
        bestScore: 0,
        bestStars: 0,
        lastAttemptAt: now,
        objectivesCompleted: [],
        conversationIds: [],
        createdAt: now,
        updatedAt: now,
      })
      scenarioProgress = await ctx.db.get(progressId)
    }
    if (!scenarioProgress) {
      throw new Error('Failed to load scenario progress')
    }

    // Snapshot the previous best BEFORE overwriting it, so repeat
    // completions are rewarded for improvement only.
    const isFirstCompletion =
      scenarioProgress.status !== 'passed' &&
      scenarioProgress.status !== 'mastered' &&
      scenarioProgress.status !== 'attempted'
    const previousBestStars = scenarioProgress.bestStars
    const previousBestScore = scenarioProgress.bestScore

    const scenarioUpdate: Partial<Doc<'scenarioProgress'>> = {
      status: scenarioStatusForScore(finalScore),
      attempts: scenarioProgress.attempts + 1,
      bestScore: Math.max(scenarioProgress.bestScore, finalScore),
      bestStars: Math.max(scenarioProgress.bestStars, finalStars),
      lastScore: finalScore,
      lastAttemptAt: now,
      conversationIds: [
        ...scenarioProgress.conversationIds,
        args.conversationId,
      ],
      updatedAt: now,
    }
    if (finalScore > previousBestScore) {
      scenarioUpdate.bestConversationId = args.conversationId
    }
    if (isFirstCompletion) {
      scenarioUpdate.firstCompletedAt = now
      scenarioUpdate.firstCompletionScore = finalScore
      scenarioUpdate.firstCompletionStars = finalStars
    }
    await ctx.db.patch(scenarioProgress._id, scenarioUpdate)

    // ---- Daily challenge credit ----------------------------------------
    // A missing challenge (expired or deleted) skips the bonus quietly rather
    // than failing the completion, which already succeeded above.
    let challengeBonus = 0
    const dailyChallenge = args.dailyChallengeId
      ? await ctx.db.get(args.dailyChallengeId)
      : null
    // Yesterday's challenge cannot be cashed in as today's. The date comes
    // from the server, not the client's calendar, since this is a reward
    // rather than a streak and must not be nudged by a device clock.
    const isCurrentChallenge =
      dailyChallenge !== null && dailyChallenge.date === utcToday()

    if (
      dailyChallenge &&
      isCurrentChallenge &&
      dailyChallenge.scenarioId === conversation.scenarioId
    ) {
      const existing = await ctx.db
        .query('challengeCompletions')
        .withIndex('by_user_and_challenge', (q) =>
          q.eq('userId', userId).eq('challengeId', dailyChallenge._id),
        )
        .first()

      if (!existing) {
        await ctx.db.insert('challengeCompletions', {
          userId,
          challengeId: dailyChallenge._id,
          conversationId: args.conversationId,
          completed: true,
          score: finalScore,
          completedAt: now,
        })
        // The bonus is exactly what the challenge card advertises.
        challengeBonus = dailyChallenge.bonusPoints
      }
    }

    // ---- Overall user progress -----------------------------------------
    // Shared with the feelings section, so a first check-in and a first
    // conversation create the same record the same way.
    const progress = await getOrCreateUserProgress(ctx, userId)

    const scenarioPoints = pointsForCompletion({
      finalScore,
      finalStars,
      isFirstCompletion,
      previousBestStars,
      previousBestScore,
    })
    const pointsEarned = scenarioPoints + challengeBonus

    // Passed/mastered count TRANSITIONS (the first time this scenario ever
    // reaches that bar), so a scenario failed on the first try still counts
    // as passed when a later attempt succeeds, and nothing is counted twice.
    const newTotalPoints = progress.totalPoints + pointsEarned
    const newTotals = {
      totalPoints: newTotalPoints,
      totalStars: progress.totalStars + finalStars,
      scenariosCompleted:
        progress.scenariosCompleted + (isFirstCompletion ? 1 : 0),
      scenariosPassed:
        progress.scenariosPassed +
        (finalStars >= 1 && previousBestStars === 0 ? 1 : 0),
      scenariosMastered:
        progress.scenariosMastered +
        (finalStars === 3 && previousBestStars < 3 ? 1 : 0),
    }

    const streak = advanceStreak(
      {
        currentStreak: progress.currentStreak,
        longestStreak: progress.longestStreak,
        lastPracticeDate: progress.lastPracticeDate,
      },
      today,
    )

    const sampleCount = progress.scoredCompletions ?? 0
    const newAverages =
      scoredMessages.length > 0
        ? updateAverages(
            progress.averageScores,
            sampleCount,
            {
              observation: averageAttempted(conversation.messages, 'observation'),
              feeling: averageAttempted(conversation.messages, 'feeling'),
              need: averageAttempted(conversation.messages, 'need'),
              request: averageAttempted(conversation.messages, 'request'),
            },
            finalScore,
          )
        : progress.averageScores

    const achievements = newlyEarnedAchievements(
      {
        scenariosCompleted: newTotals.scenariosCompleted,
        scenariosPassed: newTotals.scenariosPassed,
        scenariosMastered: newTotals.scenariosMastered,
        totalStars: newTotals.totalStars,
        currentStreak: streak.currentStreak,
        finalScore,
        empathyShown,
      },
      progress.achievements,
    )

    await ctx.db.patch(progress._id, {
      ...newTotals,
      level: levelForPoints(newTotalPoints),
      pointsToNextLevel: pointsToNextLevel(newTotalPoints),
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      lastPracticeDate: streak.lastPracticeDate,
      averageScores: newAverages,
      scoredCompletions:
        sampleCount + (scoredMessages.length > 0 ? 1 : 0),
      achievements: [
        ...progress.achievements,
        ...achievements.map((a) => a.id),
      ],
      updatedAt: now,
    })

    return {
      finalScore,
      finalStars,
      pointsEarned,
      challengeBonus,
      newAchievements: achievements.map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
      })),
      alreadyCompleted: false,
    }
  },
})

/**
 * Abandon a conversation (user gives up or starts over).
 * Preserves the conversation for learning purposes.
 */
export const abandon = mutation({
  args: { conversationId: v.id('conversations') },
  handler: async (ctx, args) => {
    const conversation = await getOwnedConversation(ctx, args.conversationId)
    if (!conversation) {
      userError('Conversation not found')
    }
    if (conversation.status !== 'in_progress') {
      return { success: true }
    }

    await ctx.db.patch(args.conversationId, { status: 'abandoned' })
    return { success: true }
  },
})

/**
 * Rewind the last user message and character response, so the user can try a
 * different approach (limited to 2 rewinds per conversation).
 */
export const rewindLastMessages = mutation({
  args: { conversationId: v.id('conversations') },
  handler: async (ctx, args) => {
    const conversation = await getOwnedConversation(ctx, args.conversationId)
    if (!conversation) {
      userError('Conversation not found')
    }

    if (conversation.status !== 'in_progress') {
      userError('Cannot rewind a completed conversation')
    }

    const maxRewinds = conversation.maxRewinds ?? 2
    const rewindsUsed = conversation.rewindsUsed ?? 0

    if (rewindsUsed >= maxRewinds) {
      userError('No rewinds remaining')
    }

    // Need at least 3 messages (opening + user + assistant) to rewind
    if (conversation.messages.length < 3) {
      userError('Not enough messages to rewind')
    }

    // Remove last 2 messages (user message + character response)
    const updatedMessages = conversation.messages.slice(0, -2)

    // Recalculate milestones from the remaining messages. Resolution uses the
    // mood stamped on the character reply that followed each user turn, the
    // same condition the forward path applies (mood >= 5 AND total >= 70).
    let feelingExpressed = false
    let needIdentified = false
    let requestMade = false
    let resolutionReached = false
    let empathyShown = false

    for (let i = 0; i < updatedMessages.length; i++) {
      const msg = updatedMessages[i]
      if (msg.role !== 'user' || !msg.nvcScore) continue

      if (msg.nvcScore.feeling >= MILESTONE_THRESHOLD) feelingExpressed = true
      if (msg.nvcScore.need >= MILESTONE_THRESHOLD) needIdentified = true
      if (msg.nvcScore.request >= MILESTONE_THRESHOLD) requestMade = true
      if (msg.empathyShown) empathyShown = true

      const followingReply =
        i + 1 < updatedMessages.length ? updatedMessages[i + 1] : undefined
      const moodAfterTurn =
        followingReply && followingReply.role === 'assistant'
          ? followingReply.characterMood
          : undefined
      if (
        msg.nvcScore.total >= 70 &&
        (moodAfterTurn === undefined || moodAfterTurn >= 5)
      ) {
        resolutionReached = true
      }
    }

    const updatedMilestones = {
      conversationStarted: true,
      feelingExpressed,
      needIdentified,
      requestMade,
      resolutionReached,
      empathyShown,
    }

    // Roll the character's mood back to where it stood before the rewound
    // turn. Replies carry a mood stamp; fall back to the scenario's initial
    // mood when none of the remaining replies have one (older conversations).
    const lastStampedReply = [...updatedMessages]
      .reverse()
      .find((m) => m.role === 'assistant' && m.characterMood !== undefined)
    const scenario = await ctx.db.get(conversation.scenarioId)
    const restoredMood =
      lastStampedReply?.characterMood ??
      scenario?.characterInitialMood ??
      conversation.currentCharacterMood

    await ctx.db.patch(args.conversationId, {
      messages: updatedMessages,
      messageCount: updatedMessages.length,
      rewindsUsed: rewindsUsed + 1,
      milestonesAchieved: updatedMilestones,
      currentCharacterMood: restoredMood,
      lastMessageAt: Date.now(),
    })

    return {
      success: true,
      rewindsRemaining: maxRewinds - (rewindsUsed + 1),
      messages: updatedMessages,
    }
  },
})

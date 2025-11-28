import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

/**
 * Conversations - Core conversation management for AI roleplay
 *
 * Handles creation, messaging, and completion of NVC practice conversations.
 * Each conversation includes NVC scoring data for learning analytics.
 */

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Get the active conversation for a user in a specific scenario
 * Returns the ongoing conversation or null if none exists
 */
export const getActive = query({
  args: {
    userId: v.id('users'),
    scenarioId: v.id('scenarios'),
  },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query('conversations')
      .withIndex('by_user_and_scenario', (q) =>
        q.eq('userId', args.userId).eq('scenarioId', args.scenarioId),
      )
      .collect()

    // Find the first in_progress conversation
    const conversation = conversations.find((c) => c.status === 'in_progress')
    return conversation || null
  },
})

/**
 * Get a specific conversation by ID with full history
 */
export const getById = query({
  args: { conversationId: v.id('conversations') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.conversationId)
  },
})

/**
 * Get user's conversation history for a scenario
 * Useful for showing past attempts and progress
 */
export const getHistory = query({
  args: {
    userId: v.id('users'),
    scenarioId: v.id('scenarios'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('conversations')
      .withIndex('by_user_and_scenario', (q) =>
        q.eq('userId', args.userId).eq('scenarioId', args.scenarioId),
      )
      .order('desc')
      .collect()
  },
})

/**
 * Get all conversations for a user (across all scenarios)
 * For user dashboard/progress tracking
 */
export const getUserConversations = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('conversations')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .order('desc')
      .collect()
  },
})

/**
 * Get user's completed conversations (for analytics/progress)
 */
export const getUserCompletedConversations = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query('conversations')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .order('desc')
      .collect()

    return conversations.filter((c) => c.status === 'completed')
  },
})

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Create a new conversation for a user in a scenario
 * Initializes with empty messages array and "in_progress" status
 */
export const create = mutation({
  args: {
    userId: v.id('users'),
    scenarioId: v.id('scenarios'),
  },
  handler: async (ctx, args) => {
    const now = Date.now()

    // Get scenario to get initial character mood
    const scenario = await ctx.db.get(args.scenarioId)
    const initialCharacterMood = scenario?.characterInitialMood || 0

    return await ctx.db.insert('conversations', {
      userId: args.userId,
      scenarioId: args.scenarioId,
      messages: [
        {
          role: 'assistant',
          content: scenario?.aiOpeningMessage || '',
          timestamp: now,
        },
      ],
      status: 'in_progress',
      messageCount: 1,
      averageNVCScore: 0,
      currentCharacterMood: initialCharacterMood,
      giraffeStreakCount: 0,
      jackalLanguageCount: 0,
      objectivesMetInConversation: [],
      createdAt: now,
      lastMessageAt: now,
    })
  },
})

/**
 * Add a message to a conversation
 * Supports both user and assistant messages
 * NVC scoring data is optional (only for user messages)
 */
export const addMessage = mutation({
  args: {
    conversationId: v.id('conversations'),
    role: v.union(v.literal('user'), v.literal('assistant')),
    content: v.string(),
    nvcScore: v.optional(
      v.object({
        observation: v.number(),
        feeling: v.number(),
        need: v.number(),
        request: v.number(),
        total: v.number(),
      }),
    ),
    feedback: v.optional(v.string()),
    isJackalLanguage: v.optional(v.boolean()),
    jackalPhrases: v.optional(v.array(v.string())),
    giraffeAlternative: v.optional(v.string()),
    whatWentWell: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { conversationId, role, content, ...scoreData } = args

    const conversation = await ctx.db.get(conversationId)
    if (!conversation) {
      throw new Error('Conversation not found')
    }

    const updatedMessages = [
      ...conversation.messages,
      {
        role,
        content,
        timestamp: Date.now(),
        ...scoreData,
      },
    ]

    await ctx.db.patch(conversationId, {
      messages: updatedMessages,
    })

    return { success: true }
  },
})

/**
 * Complete a conversation and calculate final score
 * Marks conversation as "completed" and stores final NVC score
 * Optionally records daily challenge completion if dailyChallengeId is provided
 */
export const complete = mutation({
  args: {
    conversationId: v.id('conversations'),
    dailyChallengeId: v.optional(v.id('dailyChallenges')),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId)
    if (!conversation) {
      throw new Error('Conversation not found')
    }

    // Calculate average NVC score from all user messages
    const userMessages = conversation.messages.filter(
      (m) => m.role === 'user' && m.nvcScore,
    )

    let finalScore = 0
    if (userMessages.length > 0) {
      const totalScore = userMessages.reduce(
        (sum, m) => sum + (m.nvcScore?.total || 0),
        0,
      )
      finalScore = Math.round(totalScore / userMessages.length)
    }

    // Update conversation
    await ctx.db.patch(args.conversationId, {
      status: 'completed',
      finalScore,
      completedAt: Date.now(),
    })

    // If this is a daily challenge, record the completion
    if (args.dailyChallengeId) {
      const dailyChallenge = await ctx.db.get(args.dailyChallengeId as any)
      if (!dailyChallenge) {
        throw new Error('Daily challenge not found')
      }

      const userId = conversation.userId

      // Check if already completed
      const existing = await ctx.db
        .query('challengeCompletions')
        .withIndex('by_user_and_challenge', (q: any) =>
          q.eq('userId', userId).eq('challengeId', args.dailyChallengeId),
        )
        .first()

      if (!existing) {
        // Record completion
        await ctx.db.insert('challengeCompletions', {
          userId,
          challengeId: args.dailyChallengeId,
          conversationId: args.conversationId,
          completed: true,
          score: finalScore,
          completedAt: Date.now(),
        })

        // Award bonus points (2x multiplier for daily challenges)
        const userProgress = await ctx.db
          .query('userProgress')
          .withIndex('by_user', (q) => q.eq('userId', userId))
          .first()

        if (userProgress) {
          // Base points = score * 1, multiplier = 2x
          const basePoints = finalScore
          const bonusPoints = basePoints * 2
          const totalNewPoints = userProgress.totalPoints + bonusPoints

          await ctx.db.patch(userProgress._id, {
            totalPoints: totalNewPoints,
            updatedAt: Date.now(),
          })
        }

        // Update streak
        await updateStreak(ctx, userId)
      }
    }

    return {
      success: true,
      finalScore,
      messageCount: conversation.messages.length,
    }
  },
})

/**
 * Helper function to update user's practice streak
 * Resets if user missed a day, increments if they practiced today
 */
async function updateStreak(ctx: any, userId: string) {
  const userProgress = await ctx.db
    .query('userProgress')
    .withIndex('by_user', (q: any) => q.eq('userId', userId))
    .first()

  if (!userProgress) return

  const today = new Date().toISOString().split('T')[0]
  const lastPracticeDate = userProgress.lastPracticeDate

  let newStreak = userProgress.currentStreak

  if (lastPracticeDate === today) {
    // Already practiced today, don't increment
    return
  }

  const lastDate = new Date(lastPracticeDate)
  const currentDate = new Date(today)
  const daysDifference = Math.floor(
    (currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
  )

  if (daysDifference === 1) {
    // Practiced yesterday, continue streak
    newStreak = userProgress.currentStreak + 1
  } else if (daysDifference > 1) {
    // Missed at least one day, reset streak
    newStreak = 1
  } else {
    // Same day or future date
    return
  }

  // Update user progress with new streak
  const longestStreak = Math.max(newStreak, userProgress.longestStreak)

  await ctx.db.patch(userProgress._id, {
    currentStreak: newStreak,
    longestStreak,
    lastPracticeDate: today,
    updatedAt: Date.now(),
  })
}

/**
 * Abandon a conversation (user gives up or navigates away)
 * Preserves the conversation for learning purposes
 */
export const abandon = mutation({
  args: {
    conversationId: v.id('conversations'),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.conversationId, {
      status: 'abandoned',
    })
    return { success: true }
  },
})

/**
 * Delete a conversation (for testing or data cleanup)
 * Use with caution - this removes all history
 */
export const deleteConversation = mutation({
  args: {
    conversationId: v.id('conversations'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.conversationId)
    return { success: true }
  },
})

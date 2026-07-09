import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

/**
 * Per-scenario progress for the current user.
 *
 * Progress is written server-side by conversations.complete; this module only
 * reads, plus initializes an empty record when a scenario is first opened.
 *
 * Note on unlocking: scenarios are deliberately never locked. The practice hub
 * shows everything and uses the user's level only for a "recommended" hint, so
 * there is no unlock enforcement here.
 */

/**
 * Get all progress records for the current user
 */
export const getUserProgress = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      return null
    }

    return await ctx.db
      .query('scenarioProgress')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect()
  },
})

/**
 * Get progress for a specific scenario for the current user
 */
export const getScenarioProgress = query({
  args: { scenarioId: v.id('scenarios') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      return null
    }

    const progress = await ctx.db
      .query('scenarioProgress')
      .withIndex('by_user_and_scenario', (q) =>
        q.eq('userId', userId).eq('scenarioId', args.scenarioId),
      )
      .first()

    return progress || null
  },
})

/**
 * Initialize scenario progress when user starts a new scenario
 * Creates a scenarioProgress record if it doesn't exist
 */
export const initializeScenarioProgress = mutation({
  args: { scenarioId: v.id('scenarios') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      throw new Error('Not authenticated')
    }

    const existing = await ctx.db
      .query('scenarioProgress')
      .withIndex('by_user_and_scenario', (q) =>
        q.eq('userId', userId).eq('scenarioId', args.scenarioId),
      )
      .first()

    if (existing) {
      return existing
    }

    const progressId = await ctx.db.insert('scenarioProgress', {
      userId,
      scenarioId: args.scenarioId,
      status: 'available',
      attempts: 0,
      bestScore: 0,
      bestStars: 0,
      lastAttemptAt: Date.now(),
      objectivesCompleted: [],
      conversationIds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    return await ctx.db.get(progressId)
  },
})

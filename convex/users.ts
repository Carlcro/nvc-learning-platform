import { getAuthUserId } from '@convex-dev/auth/server'
import { userError } from './lib/errors'
import { mutation, query } from './_generated/server'

/**
 * Get the current authenticated user
 * Returns null if user is not authenticated
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      return null
    }

    return await ctx.db.get(userId)
  },
})

/**
 * Get the current user's account plus their progress stats.
 *
 * Stats come from the userProgress table, the single source of truth that
 * conversations.complete writes to, so the nav and menus always show live
 * level, points, and streak.
 */
export const getUserProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      return null
    }

    const user = await ctx.db.get(userId)
    if (!user) return null

    const progress = await ctx.db
      .query('userProgress')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first()

    return {
      user,
      profile: {
        level: progress?.level ?? 1,
        totalPoints: progress?.totalPoints ?? 0,
        currentStreak: progress?.currentStreak ?? 0,
        longestStreak: progress?.longestStreak ?? 0,
      },
    }
  },
})

/**
 * Ensure the signed-in user has a progress record.
 * Called once after successful authentication.
 */
export const initializeUserProfile = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      userError('Not authenticated')
    }

    const existing = await ctx.db
      .query('userProgress')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first()

    if (existing) {
      return existing
    }

    const progressId = await ctx.db.insert('userProgress', {
      userId,
      level: 1,
      totalPoints: 0,
      pointsToNextLevel: 300,
      scenariosCompleted: 0,
      scenariosPassed: 0,
      scenariosMastered: 0,
      totalStars: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastPracticeDate: '',
      averageScores: {
        observation: 0,
        feeling: 0,
        need: 0,
        request: 0,
        overall: 0,
      },
      scoredCompletions: 0,
      achievements: [],
      badges: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    return await ctx.db.get(progressId)
  },
})


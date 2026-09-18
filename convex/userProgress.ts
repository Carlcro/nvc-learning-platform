import { getAuthUserId } from '@convex-dev/auth/server'
import { userError } from './lib/errors'
import { mutation, query } from './_generated/server'
import { ACHIEVEMENTS } from './lib/progress'
import { getOrCreateUserProgress } from './lib/userProgressWrite'

/**
 * User overall progress: level, points, streaks, averages, achievements.
 *
 * All writes happen server-side in conversations.complete; this module only
 * reads, plus initializes an empty record on first sign-in.
 */

/**
 * Get user's overall progress
 * Returns level, points, scenarios completed, streaks, and average scores
 */
export const getByUserId = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return null

    const progress = await ctx.db
      .query('userProgress')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first()

    return progress
  },
})

/**
 * Ensure the signed-in user has a progress record.
 *
 * The record itself is created by the shared helper, so this, a conversation
 * completion and a feelings check-in all bootstrap it identically.
 */
export const getOrCreate = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      userError('User not authenticated')
    }
    return await getOrCreateUserProgress(ctx, userId)
  },
})

/**
 * Get progress statistics for display
 * Used primarily for dashboards and progress tracking
 */
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return null

    const progress = await ctx.db
      .query('userProgress')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first()

    if (!progress) return null

    return {
      level: progress.level,
      totalPoints: progress.totalPoints,
      pointsToNextLevel: progress.pointsToNextLevel,
      scenariosCompleted: progress.scenariosCompleted,
      scenariosMastered: progress.scenariosMastered,
      totalStars: progress.totalStars,
      currentStreak: progress.currentStreak,
      longestStreak: progress.longestStreak,
      averageScores: progress.averageScores,
      achievements: progress.achievements,
    }
  },
})

/**
 * The earned achievements with their display copy, for the profile page.
 */
export const getMyAchievements = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return null

    const progress = await ctx.db
      .query('userProgress')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first()

    const earned = new Set(progress?.achievements ?? [])
    return ACHIEVEMENTS.map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      earned: earned.has(a.id),
    }))
  },
})

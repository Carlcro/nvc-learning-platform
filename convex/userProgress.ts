import { getAuthUserId } from '@convex-dev/auth/server'
import { userError } from './lib/errors'
import { mutation, query } from './_generated/server'
import { ACHIEVEMENTS } from './lib/progress'

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
 * Get or create user progress record
 * Initializes a new record if it doesn't exist
 */
export const getOrCreate = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      userError('User not authenticated')
    }

    let progress = await ctx.db
      .query('userProgress')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first()

    if (!progress) {
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
        // Empty until the first completion, so the first practice day
        // correctly starts the streak at 1.
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

      progress = await ctx.db.get(progressId)
    }

    return progress
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

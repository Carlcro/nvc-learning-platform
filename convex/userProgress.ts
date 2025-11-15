import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

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
      throw new Error('User not authenticated')
    }

    // Try to find existing progress
    let progress = await ctx.db
      .query('userProgress')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first()

    // If not found, create new progress record
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
        lastPracticeDate: new Date().toISOString().split('T')[0],
        averageScores: {
          observation: 0,
          feeling: 0,
          need: 0,
          request: 0,
          overall: 0,
        },
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
 * Update user progress after scenario completion
 * Calculates points, updates level, and tracks streaks
 */
export const updateProgress = mutation({
  args: {
    scenarioId: v.string(),
    finalScore: v.number(),
    finalStars: v.number(),
    completionStatus: v.union(
      v.literal('excellent'),
      v.literal('success'),
      v.literal('pass'),
      v.literal('incomplete'),
    ),
    averageComponentScores: v.optional(
      v.object({
        observation: v.number(),
        feeling: v.number(),
        need: v.number(),
        request: v.number(),
      }),
    ),
    isFirstCompletion: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new Error('User not authenticated')
    }

    // Get or create user progress
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
        lastPracticeDate: new Date().toISOString().split('T')[0],
        averageScores: {
          observation: 0,
          feeling: 0,
          need: 0,
          request: 0,
          overall: 0,
        },
        achievements: [],
        badges: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
      progress = await ctx.db.get(progressId)
    }

    // Type guard: ensure progress exists
    if (!progress) {
      throw new Error('Failed to create or retrieve user progress')
    }

    // Calculate points earned
    let pointsEarned = 0

    if (args.isFirstCompletion) {
      // First time completing: 100 points × star rating
      pointsEarned = 100 * args.finalStars
    }

    if (args.finalStars > 0) {
      // All completions award points
      pointsEarned = Math.max(pointsEarned, 100 * args.finalStars)
    }

    // Perfect score bonus
    if (args.finalScore === 100) {
      pointsEarned += 200
    }

    // Calculate new totals
    const newTotalPoints = progress.totalPoints + pointsEarned
    const newTotalStars = progress.totalStars + args.finalStars
    const newScenariosCompleted =
      progress.scenariosCompleted + (args.isFirstCompletion ? 1 : 0)
    const newScenariosPassed =
      progress.scenariosPassed +
      (args.finalStars >= 1 && args.isFirstCompletion ? 1 : 0)
    const newScenariosMastered =
      progress.scenariosMastered +
      (args.finalStars === 3 && args.isFirstCompletion ? 1 : 0)

    // Calculate new level
    let newLevel = 1
    if (newTotalPoints < 300) newLevel = 1
    else if (newTotalPoints < 700) newLevel = 2
    else if (newTotalPoints < 1200) newLevel = 3
    else if (newTotalPoints < 1800) newLevel = 4
    else if (newTotalPoints < 2500) newLevel = 5
    else {
      newLevel = 5 + Math.floor((newTotalPoints - 2500) / 800)
    }

    // Calculate points to next level
    const levelThresholds = [0, 300, 700, 1200, 1800, 2500]
    let pointsToNextLevel = 300
    if (newLevel <= 5) {
      pointsToNextLevel = (levelThresholds[newLevel] || 2500) - newTotalPoints
    } else {
      const nextLevelThreshold = 2500 + (newLevel - 4) * 800
      pointsToNextLevel = nextLevelThreshold - newTotalPoints
    }
    pointsToNextLevel = Math.max(0, pointsToNextLevel)

    // Update streak
    const today = new Date().toISOString().split('T')[0]
    const lastDate = progress.lastPracticeDate
    let newCurrentStreak = progress.currentStreak
    let newLongestStreak = progress.longestStreak

    if (lastDate === today) {
      // Same day - don't increment streak
      newCurrentStreak = progress.currentStreak
    } else {
      const lastDateObj = new Date(lastDate)
      const todayObj = new Date(today)
      const daysDiff = Math.floor(
        (todayObj.getTime() - lastDateObj.getTime()) / (1000 * 60 * 60 * 24),
      )

      if (daysDiff === 1) {
        // Consecutive day - increment streak
        newCurrentStreak = progress.currentStreak + 1
      } else {
        // Not consecutive - reset streak
        newCurrentStreak = 1
      }
    }

    newLongestStreak = Math.max(newCurrentStreak, progress.longestStreak)

    // Update average component scores
    let newAverageScores = { ...progress.averageScores }
    if (args.averageComponentScores) {
      // Simple running average (can be improved with weighted average)
      newAverageScores = {
        observation:
          (progress.averageScores.observation +
            args.averageComponentScores.observation) /
          2,
        feeling:
          (progress.averageScores.feeling +
            args.averageComponentScores.feeling) /
          2,
        need:
          (progress.averageScores.need + args.averageComponentScores.need) / 2,
        request:
          (progress.averageScores.request +
            args.averageComponentScores.request) /
          2,
        overall: args.finalScore,
      }
    }

    // Update progress record
    const updatedProgress = await ctx.db.patch(progress._id, {
      level: newLevel,
      totalPoints: newTotalPoints,
      pointsToNextLevel,
      scenariosCompleted: newScenariosCompleted,
      scenariosPassed: newScenariosPassed,
      scenariosMastered: newScenariosMastered,
      totalStars: newTotalStars,
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      lastPracticeDate: today,
      averageScores: newAverageScores,
      updatedAt: Date.now(),
    })

    return updatedProgress
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
    }
  },
})

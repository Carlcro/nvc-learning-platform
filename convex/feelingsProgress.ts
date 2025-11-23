import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

/**
 * User Feelings Progress Functions
 * Handles daily check-ins, streak tracking, and progress stats
 */

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Get user's overall feelings learning progress
 */
export const getUserProgress = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const progress = await ctx.db
      .query('userFeelingsProgress')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .first()

    if (!progress) {
      return null
    }

    return {
      ...progress,
      totalFeelingsLearned: progress.feelingsExplored.length,
      totalFeelingsSaved: progress.feelingsSaved.length,
    }
  },
})

/**
 * Get user's daily check-in history
 */
export const getCheckInHistory = query({
  args: { userId: v.id('users'), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const progress = await ctx.db
      .query('userFeelingsProgress')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .first()

    if (!progress) {
      return []
    }

    const limit = args.limit || 30
    return progress.dailyCheckIns.slice(-limit).reverse()
  },
})

/**
 * Get user's emotional stats and patterns
 */
export const getStats = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const progress = await ctx.db
      .query('userFeelingsProgress')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .first()

    if (!progress) {
      return null
    }

    // Calculate feeling frequency
    const feelingFrequency: Record<string, number> = {}
    for (const checkIn of progress.dailyCheckIns) {
      for (const feeling of checkIn.feelings) {
        feelingFrequency[feeling] = (feelingFrequency[feeling] || 0) + 1
      }
    }

    // Get top 5 most common feelings
    const topFeelings = Object.entries(feelingFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([feeling]) => feeling)

    return {
      totalCheckIns: progress.dailyCheckIns.length,
      currentStreak: progress.currentCheckInStreak,
      longestStreak: progress.longestCheckInStreak,
      lastCheckIn: progress.lastCheckInDate,
      mostCommonFeelings: topFeelings,
      quizScore: progress.quizScore,
      quizLevel: progress.quizLevel,
      totalFeelingsExplored: progress.feelingsExplored.length,
    }
  },
})

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Record a daily feelings check-in
 */
export const recordCheckIn = mutation({
  args: {
    userId: v.id('users'),
    feelings: v.array(v.string()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const today = new Date().toISOString().split('T')[0]

    let progress = await ctx.db
      .query('userFeelingsProgress')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .first()

    if (!progress) {
      const progressId = await ctx.db.insert('userFeelingsProgress', {
        userId: args.userId,
        feelingsExplored: [],
        feelingsSaved: [],
        quizQuestionsAnswered: 0,
        quizQuestionsCorrect: 0,
        quizScore: 0,
        quizLevel: 1,
        dailyCheckIns: [],
        currentCheckInStreak: 0,
        longestCheckInStreak: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
      progress = await ctx.db.get(progressId)
    }

    if (!progress) {
      throw new Error('Failed to create or retrieve user progress')
    }

    // Check if already checked in today
    const existingToday = progress.dailyCheckIns.find((c) => c.date === today)

    let updatedCheckIns = [...progress.dailyCheckIns]
    let newStreak = progress.currentCheckInStreak
    let newLongestStreak = progress.longestCheckInStreak

    if (existingToday) {
      // Update today's check-in
      updatedCheckIns = updatedCheckIns.map((c) =>
        c.date === today
          ? {
              ...c,
              feelings: args.feelings,
              note: args.note,
              timestamp: Date.now(),
            }
          : c,
      )
    } else {
      // New check-in - update streak
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0]
      const lastCheckInDate = progress.lastCheckInDate

      if (lastCheckInDate === yesterday) {
        // Streak continues
        newStreak = progress.currentCheckInStreak + 1
      } else if (lastCheckInDate === today) {
        // Already checked in today
        newStreak = progress.currentCheckInStreak
      } else {
        // Streak broken, starting new
        newStreak = 1
      }

      if (newStreak > newLongestStreak) {
        newLongestStreak = newStreak
      }

      updatedCheckIns.push({
        date: today,
        feelings: args.feelings,
        note: args.note,
        timestamp: Date.now(),
      })
    }

    await ctx.db.patch(progress._id, {
      dailyCheckIns: updatedCheckIns,
      currentCheckInStreak: newStreak,
      longestCheckInStreak: newLongestStreak,
      lastCheckInDate: today,
      updatedAt: Date.now(),
    })

    return progress._id
  },
})

/**
 * Update quiz progress and level
 */
export const updateQuizProgress = mutation({
  args: {
    userId: v.id('users'),
    correct: v.boolean(),
    level: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let progress = await ctx.db
      .query('userFeelingsProgress')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .first()

    if (!progress) {
      const progressId = await ctx.db.insert('userFeelingsProgress', {
        userId: args.userId,
        feelingsExplored: [],
        feelingsSaved: [],
        quizQuestionsAnswered: 0,
        quizQuestionsCorrect: 0,
        quizScore: 0,
        quizLevel: 1,
        dailyCheckIns: [],
        currentCheckInStreak: 0,
        longestCheckInStreak: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
      progress = await ctx.db.get(progressId)
    }

    if (!progress) {
      throw new Error('Failed to create or retrieve user progress')
    }

    const newTotal = progress.quizQuestionsAnswered + 1
    const newCorrect = args.correct
      ? progress.quizQuestionsCorrect + 1
      : progress.quizQuestionsCorrect
    const newScore = Math.round((newCorrect / newTotal) * 100)

    // Auto-level up if 80%+ correct in 10 questions
    let newLevel = args.level || progress.quizLevel
    if (newTotal % 10 === 0 && newScore >= 80 && newLevel < 3) {
      newLevel = Math.min(newLevel + 1, 3)
    }

    await ctx.db.patch(progress._id, {
      quizQuestionsAnswered: newTotal,
      quizQuestionsCorrect: newCorrect,
      quizScore: newScore,
      quizLevel: newLevel,
      updatedAt: Date.now(),
    })

    return {
      progressId: progress._id,
      score: newScore,
      level: newLevel,
      leveledUp: newLevel > (args.level || progress.quizLevel),
    }
  },
})

/**
 * Get today's check-in (if it exists)
 */
export const getTodayCheckIn = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const today = new Date().toISOString().split('T')[0]

    const progress = await ctx.db
      .query('userFeelingsProgress')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .first()

    if (!progress) {
      return null
    }

    return progress.dailyCheckIns.find((c) => c.date === today) || null
  },
})

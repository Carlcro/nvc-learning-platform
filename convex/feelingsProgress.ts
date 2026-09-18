import { v } from 'convex/values'
import { getAuthUserId } from '@convex-dev/auth/server'
import { userError } from './lib/errors'
import { mutation, query } from './_generated/server'
import { advanceStreak, resolveLocalDate } from './lib/progress'
import { creditDailyPractice } from './lib/userProgressWrite'
import { getOrCreateFeelingsProgress } from './feelings'

/**
 * User Feelings Progress Functions
 * Handles daily check-ins, streak tracking, and progress stats.
 *
 * Everything is scoped to the authenticated user; check-ins (which can hold
 * personal notes) are never readable by anyone else. Check-in days follow the
 * user's local calendar date, sent by the client and validated server-side.
 */

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Get the current user's overall feelings learning progress
 */
export const getUserProgress = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) return null

    const progress = await ctx.db
      .query('userFeelingsProgress')
      .withIndex('by_user', (q) => q.eq('userId', userId))
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
 * Get the current user's daily check-in history
 */
export const getCheckInHistory = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) return []

    const progress = await ctx.db
      .query('userFeelingsProgress')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first()

    if (!progress) {
      return []
    }

    const limit = args.limit || 30
    return progress.dailyCheckIns.slice(-limit).reverse()
  },
})

/**
 * Get the current user's emotional stats and patterns
 */
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) return null

    const progress = await ctx.db
      .query('userFeelingsProgress')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first()

    if (!progress) {
      return {
        totalCheckIns: 0,
        checkInStreak: 0,
        longestCheckInStreak: 0,
        lastCheckIn: undefined,
        mostCommonFeelings: [],
        quizScore: 0,
        quizLevel: 1,
        totalFeelingsExplored: 0,
      }
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
      checkInStreak: progress.currentCheckInStreak,
      longestCheckInStreak: progress.longestCheckInStreak,
      lastCheckIn: progress.lastCheckInDate,
      mostCommonFeelings: topFeelings,
      quizScore: progress.quizScore,
      quizLevel: progress.quizLevel,
      totalFeelingsExplored: progress.feelingsExplored.length,
    }
  },
})

/**
 * Get today's check-in for the current user (if it exists).
 * "Today" is the client's local date when provided.
 */
export const getTodayCheckIn = query({
  args: { localDate: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) return null

    const today = resolveLocalDate(args.localDate)

    const progress = await ctx.db
      .query('userFeelingsProgress')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first()

    if (!progress) {
      return null
    }

    return progress.dailyCheckIns.find((c) => c.date === today) || null
  },
})

/**
 * Get weekly patterns and insights for the current user
 */
export const getWeeklyPatterns = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) return null

    const progress = await ctx.db
      .query('userFeelingsProgress')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first()

    if (!progress || progress.dailyCheckIns.length === 0) {
      return null
    }

    // Get check-ins from the last 7 days
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const oneWeekAgoStr = oneWeekAgo.toISOString().split('T')[0]

    const weeklyCheckIns = progress.dailyCheckIns.filter(
      (c) => c.date >= oneWeekAgoStr,
    )

    if (weeklyCheckIns.length === 0) {
      return null
    }

    // Calculate feeling frequency this week
    const weeklyFrequency: Record<string, number> = {}
    for (const checkIn of weeklyCheckIns) {
      for (const feeling of checkIn.feelings) {
        weeklyFrequency[feeling] = (weeklyFrequency[feeling] || 0) + 1
      }
    }

    // Get feelings that appeared repeatedly
    const frequentFeelings = Object.entries(weeklyFrequency)
      .filter(([, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)

    // Map feelings to related needs (simplified mapping)
    const feelingToNeeds: Partial<Record<string, Array<string>>> = {
      anxious: ['safety', 'clarity', 'predictability'],
      worried: ['safety', 'clarity', 'predictability'],
      frustrated: ['ease', 'efficiency', 'progress'],
      angry: ['respect', 'fairness', 'autonomy'],
      sad: ['comfort', 'connection', 'understanding'],
      lonely: ['connection', 'belonging', 'companionship'],
      grateful: ['appreciation', 'connection', 'abundance'],
      happy: ['fulfillment', 'celebration', 'joy'],
      excited: ['stimulation', 'growth', 'adventure'],
      tired: ['rest', 'ease', 'balance'],
      confused: ['clarity', 'understanding', 'direction'],
      hopeful: ['meaning', 'growth', 'possibility'],
      content: ['peace', 'satisfaction', 'harmony'],
      scared: ['safety', 'protection', 'support'],
    }

    // Generate insights
    const insights = frequentFeelings.map(([feeling, count]) => ({
      feeling,
      count,
      relatedNeeds: feelingToNeeds[feeling.toLowerCase()] ?? [
        'understanding',
        'connection',
      ],
    }))

    // Count pleasant vs unpleasant
    const pleasantFeelings = [
      'happy',
      'grateful',
      'excited',
      'content',
      'hopeful',
      'peaceful',
      'joyful',
      'calm',
      'relieved',
    ]
    let pleasantCount = 0
    let unpleasantCount = 0

    for (const [feeling, count] of Object.entries(weeklyFrequency)) {
      if (pleasantFeelings.includes(feeling.toLowerCase())) {
        pleasantCount += count
      } else {
        unpleasantCount += count
      }
    }

    const totalFeelings = pleasantCount + unpleasantCount
    const pleasantPercent =
      totalFeelings > 0 ? Math.round((pleasantCount / totalFeelings) * 100) : 0

    return {
      checkInCount: weeklyCheckIns.length,
      frequentFeelings: insights,
      pleasantPercent,
      unpleasantPercent: 100 - pleasantPercent,
      uniqueFeelings: Object.keys(weeklyFrequency).length,
    }
  },
})

// ============================================================================
// MUTATIONS
// ============================================================================

const MAX_CHECKIN_FEELINGS = 10
/** Points for showing up and naming how you feel on a new day. */
const CHECK_IN_POINTS = 20
const MAX_NOTE_LENGTH = 1000

/**
 * Record a daily feelings check-in for the current user
 */
export const recordCheckIn = mutation({
  args: {
    feelings: v.array(v.string()),
    note: v.optional(v.string()),
    // The user's local calendar date, so an evening check-in counts for
    // their own day, not the UTC day.
    localDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) userError('Not authenticated')

    if (args.feelings.length === 0) {
      userError('Pick at least one feeling')
    }
    if (args.feelings.length > MAX_CHECKIN_FEELINGS) {
      userError('Too many feelings selected')
    }
    if (args.note && args.note.length > MAX_NOTE_LENGTH) {
      userError('Note is too long')
    }

    // Check-in feelings are stored and rendered back, so they have to be
    // words we know rather than whatever the client sends.
    const known = await Promise.all(
      args.feelings.map(async (word) => {
        const match = await ctx.db
          .query('feelings')
          .withIndex('by_word', (q) => q.eq('word', word))
          .first()
        return match?.word
      }),
    )
    if (known.some((word) => word === undefined)) {
      userError('One of those is not a feeling we recognise.')
    }
    const feelings = known as Array<string>

    const today = resolveLocalDate(args.localDate)
    const progress = await getOrCreateFeelingsProgress(ctx, userId)

    // Check if already checked in today
    const existingToday = progress.dailyCheckIns.find((c) => c.date === today)

    let updatedCheckIns = [...progress.dailyCheckIns]

    if (existingToday) {
      // Revising today's check-in, which earns nothing further.
      updatedCheckIns = updatedCheckIns.map((c) =>
        c.date === today
          ? {
              ...c,
              feelings,
              note: args.note,
              timestamp: Date.now(),
            }
          : c,
      )

      await ctx.db.patch(progress._id, {
        dailyCheckIns: updatedCheckIns,
        updatedAt: Date.now(),
      })
      return { pointsEarned: 0, newAchievements: [] }
    }

    // Shared streak rules rather than a second copy: the version here used to
    // reset the streak to 1 on a backdated date instead of ignoring it.
    const checkInStreak = advanceStreak(
      {
        currentStreak: progress.currentCheckInStreak,
        longestStreak: progress.longestCheckInStreak,
        lastPracticeDate: progress.lastCheckInDate ?? '',
      },
      today,
    )

    updatedCheckIns.push({
      date: today,
      feelings,
      note: args.note,
      timestamp: Date.now(),
    })

    await ctx.db.patch(progress._id, {
      dailyCheckIns: updatedCheckIns,
      currentCheckInStreak: checkInStreak.currentStreak,
      longestCheckInStreak: checkInStreak.longestStreak,
      lastCheckInDate: today,
      updatedAt: Date.now(),
    })

    // Naming how you feel is practice, so it counts toward the same points,
    // level and streak as a conversation does.
    const credited = await creditDailyPractice(ctx, {
      userId,
      points: CHECK_IN_POINTS,
      today,
    })

    return {
      pointsEarned: CHECK_IN_POINTS,
      newAchievements: credited.newAchievements.map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
      })),
    }
  },
})

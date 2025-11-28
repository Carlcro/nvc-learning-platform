import { v } from 'convex/values'
import { getAuthUserId } from '@convex-dev/auth/server'
import {
  internalAction,
  internalMutation,
  mutation,
  query,
} from './_generated/server'
import { internal } from './_generated/api'

/**
 * Daily Challenge System
 *
 * Manages daily challenges for users - tracks completion, streaks, and points
 * AI scenario generation is handled in dailyChallengesGeneration.ts
 */

interface GeneratedScenario {
  title: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  characterName: string
  characterPersonality: string
  characterInitialMood: number
  situation: string
  aiOpeningMessage: string
  learningObjectives: Array<string>
  focusArea: string
}

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Get today's daily challenge
 * Also checks if the user has completed it
 */
export const getDailyChallenge = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0]

    // Find challenge for today
    const challenge = await ctx.db
      .query('dailyChallenges')
      .withIndex('by_date', (q) => q.eq('date', today))
      .first()

    if (!challenge) return null

    let completed = false
    if (userId) {
      const completion = await ctx.db
        .query('challengeCompletions')
        .withIndex('by_user_and_challenge', (q) =>
          q.eq('userId', userId).eq('challengeId', challenge._id),
        )
        .first()

      completed = !!completion?.completed
    }

    return {
      ...challenge,
      completed,
    }
  },
})

/**
 * Get the challenge appropriate for the current user
 * Considers user level and recent performance
 */
export const getMyChallenge = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return null

    // Get user progress
    const userProgress = await ctx.db
      .query('userProgress')
      .withIndex('by_user', (q: any) => q.eq('userId', userId))
      .first()

    if (!userProgress) return null

    // Get today's challenge
    const today = new Date().toISOString().split('T')[0]
    const dailyChallenge = await ctx.db
      .query('dailyChallenges')
      .withIndex('by_date', (q) => q.eq('date', today))
      .first()

    if (!dailyChallenge) return null

    // Check if user has completed today's challenge
    const completion = await ctx.db
      .query('challengeCompletions')
      .withIndex('by_user_and_challenge', (q) =>
        q.eq('userId', userId).eq('challengeId', dailyChallenge._id),
      )
      .first()

    const completed = !!completion?.completed

    // Determine recommended difficulty based on user level
    const recommendedDifficulty = determineUserDifficulty(
      userProgress.level,
      userProgress.averageScores.overall,
    )

    return {
      ...dailyChallenge,
      completed,
      recommendedDifficulty,
      userLevel: userProgress.level,
    }
  },
})

/**
 * Get challenges for a specific date
 */
export const getChallengesByDate = query({
  args: {
    date: v.string(), // "2025-11-23"
  },
  handler: async (ctx, args) => {
    const challenges = await ctx.db
      .query('dailyChallenges')
      .withIndex('by_date', (q) => q.eq('date', args.date))
      .collect()

    return challenges
  },
})

/**
 * Get user's challenge streak and stats
 */
export const getUserChallengeStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return null

    // Get user progress
    const userProgress = await ctx.db
      .query('userProgress')
      .withIndex('by_user', (q: any) => q.eq('userId', userId))
      .first()

    if (!userProgress) return null

    // Get all completions for this user
    const completions = await ctx.db
      .query('challengeCompletions')
      .withIndex('by_user', (q: any) => q.eq('userId', userId))
      .collect()

    // Calculate stats
    const completedCount = completions.filter((c) => c.completed).length
    const averageScore =
      completions.length > 0
        ? completions.reduce((sum, c) => sum + c.score, 0) / completions.length
        : 0

    return {
      currentStreak: userProgress.currentStreak,
      longestStreak: userProgress.longestStreak,
      completedCount,
      averageScore: Math.round(averageScore),
      totalPoints: userProgress.totalPoints,
      level: userProgress.level,
    }
  },
})

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Mark daily challenge as complete
 * Awards bonus points to the user
 */
export const completeDailyChallenge = mutation({
  args: {
    challengeId: v.id('dailyChallenges'),
    conversationId: v.id('conversations'),
    score: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('Unauthorized')

    const challenge = await ctx.db.get(args.challengeId)
    if (!challenge) throw new Error('Challenge not found')

    // Check if already completed
    const existing = await ctx.db
      .query('challengeCompletions')
      .withIndex('by_user_and_challenge', (q) =>
        q.eq('userId', userId).eq('challengeId', args.challengeId),
      )
      .first()

    if (existing) return // Already completed

    // Record completion
    await ctx.db.insert('challengeCompletions', {
      userId,
      challengeId: args.challengeId,
      conversationId: args.conversationId,
      completed: true,
      score: args.score,
      completedAt: Date.now(),
    })

    // Award bonus points (2x multiplier)
    const userProgress = await ctx.db
      .query('userProgress')
      .withIndex('by_user', (q: any) => q.eq('userId', userId))
      .first()

    if (userProgress) {
      // Calculate points with 2x multiplier
      const basePoints = Math.round(args.score) // 1 point per score point
      const bonusPoints = basePoints * 2 // 2x multiplier for daily challenge
      const totalNewPoints = userProgress.totalPoints + bonusPoints

      // Update user progress
      await ctx.db.patch(userProgress._id, {
        totalPoints: totalNewPoints,
        updatedAt: Date.now(),
      })
    }

    // Update streak
    await updateStreak(ctx, userId)

    return {
      pointsAwarded: challenge.bonusPoints * 2,
      newStreak: userProgress?.currentStreak || 1,
    }
  },
})

/**
 * Seed a challenge for today (for testing/demo)
 */
export const seedDailyChallenge = mutation({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split('T')[0]

    // Check if exists
    const existing = await ctx.db
      .query('dailyChallenges')
      .withIndex('by_date', (q) => q.eq('date', today))
      .first()

    if (existing) return existing._id

    // Get a random scenario to link to
    const scenario = await ctx.db.query('scenarios').first()
    if (!scenario) throw new Error('No scenarios found to link challenge to')

    const challengeId = await ctx.db.insert('dailyChallenges', {
      date: today,
      scenarioId: scenario._id,
      difficulty: 'medium',
      description:
        'Practice expressing your needs clearly in a workplace conflict.',
      bonusPoints: 50,
      createdAt: Date.now(),
    })

    return challengeId
  },
})

// ============================================================================
// INTERNAL MUTATIONS & ACTIONS
// ============================================================================

/**
 * Internal: Generate daily challenges (called by cron job)
 * Creates 3 new scenarios for beginner, intermediate, and advanced levels
 * Links to existing scenarios or uses fallback scenarios
 */
export const generateDailyChallenge = internalAction({
  args: {},
  handler: async (ctx) => {
    try {
      // Generate 3 scenario templates (beginner, intermediate, advanced)
      const generatedScenarios = await ctx.runAction(
        internal.dailyChallengesGeneration.generateThreeScenarios,
      )

      // Call mutation to save the challenges
      await ctx.runMutation(internal.dailyChallenges.saveGeneratedChallenges, {
        generatedScenarios,
      })
    } catch (error) {
      console.error('Error generating daily challenges:', error)
      throw error
    }
  },
})

/**
 * Internal: Save generated scenarios as daily challenges
 * Maps generated scenarios to existing scenarios in the database
 */
export const saveGeneratedChallenges = internalMutation({
  args: {
    generatedScenarios: v.array(
      v.object({
        title: v.string(),
        description: v.string(),
        category: v.string(),
        difficulty: v.string(),
        characterName: v.string(),
        characterPersonality: v.string(),
        characterInitialMood: v.number(),
        situation: v.string(),
        aiOpeningMessage: v.string(),
        learningObjectives: v.array(v.string()),
        focusArea: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const today = new Date().toISOString().split('T')[0]

    // Check if challenge already exists for today
    const existing = await ctx.db
      .query('dailyChallenges')
      .withIndex('by_date', (q: any) => q.eq('date', today))
      .first()

    if (existing) {
      console.log(`Daily challenge already exists for ${today}`)
      return
    }

    try {
      // Get existing scenarios to link to
      const allScenarios = await ctx.db.query('scenarios').collect()
      const beginnerScenarios = allScenarios.filter(
        (s) => s.difficulty === 'beginner',
      )
      const intermediateScenarios = allScenarios.filter(
        (s) => s.difficulty === 'intermediate',
      )
      const advancedScenarios = allScenarios.filter(
        (s) => s.difficulty === 'advanced',
      )

      // Create challenges by mapping to existing scenarios
      const challengesToCreate = [
        {
          generated: args.generatedScenarios[0],
          existingScenarios: beginnerScenarios,
          difficulty: 'easy' as const,
        },
        {
          generated: args.generatedScenarios[1],
          existingScenarios: intermediateScenarios,
          difficulty: 'medium' as const,
        },
        {
          generated: args.generatedScenarios[2],
          existingScenarios: advancedScenarios,
          difficulty: 'hard' as const,
        },
      ]

      for (const challenge of challengesToCreate) {
        // Select a random existing scenario of the appropriate difficulty
        let scenarioId: any = null
        if (challenge.existingScenarios.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * challenge.existingScenarios.length,
          )
          scenarioId = challenge.existingScenarios[randomIndex]._id
        } else {
          // Fallback: use any scenario
          const fallback = allScenarios[0]

          scenarioId = fallback._id
        }

        await ctx.db.insert('dailyChallenges', {
          date: today,
          scenarioId,
          difficulty: challenge.difficulty,
          description: challenge.generated.description,
          bonusPoints: calculateBonusPoints(challenge.difficulty),
          createdAt: Date.now(),
        })

        console.log(
          `Created ${challenge.difficulty} daily challenge for ${today}:`,
          challenge.generated.title,
        )
      }

      console.log(`Generated daily challenges for ${today}`)
    } catch (error) {
      console.error('Error saving daily challenges:', error)
      throw error
    }
  },
})

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Determine recommended difficulty based on user level and recent performance
 */
function determineUserDifficulty(
  userLevel: number,
  averageScore: number,
): 'easy' | 'medium' | 'hard' {
  if (userLevel <= 2) {
    return 'easy'
  } else if (userLevel <= 5) {
    // Intermediate: adjust based on recent performance
    if (averageScore >= 80) {
      return 'hard'
    }
    return 'medium'
  } else {
    // Level 6+
    if (averageScore >= 75) {
      return 'hard'
    }
    return 'medium'
  }
}

/**
 * Calculate bonus points based on difficulty
 */
function calculateBonusPoints(difficulty: 'easy' | 'medium' | 'hard'): number {
  const basePoints = {
    easy: 50,
    medium: 75,
    hard: 100,
  }
  return basePoints[difficulty]
}

/**
 * Update user's practice streak
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

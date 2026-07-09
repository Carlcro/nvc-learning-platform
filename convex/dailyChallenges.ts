import { v } from 'convex/values'
import { getAuthUserId } from '@convex-dev/auth/server'
import { internalAction, internalMutation, query } from './_generated/server'
import { internal } from './_generated/api'
import { utcToday } from './lib/progress'

/**
 * Daily Challenge System
 *
 * A cron generates three fresh scenarios each day (easy, medium, hard) and
 * stores them as real, playable scenario rows. Queries pick the challenge
 * matching the user's recommended difficulty. Completion crediting and the
 * bonus award happen server-side in conversations.complete, and the bonus
 * awarded is exactly the challenge's advertised bonusPoints.
 *
 * Challenge days follow UTC (the cron runs at midnight UTC); practice streaks
 * follow the user's local calendar day.
 */

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Today's challenges plus which one fits this user best.
 *
 * Returns the recommended challenge (falling back across difficulties when a
 * day has fewer than three), the other difficulties as alternatives, and the
 * user's completion state for today.
 */
export const getMyChallenge = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return null

    const today = utcToday()
    const challenges = await ctx.db
      .query('dailyChallenges')
      .withIndex('by_date', (q) => q.eq('date', today))
      .collect()

    if (challenges.length === 0) return null

    const userProgress = await ctx.db
      .query('userProgress')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first()

    const recommendedDifficulty = determineUserDifficulty(
      userProgress?.level ?? 1,
      userProgress?.averageScores.overall ?? 0,
    )

    // Pick the challenge matching the recommendation, falling back to the
    // nearest easier one, then anything.
    const byDifficulty = (d: 'easy' | 'medium' | 'hard') =>
      challenges.find((c) => c.difficulty === d)
    const fallbackOrder: Record<
      'easy' | 'medium' | 'hard',
      Array<'easy' | 'medium' | 'hard'>
    > = {
      easy: ['easy', 'medium', 'hard'],
      medium: ['medium', 'easy', 'hard'],
      hard: ['hard', 'medium', 'easy'],
    }
    const recommended = fallbackOrder[recommendedDifficulty]
      .map(byDifficulty)
      .find(Boolean)
    if (!recommended) return null

    // Completion state: a completion of ANY of today's challenges counts as
    // having done today's challenge.
    let completedChallengeId = null
    let completedScore = null
    for (const challenge of challenges) {
      const completion = await ctx.db
        .query('challengeCompletions')
        .withIndex('by_user_and_challenge', (q) =>
          q.eq('userId', userId).eq('challengeId', challenge._id),
        )
        .first()
      if (completion?.completed) {
        completedChallengeId = challenge._id
        completedScore = completion.score
        break
      }
    }

    return {
      ...recommended,
      completed: completedChallengeId !== null,
      completedChallengeId,
      completedScore,
      recommendedDifficulty,
      userLevel: userProgress?.level ?? 1,
      alternatives: challenges
        .filter((c) => c._id !== recommended._id)
        .map((c) => ({
          _id: c._id,
          scenarioId: c.scenarioId,
          difficulty: c.difficulty,
          description: c.description,
          bonusPoints: c.bonusPoints,
        })),
    }
  },
})

/**
 * Lightweight version for the signed-in home dashboard card.
 */
export const getDailyChallenge = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)

    const today = utcToday()
    const challenges = await ctx.db
      .query('dailyChallenges')
      .withIndex('by_date', (q) => q.eq('date', today))
      .collect()
    if (challenges.length === 0) return null

    let recommendedDifficulty: 'easy' | 'medium' | 'hard' = 'easy'
    let completed = false
    let completedScore: number | null = null

    if (userId) {
      const userProgress = await ctx.db
        .query('userProgress')
        .withIndex('by_user', (q) => q.eq('userId', userId))
        .first()
      recommendedDifficulty = determineUserDifficulty(
        userProgress?.level ?? 1,
        userProgress?.averageScores.overall ?? 0,
      )

      for (const challenge of challenges) {
        const completion = await ctx.db
          .query('challengeCompletions')
          .withIndex('by_user_and_challenge', (q) =>
            q.eq('userId', userId).eq('challengeId', challenge._id),
          )
          .first()
        if (completion?.completed) {
          completed = true
          completedScore = completion.score
          break
        }
      }
    }

    const challenge =
      challenges.find((c) => c.difficulty === recommendedDifficulty) ??
      challenges[0]

    return { ...challenge, completed, completedScore }
  },
})

/**
 * Get user's challenge stats for the daily challenge page.
 */
export const getUserChallengeStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return null

    const userProgress = await ctx.db
      .query('userProgress')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first()

    if (!userProgress) return null

    const completions = await ctx.db
      .query('challengeCompletions')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect()

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
// GENERATION (cron)
// ============================================================================

/**
 * Internal: Generate daily challenges (called by cron job).
 * Can also be run manually: npx convex run dailyChallenges:generateDailyChallenge
 */
export const generateDailyChallenge = internalAction({
  args: {},
  handler: async (ctx) => {
    const generatedScenarios = await ctx.runAction(
      internal.dailyChallengesGeneration.generateThreeScenarios,
    )

    await ctx.runMutation(internal.dailyChallenges.saveGeneratedChallenges, {
      generatedScenarios,
    })
  },
})

const CHALLENGE_DIFFICULTY: Record<string, 'easy' | 'medium' | 'hard'> = {
  beginner: 'easy',
  intermediate: 'medium',
  advanced: 'hard',
}

const ESTIMATED_DURATION: Record<'easy' | 'medium' | 'hard', number> = {
  easy: 8,
  medium: 12,
  hard: 18,
}

/**
 * Internal: persist the generated scenarios as real, playable scenario rows
 * and link one challenge per difficulty to them. The description users see is
 * the description of the scenario they will actually play.
 */
export const saveGeneratedChallenges = internalMutation({
  args: {
    generatedScenarios: v.array(
      v.object({
        title: v.string(),
        description: v.string(),
        category: v.union(
          v.literal('workplace'),
          v.literal('family'),
          v.literal('friendship'),
          v.literal('self_expression'),
        ),
        difficulty: v.union(
          v.literal('beginner'),
          v.literal('intermediate'),
          v.literal('advanced'),
        ),
        characterName: v.string(),
        characterPersonality: v.string(),
        characterInitialMood: v.number(),
        characterBackground: v.string(),
        characterHiddenNeeds: v.array(v.string()),
        situation: v.string(),
        aiOpeningMessage: v.string(),
        learningObjectives: v.array(v.string()),
        focusArea: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const today = utcToday()

    const existing = await ctx.db
      .query('dailyChallenges')
      .withIndex('by_date', (q) => q.eq('date', today))
      .first()

    if (existing) {
      console.log(`Daily challenges already exist for ${today}`)
      return
    }

    const now = Date.now()
    const allowedObjectives = ['observation', 'feeling', 'need', 'request']

    for (const generated of args.generatedScenarios) {
      const difficulty = CHALLENGE_DIFFICULTY[generated.difficulty] ?? 'medium'
      const objectives = generated.learningObjectives.filter((o) =>
        allowedObjectives.includes(o),
      )

      const scenarioId = await ctx.db.insert('scenarios', {
        title: generated.title,
        description: generated.description,
        category: generated.category,
        difficulty: generated.difficulty,
        characterName: generated.characterName,
        characterPersonality: generated.characterPersonality,
        characterInitialMood: Math.max(
          -10,
          Math.min(10, Math.round(generated.characterInitialMood)),
        ),
        characterBackground: generated.characterBackground,
        characterHiddenNeeds: generated.characterHiddenNeeds,
        situation: generated.situation,
        aiOpeningMessage: generated.aiOpeningMessage,
        learningObjectives:
          objectives.length > 0 ? objectives : allowedObjectives,
        focusArea: generated.focusArea,
        orderIndex: -1, // out of the linear practice ladder
        unlockRequirements: {
          minLevel: 1,
          requiredScenarios: [],
        },
        estimatedDuration: ESTIMATED_DURATION[difficulty],
        tags: ['daily-challenge', generated.category],
        isActive: true,
        source: 'daily',
        createdAt: now,
        updatedAt: now,
      })

      await ctx.db.insert('dailyChallenges', {
        date: today,
        scenarioId,
        difficulty,
        description: generated.description,
        bonusPoints: calculateBonusPoints(difficulty),
        createdAt: now,
      })

      console.log(
        `Created ${difficulty} daily challenge for ${today}: ${generated.title}`,
      )
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
    return averageScore >= 80 ? 'hard' : 'medium'
  }
  return averageScore >= 75 ? 'hard' : 'medium'
}

/**
 * Bonus points by difficulty. This exact amount is what
 * conversations.complete awards when the challenge is completed.
 */
function calculateBonusPoints(difficulty: 'easy' | 'medium' | 'hard'): number {
  const basePoints = {
    easy: 50,
    medium: 75,
    hard: 100,
  }
  return basePoints[difficulty]
}

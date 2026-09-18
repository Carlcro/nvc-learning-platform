import {
  advanceStreak,
  levelForPoints,
  newlyEarnedAchievements,
  pointsToNextLevel,
} from './progress'
import type { Doc, Id } from '../_generated/dataModel'
import type { MutationCtx } from '../_generated/server'
import type { AchievementDefinition } from './progress'

/**
 * The one place that writes points, level and the practice streak.
 *
 * Roleplay had this logic inline while the feelings section kept its own
 * separate progress record, so time spent building emotional vocabulary earned
 * nothing and never reached the profile. Anything a learner does that counts as
 * showing up for the day goes through here.
 */

export async function getOrCreateUserProgress(
  ctx: MutationCtx,
  userId: Id<'users'>,
): Promise<Doc<'userProgress'>> {
  const existing = await ctx.db
    .query('userProgress')
    .withIndex('by_user', (q) => q.eq('userId', userId))
    .first()
  if (existing) return existing

  const now = Date.now()
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
    // Empty until the first activity, so the first day starts the streak at 1.
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
    createdAt: now,
    updatedAt: now,
  })

  const created = await ctx.db.get(progressId)
  if (!created) throw new Error('Failed to create user progress')
  return created
}

/**
 * Credit activity that counts as practising today: add points, advance the
 * streak, and award any achievement that has now come true.
 *
 * Deliberately does not touch the scenario counters or score averages, which
 * only a scored conversation should move.
 */
export async function creditDailyPractice(
  ctx: MutationCtx,
  args: { userId: Id<'users'>; points: number; today: string },
): Promise<{
  totalPoints: number
  level: number
  currentStreak: number
  newAchievements: Array<AchievementDefinition>
}> {
  const progress = await getOrCreateUserProgress(ctx, args.userId)

  const totalPoints = progress.totalPoints + Math.max(0, args.points)
  const streak = advanceStreak(
    {
      currentStreak: progress.currentStreak,
      longestStreak: progress.longestStreak,
      lastPracticeDate: progress.lastPracticeDate,
    },
    args.today,
  )

  // Existing counts carry through unchanged; a finalScore of 0 and no empathy
  // keep the conversation-only achievements from firing off a check-in.
  const newAchievements = newlyEarnedAchievements(
    {
      scenariosCompleted: progress.scenariosCompleted,
      scenariosPassed: progress.scenariosPassed,
      scenariosMastered: progress.scenariosMastered,
      totalStars: progress.totalStars,
      currentStreak: streak.currentStreak,
      finalScore: 0,
      empathyShown: false,
    },
    progress.achievements,
  )

  await ctx.db.patch(progress._id, {
    totalPoints,
    level: levelForPoints(totalPoints),
    pointsToNextLevel: pointsToNextLevel(totalPoints),
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
    lastPracticeDate: streak.lastPracticeDate,
    achievements: [
      ...progress.achievements,
      ...newAchievements.map((a) => a.id),
    ],
    updatedAt: Date.now(),
  })

  return {
    totalPoints,
    level: levelForPoints(totalPoints),
    currentStreak: streak.currentStreak,
    newAchievements,
  }
}

import { v } from 'convex/values'
import { getAuthUserId } from '@convex-dev/auth/server'
import { userError } from './lib/errors'
import { mutation, query } from './_generated/server'
import { resolveLocalDate } from './lib/progress'
import { creditDailyPractice } from './lib/userProgressWrite'
import { getOrCreateFeelingsProgress } from './feelings'

/**
 * Feelings Quiz Functions
 * Quiz game for learning to identify real feelings vs pseudo-feelings.
 *
 * Questions are served WITHOUT their answers; the client submits an answer
 * and the server grades it, returns the explanation, and updates progress in
 * one transaction.
 */

/** Points for getting a question right the first time. */
const CORRECT_ANSWER_POINTS = 5
/** Levelling up looks at the last N answers, not the lifetime average. */
const LEVEL_UP_WINDOW = 10
const LEVEL_UP_CORRECT = 8
const MAX_QUIZ_LEVEL = 3

/** Deterministic PRNG so the batch is stable per session seed. */
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Get a batch of quiz questions for a session, without answers.
 * The client passes a random `seed` per session so retries reshuffle while a
 * re-subscription of the same session keeps the same batch.
 */
export const getQuizBatch = query({
  args: { level: v.number(), count: v.number(), seed: v.number() },
  handler: async (ctx, args) => {
    const questions = await ctx.db
      .query('feelingsQuizQuestions')
      .withIndex('by_level', (q) => q.eq('level', args.level))
      .collect()

    if (questions.length === 0) {
      return []
    }

    const random = mulberry32(Math.floor(args.seed))
    const shuffled = [...questions]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    return shuffled
      .slice(0, Math.min(Math.max(1, args.count), shuffled.length))
      .map((q) => ({
        _id: q._id,
        sentence: q.sentence,
        level: q.level,
        category: q.category,
      }))
  },
})

/**
 * Grade an answer, update the current user's quiz progress, and return the
 * explanation to show.
 */
export const submitAnswer = mutation({
  args: {
    questionId: v.id('feelingsQuizQuestions'),
    answeredRealFeeling: v.boolean(),
    // The user's local calendar date, so an evening answer counts for their
    // own day. Validated server-side.
    localDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) userError('Not authenticated')

    const question = await ctx.db.get(args.questionId)
    if (!question) userError('Question not found')

    const correct = args.answeredRealFeeling === question.isRealFeeling

    const progress = await getOrCreateFeelingsProgress(ctx, userId)

    const newTotal = progress.quizQuestionsAnswered + 1
    const newCorrect = progress.quizQuestionsCorrect + (correct ? 1 : 0)
    const newScore = Math.round((newCorrect / newTotal) * 100)

    // Level up on the recent window. The old rule compared the lifetime score
    // against 80% on exact multiples of ten, so a rough start could never be
    // recovered from however well someone did afterwards.
    const recentResults = [
      ...(progress.quizRecentResults ?? []),
      correct,
    ].slice(-LEVEL_UP_WINDOW)
    const recentCorrect = recentResults.filter(Boolean).length

    let newLevel = progress.quizLevel
    if (
      recentResults.length === LEVEL_UP_WINDOW &&
      recentCorrect >= LEVEL_UP_CORRECT &&
      newLevel < MAX_QUIZ_LEVEL
    ) {
      newLevel = newLevel + 1
    }

    // Points land once per question. Answering the same one again is useful
    // practice, so it stays allowed; it just does not pay out twice.
    const scoredIds = progress.quizScoredQuestionIds ?? []
    const alreadyScored = scoredIds.includes(args.questionId)
    const pointsEarned = correct && !alreadyScored ? CORRECT_ANSWER_POINTS : 0

    await ctx.db.patch(progress._id, {
      quizQuestionsAnswered: newTotal,
      quizQuestionsCorrect: newCorrect,
      quizScore: newScore,
      quizLevel: newLevel,
      quizRecentResults: recentResults,
      quizScoredQuestionIds:
        pointsEarned > 0 ? [...scoredIds, args.questionId] : scoredIds,
      updatedAt: Date.now(),
    })

    // Building emotional vocabulary counts toward the same progression as a
    // conversation, instead of living in a separate record nothing reads.
    let newAchievements: Array<{
      id: string
      title: string
      description: string
    }> = []
    if (pointsEarned > 0) {
      const credited = await creditDailyPractice(ctx, {
        userId,
        points: pointsEarned,
        today: resolveLocalDate(args.localDate),
      })
      newAchievements = credited.newAchievements.map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
      }))
    }

    return {
      correct,
      isRealFeeling: question.isRealFeeling,
      explanation: question.explanation,
      correctFeelings: question.correctFeelings ?? [],
      quizScore: newScore,
      quizLevel: newLevel,
      leveledUp: newLevel > progress.quizLevel,
      pointsEarned,
      newAchievements,
    }
  },
})

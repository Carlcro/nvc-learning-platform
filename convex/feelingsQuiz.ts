import { v } from 'convex/values'
import { getAuthUserId } from '@convex-dev/auth/server'
import { mutation, query } from './_generated/server'
import { getOrCreateFeelingsProgress } from './feelings'

/**
 * Feelings Quiz Functions
 * Quiz game for learning to identify real feelings vs pseudo-feelings.
 *
 * Questions are served WITHOUT their answers; the client submits an answer
 * and the server grades it, returns the explanation, and updates progress in
 * one transaction.
 */

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
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) throw new Error('Not authenticated')

    const question = await ctx.db.get(args.questionId)
    if (!question) throw new Error('Question not found')

    const correct = args.answeredRealFeeling === question.isRealFeeling

    const progress = await getOrCreateFeelingsProgress(ctx, userId)

    const newTotal = progress.quizQuestionsAnswered + 1
    const newCorrect = progress.quizQuestionsCorrect + (correct ? 1 : 0)
    const newScore = Math.round((newCorrect / newTotal) * 100)

    // Auto-level up if 80%+ correct in 10 questions
    let newLevel = progress.quizLevel
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
      correct,
      isRealFeeling: question.isRealFeeling,
      explanation: question.explanation,
      correctFeelings: question.correctFeelings ?? [],
      quizScore: newScore,
      quizLevel: newLevel,
      leveledUp: newLevel > progress.quizLevel,
    }
  },
})

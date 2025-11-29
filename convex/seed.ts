import { internalMutation, mutation } from './_generated/server'
import { seedFeelings, seedFeelingsQuizQuestions } from './feelings/seed'

/**
 * Seed Data Initialization
 * Use these mutations to populate the database with initial content
 */

/**
 * Seed all feelings and quiz questions
 * Safe to call multiple times - won't duplicate existing data
 */
export const seedAllFeelings = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existingFeelings = await ctx.db.query('feelings').first()
    const existingQuestions = await ctx.db
      .query('feelingsQuizQuestions')
      .first()

    if (existingFeelings && existingQuestions) {
      console.log('Feelings already seeded, skipping')
      return { message: 'Feelings already seeded' }
    }

    await seedFeelings(ctx)
    await seedFeelingsQuizQuestions(ctx)

    return { message: 'Feelings seeded successfully' }
  },
})

/**
 * Seed only feelings (if needed separately)
 */
export const seedFeelingsOnly = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query('feelings').first()

    if (existing) {
      console.log('Feelings already seeded, skipping')
      return { message: 'Feelings already seeded' }
    }

    await seedFeelings(ctx)

    return { message: 'Feelings seeded successfully' }
  },
})

/**
 * Seed only quiz questions (if needed separately)
 */
export const seedQuizQuestionsOnly = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query('feelingsQuizQuestions').first()

    if (existing) {
      console.log('Quiz questions already seeded, skipping')
      return { message: 'Quiz questions already seeded' }
    }

    await seedFeelingsQuizQuestions(ctx)

    return { message: 'Quiz questions seeded successfully' }
  },
})

/**
 * Clear all feelings data (for development/testing)
 * WARNING: This is destructive!
 */
export const clearAllFeelings = internalMutation({
  args: {},
  handler: async (ctx) => {
    const feelings = await ctx.db.query('feelings').collect()
    for (const feeling of feelings) {
      await ctx.db.delete(feeling._id)
    }

    console.log(`Deleted ${feelings.length} feelings`)
    return { deleted: feelings.length }
  },
})

/**
 * Clear all quiz questions (for development/testing)
 * WARNING: This is destructive!
 */
export const clearAllQuizQuestions = internalMutation({
  args: {},
  handler: async (ctx) => {
    const questions = await ctx.db.query('feelingsQuizQuestions').collect()
    for (const question of questions) {
      await ctx.db.delete(question._id)
    }

    console.log(`Deleted ${questions.length} quiz questions`)
    return { deleted: questions.length }
  },
})

/**
 * Get seed statistics
 */
export const getSeedStats = mutation({
  args: {},
  handler: async (ctx) => {
    const feelings = await ctx.db.query('feelings').collect()
    const quizQuestions = await ctx.db.query('feelingsQuizQuestions').collect()

    const feelingsByFamily: Record<string, number> = {}
    for (const feeling of feelings) {
      feelingsByFamily[feeling.family] =
        (feelingsByFamily[feeling.family] || 0) + 1
    }

    const questionsByLevel: Record<number, number> = {}
    for (const q of quizQuestions) {
      questionsByLevel[q.level] = (questionsByLevel[q.level] || 0) + 1
    }

    return {
      totalFeelings: feelings.length,
      feelingsByFamily,
      totalQuizQuestions: quizQuestions.length,
      questionsByLevel,
    }
  },
})

import { v } from 'convex/values'
import { query } from './_generated/server'

/**
 * Feelings Quiz Functions
 * Quiz game for learning to identify real feelings vs pseudo-feelings
 */

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Get quiz questions for a specific level
 */
export const getQuestionsByLevel = query({
  args: { level: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('feelingsQuizQuestions')
      .withIndex('by_level', (q) => q.eq('level', args.level))
      .collect()
  },
})

/**
 * Get a random quiz question for the specified level
 */
export const getRandomQuestion = query({
  args: { level: v.number() },
  handler: async (ctx, args) => {
    const questions = await ctx.db
      .query('feelingsQuizQuestions')
      .withIndex('by_level', (q) => q.eq('level', args.level))
      .collect()

    if (questions.length === 0) {
      return null
    }

    const random = Math.floor(Math.random() * questions.length)
    return questions[random]
  },
})

/**
 * Get questions by category
 */
export const getQuestionsByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('feelingsQuizQuestions')
      .withIndex('by_category', (q) => q.eq('category', args.category))
      .collect()
  },
})

/**
 * Get all quiz questions
 */
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('feelingsQuizQuestions').collect()
  },
})

/**
 * Get a batch of random questions for a quiz session
 */
export const getRandomQuizBatch = query({
  args: { level: v.number(), count: v.number() },
  handler: async (ctx, args) => {
    const questions = await ctx.db
      .query('feelingsQuizQuestions')
      .withIndex('by_level', (q) => q.eq('level', args.level))
      .collect()

    if (questions.length === 0) {
      return []
    }

    // Shuffle and return requested count
    const shuffled = [...questions].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, Math.min(args.count, shuffled.length))
  },
})

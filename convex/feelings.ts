import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

/**
 * Feelings Learning System Functions
 * Queries and mutations for feelings management
 */

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Get all feelings organized by family
 */
export const listByFamily = query({
  args: { family: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('feelings')
      .withIndex('by_family', (q) => q.eq('family', args.family))
      .collect()
  },
})

/**
 * Get all feeling families (for browsing)
 */
export const getFamilies = query({
  args: {},
  handler: async (ctx) => {
    const feelings = await ctx.db.query('feelings').collect()
    const families = Array.from(new Set(feelings.map((f) => f.family))).sort()
    return families
  },
})

/**
 * Get a specific feeling by word
 */
export const getByWord = query({
  args: { word: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('feelings')
      .filter((q) => q.eq(q.field('word'), args.word))
      .first()
  },
})

/**
 * Search feelings by partial word match
 */
export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const searchLower = args.query.toLowerCase()
    const feelings = await ctx.db.query('feelings').collect()
    return feelings.filter(
      (f) =>
        f.word.toLowerCase().includes(searchLower) ||
        f.synonyms.some((s) => s.toLowerCase().includes(searchLower)),
    )
  },
})

/**
 * Get all feelings in a category (pleasant or unpleasant)
 */
export const getByCategory = query({
  args: { category: v.union(v.literal('pleasant'), v.literal('unpleasant')) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('feelings')
      .withIndex('by_category', (q) => q.eq('category', args.category))
      .collect()
  },
})

/**
 * Get feelings by family and intensity
 */
export const getByIntensity = query({
  args: { family: v.string(), intensity: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('feelings')
      .withIndex('by_intensity', (q) =>
        q.eq('family', args.family).eq('intensity', args.intensity),
      )
      .collect()
  },
})

/**
 * Get all feelings (for reference)
 */
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('feelings').collect()
  },
})

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Mark a feeling as explored by the user
 */
export const markFeelingExplored = mutation({
  args: { userId: v.id('users'), feelingWord: v.string() },
  handler: async (ctx, args) => {
    // Get or create user feelings progress
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

    // Add to explored if not already there
    if (progress) {
      const explored = new Set(progress.feelingsExplored)
      if (!explored.has(args.feelingWord)) {
        explored.add(args.feelingWord)
        await ctx.db.patch(progress._id, {
          feelingsExplored: Array.from(explored),
          updatedAt: Date.now(),
        })
      }
      return progress._id
    }
  },
})

/**
 * Save a feeling to user's personal library
 */
export const saveFeelingToLibrary = mutation({
  args: { userId: v.id('users'), feelingWord: v.string() },
  handler: async (ctx, args) => {
    // Get or create user feelings progress
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

    // Add to saved library
    if (progress) {
      const saved = new Set(progress.feelingsSaved)
      if (!saved.has(args.feelingWord)) {
        saved.add(args.feelingWord)
        await ctx.db.patch(progress._id, {
          feelingsSaved: Array.from(saved),
          updatedAt: Date.now(),
        })
      }
      return progress._id
    }
  },
})

/**
 * Remove a feeling from user's personal library
 */
export const removeFeelingFromLibrary = mutation({
  args: { userId: v.id('users'), feelingWord: v.string() },
  handler: async (ctx, args) => {
    const progress = await ctx.db
      .query('userFeelingsProgress')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .first()

    if (!progress) {
      throw new Error('User progress not found')
    }

    const saved = new Set(progress.feelingsSaved)
    saved.delete(args.feelingWord)

    await ctx.db.patch(progress._id, {
      feelingsSaved: Array.from(saved),
      updatedAt: Date.now(),
    })

    return progress._id
  },
})

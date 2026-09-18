import { v } from 'convex/values'
import { getAuthUserId } from '@convex-dev/auth/server'
import { userError } from './lib/errors'
import { mutation, query } from './_generated/server'
import type { MutationCtx } from './_generated/server'
import type { Doc, Id } from './_generated/dataModel'

/**
 * Feelings Learning System Functions
 * Queries and mutations for feelings management.
 *
 * All personal progress writes derive the user from the auth context.
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
    return Array.from(new Set(feelings.map((f) => f.family))).sort()
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
      .withIndex('by_word', (q) => q.eq('word', args.word))
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

/** Get or create the signed-in user's feelings progress record. */
export async function getOrCreateFeelingsProgress(
  ctx: MutationCtx,
  userId: Id<'users'>,
): Promise<Doc<'userFeelingsProgress'>> {
  const existing = await ctx.db
    .query('userFeelingsProgress')
    .withIndex('by_user', (q) => q.eq('userId', userId))
    .first()
  if (existing) return existing

  const progressId = await ctx.db.insert('userFeelingsProgress', {
    userId,
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
  const created = await ctx.db.get(progressId)
  if (!created) throw new Error('Failed to create feelings progress')
  return created
}

/**
 * Mark a feeling as explored by the current user
 */
export const markFeelingExplored = mutation({
  args: { feelingWord: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) userError('Not authenticated')

    const progress = await getOrCreateFeelingsProgress(ctx, userId)

    const explored = new Set(progress.feelingsExplored)
    if (!explored.has(args.feelingWord)) {
      explored.add(args.feelingWord)
      await ctx.db.patch(progress._id, {
        feelingsExplored: Array.from(explored),
        updatedAt: Date.now(),
      })
    }
    return progress._id
  },
})

/**
 * Save a feeling to the current user's personal library
 */
export const saveFeelingToLibrary = mutation({
  args: { feelingWord: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) userError('Not authenticated')

    const progress = await getOrCreateFeelingsProgress(ctx, userId)

    const saved = new Set(progress.feelingsSaved)
    if (!saved.has(args.feelingWord)) {
      saved.add(args.feelingWord)
      await ctx.db.patch(progress._id, {
        feelingsSaved: Array.from(saved),
        updatedAt: Date.now(),
      })
    }
    return progress._id
  },
})

/**
 * Remove a feeling from the current user's personal library
 */
export const removeFeelingFromLibrary = mutation({
  args: { feelingWord: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) userError('Not authenticated')

    const progress = await ctx.db
      .query('userFeelingsProgress')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first()

    if (!progress) {
      return null
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

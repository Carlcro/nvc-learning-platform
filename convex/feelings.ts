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
 * Confirm a word is one of the feelings we actually know about.
 *
 * These words are stored on the user's record and rendered back, so without
 * this the mutations would accept arbitrary unbounded strings.
 */
async function requireKnownFeeling(
  ctx: MutationCtx,
  word: string,
): Promise<string> {
  const feeling = await ctx.db
    .query('feelings')
    .withIndex('by_word', (q) => q.eq('word', word))
    .first()
  if (!feeling) {
    userError('That is not a feeling we recognise.')
  }
  return feeling.word
}

/**
 * Mark a feeling as explored by the current user
 */
export const markFeelingExplored = mutation({
  args: { feelingWord: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) userError('Not authenticated')

    const word = await requireKnownFeeling(ctx, args.feelingWord)
    const progress = await getOrCreateFeelingsProgress(ctx, userId)

    const explored = new Set(progress.feelingsExplored)
    if (!explored.has(word)) {
      explored.add(word)
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

    const word = await requireKnownFeeling(ctx, args.feelingWord)
    const progress = await getOrCreateFeelingsProgress(ctx, userId)

    const saved = new Set(progress.feelingsSaved)
    if (!saved.has(word)) {
      saved.add(word)
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

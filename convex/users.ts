import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'
import { userError } from './lib/errors'
import { internalMutation, mutation, query } from './_generated/server'

/**
 * Get the current authenticated user
 * Returns null if user is not authenticated
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      return null
    }

    return await ctx.db.get(userId)
  },
})

/**
 * Get the current user's account plus their progress stats.
 *
 * Stats come from the userProgress table, the single source of truth that
 * conversations.complete writes to, so the nav and menus always show live
 * level, points, and streak.
 */
export const getUserProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      return null
    }

    const user = await ctx.db.get(userId)
    if (!user) return null

    const progress = await ctx.db
      .query('userProgress')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first()

    return {
      user,
      profile: {
        level: progress?.level ?? 1,
        totalPoints: progress?.totalPoints ?? 0,
        currentStreak: progress?.currentStreak ?? 0,
        longestStreak: progress?.longestStreak ?? 0,
      },
    }
  },
})

/**
 * Update user profile (name, email, etc.)
 * Only accessible to the authenticated user themselves
 */
export const updateUserProfile = mutation({
  args: {
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      userError('Not authenticated')
    }

    const user = await ctx.db.get(userId)
    if (!user) {
      userError('User not found')
    }

    if (args.name !== undefined) {
      await ctx.db.patch(userId, {
        name: args.name,
      })
    }

    return await ctx.db.get(userId)
  },
})

/**
 * Ensure the signed-in user has a progress record.
 * Called once after successful authentication.
 */
export const initializeUserProfile = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      userError('Not authenticated')
    }

    const existing = await ctx.db
      .query('userProgress')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first()

    if (existing) {
      return existing
    }

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
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    return await ctx.db.get(progressId)
  },
})

/**
 * One-off cleanup for the deprecated userProfiles table (stats moved to
 * userProgress). Run via `npx convex run users:clearDeprecatedProfiles`,
 * then the table can be dropped from the schema.
 */
export const clearDeprecatedProfiles = internalMutation({
  args: {},
  handler: async (ctx) => {
    const profiles = await ctx.db.query('userProfiles').collect()
    for (const profile of profiles) {
      await ctx.db.delete(profile._id)
    }
    return { deleted: profiles.length }
  },
})

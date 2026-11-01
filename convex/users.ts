import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'
import { userError } from './lib/errors'
import { localeValidator } from './lib/locale'
import { internalQuery, mutation, query } from './_generated/server'

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
 * Ensure the signed-in user has a progress record.
 * Called once after successful authentication.
 */
export const initializeUserProfile = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      userError('notAuthenticated')
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
 * Save the signed-in person's language, so it follows them to other devices
 * and so conversations they start are held in it.
 */
export const setLocale = mutation({
  args: { locale: localeValidator },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      userError('notAuthenticated')
    }
    await ctx.db.patch(userId, { preferredLocale: args.locale })
    return null
  },
})

/**
 * The welcome tour is for accounts made from this moment on. Older accounts
 * already know their way around, so they are never sent through it.
 */
export const ONBOARDING_LAUNCHED_AT = Date.UTC(2026, 10, 1)

/**
 * Whether the signed-in person should see the welcome tour: a new account
 * that has not finished or skipped it yet. Null when signed out.
 */
export const needsOnboarding = query({
  args: {},
  returns: v.union(v.boolean(), v.null()),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) return null
    const user = await ctx.db.get(userId)
    if (!user) return null
    return (
      user.onboardingCompletedAt === undefined &&
      user._creationTime >= ONBOARDING_LAUNCHED_AT
    )
  },
})

/**
 * Mark the welcome tour as done (finished or skipped). Idempotent: the first
 * time is the one that is kept.
 */
export const completeOnboarding = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      userError('notAuthenticated')
    }
    const user = await ctx.db.get(userId)
    if (user && user.onboardingCompletedAt === undefined) {
      await ctx.db.patch(userId, { onboardingCompletedAt: Date.now() })
    }
    return null
  },
})

/**
 * Internal: the language to write to an email address in, for messages sent
 * before anyone is signed in (the password reset code). One address can
 * belong to more than one account, so the first saved preference wins.
 */
export const localeForEmail = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const accounts = await ctx.db
      .query('users')
      .withIndex('email', (q) => q.eq('email', args.email))
      .take(5)
    return accounts.find((a) => a.preferredLocale)?.preferredLocale ?? null
  },
})

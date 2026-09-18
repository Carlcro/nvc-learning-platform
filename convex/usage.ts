import { v } from 'convex/values'
import { getAuthUserId } from '@convex-dev/auth/server'
import { internalMutation, query } from './_generated/server'
import { userError } from './lib/errors'
import { utcToday } from './lib/progress'
import {
  MAX_SCENARIO_GENERATIONS_PER_DAY,
  MAX_TURNS_PER_DAY,
} from './lib/limits'
import type { Doc, Id } from './_generated/dataModel'
import type { MutationCtx } from './_generated/server'

/**
 * Daily spend guards.
 *
 * Budget is reserved before the model is called, not after it succeeds: a turn
 * that fails still cost us the call, and erring toward the safe side on spend
 * matters more than refunding the occasional failure. Because these run as
 * mutations, concurrent turns serialize on the same row and cannot both slip
 * past a check.
 */

async function readToday(
  ctx: MutationCtx,
  userId: Id<'users'>,
): Promise<Doc<'dailyUsage'> | null> {
  const today = utcToday()
  return await ctx.db
    .query('dailyUsage')
    .withIndex('by_user_and_date', (q) =>
      q.eq('userId', userId).eq('date', today),
    )
    .first()
}

/** Reserve one practice turn, or refuse when today's budget is spent. */
export const consumeTurn = internalMutation({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const existing = await readToday(ctx, args.userId)

    if (!existing) {
      await ctx.db.insert('dailyUsage', {
        userId: args.userId,
        date: utcToday(),
        turns: 1,
        scenarioGenerations: 0,
      })
      return
    }

    if (existing.turns >= MAX_TURNS_PER_DAY) {
      userError(
        'You have reached the practice limit for today. Come back tomorrow, and in the meantime the lessons and the feelings library are always open.',
      )
    }

    await ctx.db.patch(existing._id, { turns: existing.turns + 1 })
  },
})

/** Reserve one custom scenario generation, or refuse when today's is spent. */
export const consumeScenarioGeneration = internalMutation({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const existing = await readToday(ctx, args.userId)

    if (!existing) {
      await ctx.db.insert('dailyUsage', {
        userId: args.userId,
        date: utcToday(),
        turns: 0,
        scenarioGenerations: 1,
      })
      return
    }

    if (existing.scenarioGenerations >= MAX_SCENARIO_GENERATIONS_PER_DAY) {
      userError(
        'You have shaped a lot of scenarios today. Try practicing one of them, and you can build more tomorrow.',
      )
    }

    await ctx.db.patch(existing._id, {
      scenarioGenerations: existing.scenarioGenerations + 1,
    })
  },
})

/** What the signed-in user has left today, so the UI can show it. */
export const getMyRemaining = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) return null

    const today = utcToday()
    const existing = await ctx.db
      .query('dailyUsage')
      .withIndex('by_user_and_date', (q) =>
        q.eq('userId', userId).eq('date', today),
      )
      .first()

    return {
      turnsRemaining: Math.max(0, MAX_TURNS_PER_DAY - (existing?.turns ?? 0)),
      scenarioGenerationsRemaining: Math.max(
        0,
        MAX_SCENARIO_GENERATIONS_PER_DAY - (existing?.scenarioGenerations ?? 0),
      ),
    }
  },
})

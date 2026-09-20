import { v } from 'convex/values'
import { getAuthUserId } from '@convex-dev/auth/server'
import { internalMutation, query } from './_generated/server'
import { internal } from './_generated/api'
import { userError } from './lib/errors'
import { costMicros, modelCallKindValidator } from './lib/modelUsage'
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

// ============================================================================
// COST TRACKING
// ============================================================================

/**
 * Record what one or more Claude calls used and cost.
 *
 * Writes the raw log plus three rollups (per user per day, per user lifetime,
 * and per day per kind) in one transaction, so the admin panel reads small
 * pre-summed rows instead of scanning every call ever made. The cost is
 * computed here from the token counts, never passed in.
 *
 * `userId` is absent for the nightly cron, which belongs to no one.
 */
export const recordModelCalls = internalMutation({
  args: {
    userId: v.optional(v.id('users')),
    conversationId: v.optional(v.id('conversations')),
    calls: v.array(
      v.object({
        kind: modelCallKindValidator,
        model: v.string(),
        inputTokens: v.number(),
        outputTokens: v.number(),
        cacheReadTokens: v.number(),
        cacheWriteTokens: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    if (args.calls.length === 0) return

    const date = utcToday()
    const now = Date.now()
    const priced = args.calls.map((call) => ({
      ...call,
      costMicros: costMicros(call.model, call),
    }))

    for (const call of priced) {
      await ctx.db.insert('modelCalls', {
        userId: args.userId,
        conversationId: args.conversationId,
        date,
        ...call,
      })

      const spend = await ctx.db
        .query('dailyModelSpend')
        .withIndex('by_date_and_kind', (q) =>
          q.eq('date', date).eq('kind', call.kind),
        )
        .first()
      if (spend) {
        await ctx.db.patch(spend._id, {
          calls: spend.calls + 1,
          inputTokens: spend.inputTokens + call.inputTokens,
          outputTokens: spend.outputTokens + call.outputTokens,
          costMicros: spend.costMicros + call.costMicros,
        })
      } else {
        await ctx.db.insert('dailyModelSpend', {
          date,
          kind: call.kind,
          calls: 1,
          inputTokens: call.inputTokens,
          outputTokens: call.outputTokens,
          costMicros: call.costMicros,
        })
      }
    }

    const userId = args.userId
    if (!userId) return

    const sum = {
      modelCalls: priced.length,
      inputTokens: priced.reduce((n, c) => n + c.inputTokens, 0),
      outputTokens: priced.reduce((n, c) => n + c.outputTokens, 0),
      costMicros: priced.reduce((n, c) => n + c.costMicros, 0),
    }
    // A turn is an analysis plus a reply; count it once, on the analysis.
    const turns = priced.filter((c) => c.kind === 'analysis').length

    const today = await readToday(ctx, userId)
    // The first measured call of the day is what makes it an active day.
    const isNewActiveDay = !today || (today.modelCalls ?? 0) === 0
    if (today) {
      await ctx.db.patch(today._id, {
        modelCalls: (today.modelCalls ?? 0) + sum.modelCalls,
        inputTokens: (today.inputTokens ?? 0) + sum.inputTokens,
        outputTokens: (today.outputTokens ?? 0) + sum.outputTokens,
        costMicros: (today.costMicros ?? 0) + sum.costMicros,
      })
    } else {
      // Calls that reserve no budget (the readiness questions) can be the
      // first thing someone does in a day.
      await ctx.db.insert('dailyUsage', {
        userId,
        date,
        turns: 0,
        scenarioGenerations: 0,
        ...sum,
      })
    }

    const totals = await ctx.db
      .query('userUsageTotals')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first()
    if (totals) {
      await ctx.db.patch(totals._id, {
        modelCalls: totals.modelCalls + sum.modelCalls,
        turns: totals.turns + turns,
        inputTokens: totals.inputTokens + sum.inputTokens,
        outputTokens: totals.outputTokens + sum.outputTokens,
        costMicros: totals.costMicros + sum.costMicros,
        activeDays: totals.activeDays + (isNewActiveDay ? 1 : 0),
        lastCallAt: now,
      })
    } else {
      await ctx.db.insert('userUsageTotals', {
        userId,
        ...sum,
        turns,
        activeDays: 1,
        firstCallAt: now,
        lastCallAt: now,
      })
    }
  },
})

// The rollups keep every total, so the raw log only needs to cover the window
// someone would actually dig into.
const MODEL_CALL_RETENTION_DAYS = 90
const PRUNE_BATCH = 500

/** Delete raw model call rows past the retention window (called by cron). */
export const pruneOldModelCalls = internalMutation({
  args: {},
  handler: async (ctx) => {
    const cutoff = Date.now() - MODEL_CALL_RETENTION_DAYS * 24 * 60 * 60 * 1000
    const old = await ctx.db
      .query('modelCalls')
      .withIndex('by_creation_time', (q) => q.lt('_creationTime', cutoff))
      .take(PRUNE_BATCH)

    for (const row of old) {
      await ctx.db.delete(row._id)
    }

    // A full batch means there is probably more; carry on in a new transaction
    // rather than risk one that is too large to commit.
    if (old.length === PRUNE_BATCH) {
      await ctx.scheduler.runAfter(0, internal.usage.pruneOldModelCalls, {})
    }
  },
})

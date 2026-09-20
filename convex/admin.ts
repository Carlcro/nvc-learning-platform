import { v } from 'convex/values'
import { getAuthUserId } from '@convex-dev/auth/server'
import { internalMutation, internalQuery, query } from './_generated/server'
import { userError } from './lib/errors'
import { ACHIEVEMENTS, utcToday } from './lib/progress'
import { MAX_TURNS_PER_DAY, MAX_USER_TURNS } from './lib/limits'
import { MODEL_CALL_KINDS } from './lib/modelUsage'
import {
  bucketCounts,
  mean,
  percent,
  percentile,
  recentDates,
  utcDateOf,
} from './lib/adminStats'
import { LESSONS } from './lessons'
import type { Doc, Id } from './_generated/dataModel'
import type { QueryCtx } from './_generated/server'

/**
 * The admin panel's backend: who is using the app, how, and what it costs.
 *
 * Two rules hold for everything in this file.
 *
 * Access: every query calls requireAdmin first. Admins are rows in the
 * `admins` table, keyed on user id and only ever written from the CLI
 * (grantAdmin below). Nothing here trusts an email address or anything the
 * client sends.
 *
 * Privacy: conversations stay owner-only, even from here. These queries return
 * counts, scores and dates, never what anyone wrote, never a check-in note,
 * and never the text of a custom scenario, which is built from a real
 * situation in someone's life.
 */

const DAY_MS = 24 * 60 * 60 * 1000

// A conversation row carries its whole message list, so reading them is the
// one expensive thing here. Bounded so a busy quarter cannot push the query
// past Convex's read limit; the panel says so when the cap is hit.
const MAX_CONVERSATIONS_SCANNED = 1500

// ============================================================================
// ACCESS
// ============================================================================

async function isAdmin(ctx: QueryCtx): Promise<boolean> {
  const userId = await getAuthUserId(ctx)
  if (userId === null) return false
  const row = await ctx.db
    .query('admins')
    .withIndex('by_user', (q) => q.eq('userId', userId))
    .first()
  return row !== null
}

/** Refuse anyone who is not an admin, without saying the page exists. */
async function requireAdmin(ctx: QueryCtx): Promise<void> {
  if (!(await isAdmin(ctx))) {
    userError('Not found')
  }
}

/** Whether the signed-in user may open the admin panel. */
export const amIAdmin = query({
  args: {},
  handler: async (ctx) => {
    return await isAdmin(ctx)
  },
})

/**
 * Make someone an admin. CLI only:
 *
 *   npx convex run admin:grantAdmin '{"email": "you@example.com"}'
 *
 * An email can belong to more than one account (a password sign-up does not
 * verify the address), so when it is ambiguous this refuses and lists the
 * candidates; rerun with the userId of the account that is really yours.
 */
export const grantAdmin = internalMutation({
  args: {
    email: v.optional(v.string()),
    userId: v.optional(v.id('users')),
  },
  handler: async (ctx, args) => {
    let userId = args.userId

    if (!userId) {
      if (!args.email) {
        throw new Error('Pass an email or a userId')
      }
      const matches = await ctx.db
        .query('users')
        .withIndex('email', (q) => q.eq('email', args.email))
        .collect()

      if (matches.length === 0) {
        throw new Error(`No user has the email ${args.email}`)
      }
      if (matches.length > 1) {
        const candidates = await Promise.all(
          matches.map(async (user) => {
            const accounts = await ctx.db
              .query('authAccounts')
              .withIndex('userIdAndProvider', (q) => q.eq('userId', user._id))
              .collect()
            return `${user._id} (signs in with ${accounts.map((a) => a.provider).join(', ') || 'unknown'}, joined ${utcDateOf(user._creationTime)})`
          }),
        )
        throw new Error(
          `More than one account uses ${args.email}. Rerun with the userId of yours: ${candidates.join('; ')}`,
        )
      }
      userId = matches[0]._id
    }

    const user = await ctx.db.get(userId)
    if (!user) throw new Error('User not found')

    const confirmedId = user._id
    const existing = await ctx.db
      .query('admins')
      .withIndex('by_user', (q) => q.eq('userId', confirmedId))
      .first()
    if (!existing) {
      await ctx.db.insert('admins', {
        userId: confirmedId,
        grantedAt: Date.now(),
      })
    }
    return { userId: confirmedId, email: user.email ?? null }
  },
})

/** Take admin access away. CLI only. */
export const revokeAdmin = internalMutation({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query('admins')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect()
    for (const row of rows) {
      await ctx.db.delete(row._id)
    }
    return { removed: rows.length }
  },
})

/** Who is an admin right now. CLI only. */
export const listAdmins = internalQuery({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query('admins').collect()
    return await Promise.all(
      rows.map(async (row) => {
        const user = await ctx.db.get(row.userId)
        return {
          userId: row.userId,
          email: user?.email ?? null,
          grantedAt: utcDateOf(row.grantedAt),
        }
      }),
    )
  },
})

// ============================================================================
// OVERVIEW: growth, activity and cost over a date range
// ============================================================================

const rangeDays = v.union(v.literal(7), v.literal(30), v.literal(90))

export const overview = query({
  args: { days: rangeDays },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)

    const today = utcToday()
    // Monthly actives need 30 days even when the chart only shows 7.
    const loadedDates = recentDates(Math.max(args.days, 30), today)
    const dates = recentDates(args.days, today)
    const from = dates[0]
    const inRange = (date: string) => date >= from

    const [users, usageRows, spendRows, firstSpend] = await Promise.all([
      ctx.db.query('users').collect(),
      ctx.db
        .query('dailyUsage')
        .withIndex('by_date', (q) => q.gte('date', loadedDates[0]))
        .collect(),
      ctx.db
        .query('dailyModelSpend')
        .withIndex('by_date_and_kind', (q) => q.gte('date', from))
        .collect(),
      ctx.db.query('dailyModelSpend').withIndex('by_date_and_kind').first(),
    ])

    // ---- Per-day series ----
    const series = new Map(
      dates.map((date) => [
        date,
        {
          date,
          signups: 0,
          activeUsers: 0,
          turns: 0,
          scenarioGenerations: 0,
          costMicros: 0,
        },
      ]),
    )
    for (const user of users) {
      const day = series.get(utcDateOf(user._creationTime))
      if (day) day.signups += 1
    }
    for (const row of usageRows) {
      const day = series.get(row.date)
      if (!day) continue
      day.activeUsers += 1
      day.turns += row.turns
      day.scenarioGenerations += row.scenarioGenerations
    }
    // Cost comes from the per-kind rollup so the nightly cron is included.
    for (const row of spendRows) {
      const day = series.get(row.date)
      if (day) day.costMicros += row.costMicros
    }

    // ---- Active users ----
    const activeSince = (days: number) => {
      const since = recentDates(days, today)[0]
      return new Set(
        usageRows.filter((r) => r.date >= since).map((r) => r.userId),
      ).size
    }

    // ---- Cost ----
    const costByKind = MODEL_CALL_KINDS.map((kind) => {
      const rows = spendRows.filter((r) => r.kind === kind)
      return {
        kind,
        calls: rows.reduce((n, r) => n + r.calls, 0),
        inputTokens: rows.reduce((n, r) => n + r.inputTokens, 0),
        outputTokens: rows.reduce((n, r) => n + r.outputTokens, 0),
        costMicros: rows.reduce((n, r) => n + r.costMicros, 0),
      }
    })
    const totalCostMicros = costByKind.reduce((n, k) => n + k.costMicros, 0)
    const costOf = (kind: string) =>
      costByKind.find((k) => k.kind === kind)?.costMicros ?? 0
    const measuredTurns =
      costByKind.find((k) => k.kind === 'analysis')?.calls ?? 0

    const rangeUsage = usageRows.filter((r) => inRange(r.date))
    const activeInRange = new Set(rangeUsage.map((r) => r.userId)).size

    // The last week is the best guide to next month; a quiet launch month
    // would otherwise drag the projection down.
    const lastWeek = dates.slice(-7)
    const lastWeekCost = lastWeek.reduce(
      (n, date) => n + (series.get(date)?.costMicros ?? 0),
      0,
    )

    // ---- How hard people lean on the daily allowance ----
    const turnsPerUserDay = rangeUsage
      .filter((r) => r.turns > 0)
      .map((r) => r.turns)

    // ---- Who costs the most in this range ----
    const costPerUser = new Map<
      Id<'users'>,
      { costMicros: number; turns: number }
    >()
    for (const row of rangeUsage) {
      const entry = costPerUser.get(row.userId) ?? { costMicros: 0, turns: 0 }
      entry.costMicros += row.costMicros ?? 0
      entry.turns += row.turns
      costPerUser.set(row.userId, entry)
    }
    const usersById = new Map(users.map((u) => [u._id, u]))
    const topSpenders = [...costPerUser.entries()]
      .sort(
        (a, b) => b[1].costMicros - a[1].costMicros || b[1].turns - a[1].turns,
      )
      .slice(0, 10)
      .map(([userId, entry]) => ({
        userId,
        name: usersById.get(userId)?.name ?? null,
        email: usersById.get(userId)?.email ?? null,
        ...entry,
      }))

    return {
      range: { days: args.days, from, to: today },
      // Nothing was measured before this date, so earlier cost reads as zero.
      costTrackingSince: firstSpend?.date ?? null,
      users: {
        total: users.length,
        newInRange: users.filter((u) => inRange(utcDateOf(u._creationTime)))
          .length,
      },
      active: {
        today: activeSince(1),
        last7: activeSince(7),
        last30: activeSince(30),
        inRange: activeInRange,
      },
      cost: {
        totalMicros: totalCostMicros,
        todayMicros: series.get(today)?.costMicros ?? 0,
        cronMicros: costOf('daily_challenges'),
        perActiveUserMicros:
          activeInRange > 0
            ? (totalCostMicros - costOf('daily_challenges')) / activeInRange
            : 0,
        perTurnMicros:
          measuredTurns > 0
            ? (costOf('analysis') + costOf('character_reply')) / measuredTurns
            : 0,
        projectedMonthMicros: (lastWeekCost / lastWeek.length) * 30,
      },
      series: [...series.values()],
      costByKind,
      allowance: {
        maxTurnsPerDay: MAX_TURNS_PER_DAY,
        userDays: turnsPerUserDay.length,
        median: percentile(turnsPerUserDay, 50),
        p90: percentile(turnsPerUserDay, 90),
        max: percentile(turnsPerUserDay, 100),
        capHits: turnsPerUserDay.filter((t) => t >= MAX_TURNS_PER_DAY).length,
        buckets: bucketCounts(turnsPerUserDay, [
          { label: '1 to 5', min: 1, max: 5 },
          { label: '6 to 15', min: 6, max: 15 },
          { label: '16 to 30', min: 16, max: 30 },
          { label: '31 to 60', min: 31, max: 60 },
          { label: '61 and up', min: 61, max: Number.MAX_SAFE_INTEGER },
        ]),
      },
      topSpenders,
    }
  },
})

// ============================================================================
// PRACTICE: how conversations go, and which scenarios people choose
// ============================================================================

type ScenarioGroup = 'builtin' | 'user_created' | 'daily' | 'removed'

function scenarioGroup(scenario: Doc<'scenarios'> | null): ScenarioGroup {
  if (!scenario) return 'removed'
  if (scenario.source) return scenario.source
  return scenario.ownerId ? 'user_created' : 'builtin'
}

const COMPONENTS = ['observation', 'feeling', 'need', 'request'] as const

export const practice = query({
  args: { days: rangeDays },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)

    const since = Date.now() - args.days * DAY_MS
    const conversations = await ctx.db
      .query('conversations')
      .withIndex('by_creation_time', (q) => q.gte('_creationTime', since))
      .order('desc')
      .take(MAX_CONVERSATIONS_SCANNED)

    // ---- Outcomes ----
    const started = conversations.filter((c) =>
      c.messages.some((m) => m.role === 'user'),
    )
    const completed = started.filter((c) => c.status === 'completed')
    const userTurns = (c: Doc<'conversations'>) =>
      c.messages.filter((m) => m.role === 'user').length

    const stars = [0, 1, 2, 3].map((value) => ({
      stars: value,
      count: completed.filter((c) => (c.finalStars ?? 0) === value).length,
    }))

    // ---- How far along the arc people get ----
    const reached = (
      key:
        | 'observationMade'
        | 'feelingExpressed'
        | 'needIdentified'
        | 'requestMade'
        | 'empathyShown'
        | 'resolutionReached',
    ) => started.filter((c) => c.milestonesAchieved?.[key] === true).length
    const milestones = [
      { label: 'Sent a first message', count: started.length },
      { label: 'Made an observation', count: reached('observationMade') },
      { label: 'Expressed a feeling', count: reached('feelingExpressed') },
      { label: 'Named a need', count: reached('needIdentified') },
      { label: 'Made a request', count: reached('requestMade') },
      { label: 'Showed empathy', count: reached('empathyShown') },
      { label: 'Reached resolution', count: reached('resolutionReached') },
      { label: 'Wrapped up', count: completed.length },
    ].map((m) => ({ ...m, rate: percent(m.count, started.length) }))

    // ---- Where unfinished conversations stop ----
    // Older than a day and still open: they walked away rather than paused.
    const stale = started.filter(
      (c) => c.status !== 'completed' && c.lastMessageAt < Date.now() - DAY_MS,
    )
    const dropOff = Array.from({ length: MAX_USER_TURNS }, (_, i) => ({
      turns: i + 1,
      count: stale.filter((c) => userTurns(c) === i + 1).length,
    }))

    // ---- Which component is hardest, judged only where it was attempted ----
    const scored = started.flatMap((c) =>
      c.messages.flatMap((m) => (m.nvcScore ? [m] : [])),
    )
    const skills = COMPONENTS.map((component) => {
      const attempts = scored
        .map((m) => m.nvcScore?.[component] ?? 0)
        .filter((score) => score > 0)
      return {
        component,
        attempts: attempts.length,
        averageScore: mean(attempts),
      }
    })
    const jackalMessages = scored.filter((m) => m.isJackalLanguage).length

    // ---- Scenario choice in this range ----
    const scenarioIds = [...new Set(conversations.map((c) => c.scenarioId))]
    const scenarioDocs = new Map<Id<'scenarios'>, Doc<'scenarios'> | null>()
    await Promise.all(
      scenarioIds.map(async (id) => {
        scenarioDocs.set(id, await ctx.db.get(id))
      }),
    )
    const tally = (keyOf: (s: Doc<'scenarios'> | null) => string) => {
      const counts = new Map<string, { started: number; completed: number }>()
      for (const c of started) {
        const key = keyOf(scenarioDocs.get(c.scenarioId) ?? null)
        const entry = counts.get(key) ?? { started: 0, completed: 0 }
        entry.started += 1
        if (c.status === 'completed') entry.completed += 1
        counts.set(key, entry)
      }
      return [...counts.entries()]
        .map(([label, entry]) => ({ label, ...entry }))
        .sort((a, b) => b.started - a.started)
    }

    return {
      range: { days: args.days },
      truncated: conversations.length === MAX_CONVERSATIONS_SCANNED,
      totals: {
        opened: conversations.length,
        started: started.length,
        completed: completed.length,
        abandoned: started.filter((c) => c.status === 'abandoned').length,
        stillOpen: started.filter((c) => c.status === 'in_progress').length,
        completionRate: percent(completed.length, started.length),
        averageTurns: mean(completed.map(userTurns)),
        averageFinalScore: mean(completed.map((c) => c.finalScore ?? 0)),
        hitTurnCap: started.filter((c) => userTurns(c) >= MAX_USER_TURNS)
          .length,
        rewindsPerConversation: mean(started.map((c) => c.rewindsUsed ?? 0)),
        jackalRate: percent(jackalMessages, scored.length),
        scoredMessages: scored.length,
      },
      stars,
      milestones,
      dropOff,
      skills,
      bySource: tally((s) => scenarioGroup(s)),
      byDifficulty: tally((s) => s?.difficulty ?? 'removed'),
      byCategory: tally((s) => s?.category ?? 'removed'),
    }
  },
})

/**
 * All-time scenario popularity, from the light per-user progress rows rather
 * than the conversations themselves. Built-in scenarios are listed by title.
 * Custom scenarios are counted together and never named: their titles describe
 * real situations in people's lives.
 */
export const scenarioPopularity = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)

    const rows = await ctx.db.query('scenarioProgress').collect()
    const scenarioIds = [...new Set(rows.map((r) => r.scenarioId))]
    const scenarioDocs = new Map<Id<'scenarios'>, Doc<'scenarios'> | null>()
    await Promise.all(
      scenarioIds.map(async (id) => {
        scenarioDocs.set(id, await ctx.db.get(id))
      }),
    )

    const GROUP_LABELS: Record<Exclude<ScenarioGroup, 'builtin'>, string> = {
      user_created: 'Custom scenarios (all, kept private)',
      daily: 'Daily challenges (all)',
      removed: 'Scenarios since removed',
    }

    const groups = new Map<
      string,
      {
        title: string
        difficulty: string | null
        category: string | null
        orderIndex: number
        rows: Array<Doc<'scenarioProgress'>>
      }
    >()
    for (const row of rows) {
      const scenario = scenarioDocs.get(row.scenarioId) ?? null
      const group = scenarioGroup(scenario)
      const key = group === 'builtin' ? row.scenarioId : group
      const entry = groups.get(key) ?? {
        title:
          group === 'builtin' && scenario ? scenario.title : GROUP_LABELS[
            group as Exclude<ScenarioGroup, 'builtin'>
          ],
        difficulty: group === 'builtin' ? (scenario?.difficulty ?? null) : null,
        category: group === 'builtin' ? (scenario?.category ?? null) : null,
        orderIndex:
          group === 'builtin'
            ? (scenario?.orderIndex ?? 0)
            : Number.MAX_SAFE_INTEGER,
        rows: [],
      }
      entry.rows.push(row)
      groups.set(key, entry)
    }

    const finishedStatuses = new Set(['attempted', 'passed', 'mastered'])
    return [...groups.entries()]
      .map(([key, group]) => {
        const finished = group.rows.filter((r) =>
          finishedStatuses.has(r.status),
        )
        return {
          key,
          title: group.title,
          difficulty: group.difficulty,
          category: group.category,
          orderIndex: group.orderIndex,
          usersStarted: new Set(group.rows.map((r) => r.userId)).size,
          usersFinished: new Set(finished.map((r) => r.userId)).size,
          attempts: group.rows.reduce((n, r) => n + r.attempts, 0),
          mastered: group.rows.filter((r) => r.status === 'mastered').length,
          averageBestScore: mean(finished.map((r) => r.bestScore)),
        }
      })
      .sort((a, b) => b.usersStarted - a.usersStarted)
  },
})

// ============================================================================
// ENGAGEMENT: who gets how far, all time
// ============================================================================

export const engagement = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)

    const [
      users,
      progressRows,
      lessonRows,
      scenarioRows,
      feelingsRows,
      challengeRows,
      usageTotals,
      scenarios,
    ] = await Promise.all([
      ctx.db.query('users').collect(),
      ctx.db.query('userProgress').collect(),
      ctx.db.query('lessonProgress').collect(),
      ctx.db.query('scenarioProgress').collect(),
      ctx.db.query('userFeelingsProgress').collect(),
      ctx.db.query('challengeCompletions').collect(),
      ctx.db.query('userUsageTotals').collect(),
      ctx.db.query('scenarios').collect(),
    ])

    const total = users.length
    const distinct = <T extends { userId: Id<'users'> }>(rows: Array<T>) =>
      new Set(rows.map((r) => r.userId)).size
    const step = (label: string, count: number) => ({
      label,
      count,
      rate: percent(count, total),
    })

    const funnel = [
      step('Signed up', total),
      step(
        'Completed a lesson',
        distinct(lessonRows.filter((r) => r.completed)),
      ),
      step('Started a practice scenario', distinct(scenarioRows)),
      step(
        'Finished a conversation',
        progressRows.filter((p) => p.scenariosCompleted >= 1).length,
      ),
      step(
        'Finished three conversations',
        progressRows.filter((p) => p.scenariosCompleted >= 3).length,
      ),
      step(
        'Came back two days running',
        progressRows.filter((p) => p.longestStreak >= 2).length,
      ),
      step(
        'Held a seven day streak',
        progressRows.filter((p) => p.longestStreak >= 7).length,
      ),
    ]

    const adoption = [
      step('Lessons', distinct(lessonRows)),
      step('Practice conversations', distinct(scenarioRows)),
      step(
        'Feelings check-in',
        feelingsRows.filter((f) => f.dailyCheckIns.length > 0).length,
      ),
      step(
        'Feelings quiz',
        feelingsRows.filter((f) => f.quizQuestionsAnswered > 0).length,
      ),
      step(
        'Feelings wheel or library',
        feelingsRows.filter((f) => f.feelingsExplored.length > 0).length,
      ),
      step(
        'Custom scenario',
        new Set(scenarios.flatMap((s) => (s.ownerId ? [s.ownerId] : []))).size,
      ),
      step('Daily challenge', distinct(challengeRows.filter((c) => c.completed))),
    ].sort((a, b) => b.count - a.count)

    const lessons = [...LESSONS]
      .sort((a, b) => a.order - b.order)
      .map((lesson) => {
        const rows = lessonRows.filter((r) => r.lessonId === lesson.lessonId)
        const done = rows.filter((r) => r.completed)
        return {
          lessonId: lesson.lessonId,
          title: lesson.title,
          attempted: rows.length,
          completed: done.length,
          completionRate: percent(done.length, rows.length),
          averageScore: mean(rows.map((r) => r.score)),
          averageAttempts: mean(rows.map((r) => r.attempts)),
        }
      })

    // Weighted by how many conversations each average stands for, so one
    // person's single rough attempt does not count as much as a regular's fifty.
    const weight = (p: Doc<'userProgress'>) => p.scoredCompletions ?? 0
    const totalWeight = progressRows.reduce((n, p) => n + weight(p), 0)
    const skills = COMPONENTS.map((component) => ({
      component,
      averageScore:
        totalWeight > 0
          ? progressRows.reduce(
              (n, p) => n + p.averageScores[component] * weight(p),
              0,
            ) / totalWeight
          : 0,
    }))

    const maxLevel = Math.max(1, ...progressRows.map((p) => p.level))
    const levels = Array.from({ length: maxLevel }, (_, i) => ({
      level: i + 1,
      users: progressRows.filter((p) => p.level === i + 1).length,
    }))

    const achievements = ACHIEVEMENTS.map((a) => ({
      id: a.id,
      title: a.title,
      users: progressRows.filter((p) => p.achievements.includes(a.id)).length,
    })).sort((a, b) => b.users - a.users)

    const activeDays = bucketCounts(
      usageTotals.map((t) => t.activeDays),
      [
        { label: '1 day', min: 1, max: 1 },
        { label: '2 to 3 days', min: 2, max: 3 },
        { label: '4 to 7 days', min: 4, max: 7 },
        { label: '8 to 14 days', min: 8, max: 14 },
        { label: '15 days and up', min: 15, max: Number.MAX_SAFE_INTEGER },
      ],
    )

    const quizAnswered = feelingsRows.reduce(
      (n, f) => n + f.quizQuestionsAnswered,
      0,
    )
    const quizCorrect = feelingsRows.reduce(
      (n, f) => n + f.quizQuestionsCorrect,
      0,
    )

    return {
      totalUsers: total,
      funnel,
      adoption,
      lessons,
      skills,
      levels,
      achievements,
      activeDays,
      feelings: {
        checkIns: feelingsRows.reduce((n, f) => n + f.dailyCheckIns.length, 0),
        quizAnswered,
        quizAccuracy: percent(quizCorrect, quizAnswered),
        averageFeelingsExplored: mean(
          feelingsRows.map((f) => f.feelingsExplored.length),
        ),
        averageFeelingsSaved: mean(
          feelingsRows.map((f) => f.feelingsSaved.length),
        ),
      },
    }
  },
})

// ============================================================================
// USERS
// ============================================================================

export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)

    const [users, progressRows, usageTotals, lessonRows] = await Promise.all([
      ctx.db.query('users').collect(),
      ctx.db.query('userProgress').collect(),
      ctx.db.query('userUsageTotals').collect(),
      ctx.db.query('lessonProgress').collect(),
    ])

    const progressByUser = new Map(progressRows.map((p) => [p.userId, p]))
    const totalsByUser = new Map(usageTotals.map((t) => [t.userId, t]))
    const lessonsByUser = new Map<Id<'users'>, number>()
    for (const row of lessonRows) {
      if (!row.completed) continue
      lessonsByUser.set(row.userId, (lessonsByUser.get(row.userId) ?? 0) + 1)
    }

    return users.map((user) => {
      const progress = progressByUser.get(user._id)
      const totals = totalsByUser.get(user._id)
      return {
        userId: user._id,
        name: user.name ?? null,
        email: user.email ?? null,
        joinedAt: user._creationTime,
        // The progress row moves on every completion and check-in, and the
        // usage row on every model call; the later of the two is the best
        // "last seen" there is without logging page views.
        lastActiveAt: Math.max(
          user._creationTime,
          progress?.updatedAt ?? 0,
          totals?.lastCallAt ?? 0,
        ),
        level: progress?.level ?? 1,
        totalPoints: progress?.totalPoints ?? 0,
        currentStreak: progress?.currentStreak ?? 0,
        scenariosCompleted: progress?.scenariosCompleted ?? 0,
        averageScore: progress?.averageScores.overall ?? 0,
        lessonsCompleted: lessonsByUser.get(user._id) ?? 0,
        measuredTurns: totals?.turns ?? 0,
        modelCalls: totals?.modelCalls ?? 0,
        activeDays: totals?.activeDays ?? 0,
        costMicros: totals?.costMicros ?? 0,
      }
    })
  },
})

export const userDetail = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)

    const user = await ctx.db.get(args.userId)
    if (!user) return null

    const today = utcToday()
    const dates = recentDates(30, today)

    const [
      accounts,
      progress,
      totals,
      usageRows,
      lessonRows,
      feelings,
      conversations,
      recentCalls,
      customScenarios,
    ] = await Promise.all([
      ctx.db
        .query('authAccounts')
        .withIndex('userIdAndProvider', (q) => q.eq('userId', args.userId))
        .collect(),
      ctx.db
        .query('userProgress')
        .withIndex('by_user', (q) => q.eq('userId', args.userId))
        .first(),
      ctx.db
        .query('userUsageTotals')
        .withIndex('by_user', (q) => q.eq('userId', args.userId))
        .first(),
      ctx.db
        .query('dailyUsage')
        .withIndex('by_user_and_date', (q) =>
          q.eq('userId', args.userId).gte('date', dates[0]),
        )
        .collect(),
      ctx.db
        .query('lessonProgress')
        .withIndex('by_user', (q) => q.eq('userId', args.userId))
        .collect(),
      ctx.db
        .query('userFeelingsProgress')
        .withIndex('by_user', (q) => q.eq('userId', args.userId))
        .first(),
      ctx.db
        .query('conversations')
        .withIndex('by_user', (q) => q.eq('userId', args.userId))
        .order('desc')
        .take(50),
      ctx.db
        .query('modelCalls')
        .withIndex('by_user', (q) => q.eq('userId', args.userId))
        .order('desc')
        .take(200),
      ctx.db
        .query('scenarios')
        .withIndex('by_owner', (q) => q.eq('ownerId', args.userId))
        .collect(),
    ])

    const usageByDate = new Map(usageRows.map((r) => [r.date, r]))
    const daily = dates.map((date) => {
      const row = usageByDate.get(date)
      return {
        date,
        turns: row?.turns ?? 0,
        scenarioGenerations: row?.scenarioGenerations ?? 0,
        costMicros: row?.costMicros ?? 0,
      }
    })

    // Cost per conversation and per kind, from the recent raw calls.
    const costByConversation = new Map<Id<'conversations'>, number>()
    for (const call of recentCalls) {
      if (!call.conversationId) continue
      costByConversation.set(
        call.conversationId,
        (costByConversation.get(call.conversationId) ?? 0) + call.costMicros,
      )
    }
    const recentCostByKind = MODEL_CALL_KINDS.map((kind) => {
      const calls = recentCalls.filter((c) => c.kind === kind)
      return {
        kind,
        calls: calls.length,
        costMicros: calls.reduce((n, c) => n + c.costMicros, 0),
      }
    }).filter((k) => k.calls > 0)

    const scenarioTitles = new Map<Id<'scenarios'>, string>()
    await Promise.all(
      [...new Set(conversations.map((c) => c.scenarioId))].map(async (id) => {
        const scenario = await ctx.db.get(id)
        const group = scenarioGroup(scenario)
        scenarioTitles.set(
          id,
          // A custom scenario's title describes a real situation in this
          // person's life, so it is not shown even here.
          group === 'builtin' && scenario
            ? scenario.title
            : group === 'user_created'
              ? 'Custom scenario'
              : group === 'daily'
                ? 'Daily challenge'
                : 'Removed scenario',
        )
      }),
    )

    return {
      user: {
        userId: user._id,
        name: user.name ?? null,
        email: user.email ?? null,
        joinedAt: user._creationTime,
        signsInWith: accounts.map((a) => a.provider),
      },
      progress: progress
        ? {
            level: progress.level,
            totalPoints: progress.totalPoints,
            currentStreak: progress.currentStreak,
            longestStreak: progress.longestStreak,
            lastPracticeDate: progress.lastPracticeDate || null,
            scenariosCompleted: progress.scenariosCompleted,
            scenariosPassed: progress.scenariosPassed,
            scenariosMastered: progress.scenariosMastered,
            totalStars: progress.totalStars,
            averageScores: progress.averageScores,
            achievements: progress.achievements.length,
          }
        : null,
      cost: {
        lifetimeMicros: totals?.costMicros ?? 0,
        last30Micros: daily.reduce((n, d) => n + d.costMicros, 0),
        modelCalls: totals?.modelCalls ?? 0,
        measuredTurns: totals?.turns ?? 0,
        inputTokens: totals?.inputTokens ?? 0,
        outputTokens: totals?.outputTokens ?? 0,
        activeDays: totals?.activeDays ?? 0,
        firstCallAt: totals?.firstCallAt ?? null,
        recentCostByKind,
      },
      daily,
      lessons: lessonRows.map((r) => ({
        lessonId: r.lessonId,
        title:
          LESSONS.find((l) => l.lessonId === r.lessonId)?.title ?? r.lessonId,
        completed: r.completed,
        score: r.score,
        attempts: r.attempts,
      })),
      // Counts only: which feelings someone checked in with, and any note they
      // wrote, are theirs.
      feelings: feelings
        ? {
            checkIns: feelings.dailyCheckIns.length,
            checkInStreak: feelings.currentCheckInStreak,
            quizAnswered: feelings.quizQuestionsAnswered,
            quizScore: feelings.quizScore,
            feelingsExplored: feelings.feelingsExplored.length,
            feelingsSaved: feelings.feelingsSaved.length,
          }
        : null,
      customScenarios: customScenarios.length,
      conversations: conversations.map((c) => ({
        conversationId: c._id,
        scenario: scenarioTitles.get(c.scenarioId) ?? 'Removed scenario',
        status: c.status,
        startedAt: c.createdAt,
        lastMessageAt: c.lastMessageAt,
        userTurns: c.messages.filter((m) => m.role === 'user').length,
        finalScore: c.finalScore ?? null,
        finalStars: c.finalStars ?? null,
        rewindsUsed: c.rewindsUsed ?? 0,
        // Null when the calls are older than the recent window read above.
        costMicros: costByConversation.get(c._id) ?? null,
      })),
    }
  },
})

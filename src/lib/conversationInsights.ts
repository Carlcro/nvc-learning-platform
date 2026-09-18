/**
 * Pure helpers that turn a conversation's stored per-turn scores into the
 * takeaways shown around it: what went best, what to focus on next, and which
 * scenario to try after this one. Everything here is derived from data the
 * server already holds, so none of it needs another model call.
 */

export type NVCComponent = 'observation' | 'feeling' | 'need' | 'request'

export const NVC_COMPONENTS: ReadonlyArray<NVCComponent> = [
  'observation',
  'feeling',
  'need',
  'request',
]

export function isNVCComponent(value: unknown): value is NVCComponent {
  return NVC_COMPONENTS.includes(value as NVCComponent)
}

interface ScoredMessage {
  role: 'user' | 'assistant'
  content: string
  nvcScore?: Record<NVCComponent, number> & { total: number }
}

/** Where to go to brush up on one component, and how to talk about it. */
export const SKILL_RESOURCES: Record<
  NVCComponent,
  {
    to: string
    label: string
    /** Why this skill is worth a refresher, as a gentle invitation. */
    invite: string
    /** The component as a plural noun, for running text. */
    plural: string
    /** A first move for someone about to practice this component. */
    nudge: string
  }
> = {
  observation: {
    to: '/learn/observation',
    label: 'Observations lesson',
    invite:
      'Separating what happened from what we think about it is its own skill.',
    plural: 'observations',
    nudge:
      'Describe what happened the way a camera would have seen it, before saying what you make of it.',
  },
  feeling: {
    to: '/feelings',
    label: 'Feelings library',
    invite: 'Finding the exact feeling word gets easier with a bigger vocabulary.',
    plural: 'feelings',
    nudge:
      'Look for the one word that names the emotion itself: worried, hurt, tired, hopeful.',
  },
  need: {
    to: '/learn/need',
    label: 'Needs lesson',
    invite:
      'Connecting feelings to the universal needs beneath them takes practice.',
    plural: 'needs',
    nudge:
      'Ask yourself what matters to you underneath the feeling: trust, rest, respect, being included.',
  },
  request: {
    to: '/learn/request',
    label: 'Requests lesson',
    invite: 'Shaping clear, doable requests is worth a short refresher.',
    plural: 'requests',
    nudge:
      'Ask for one concrete thing they could say yes or no to, and leave room for a no.',
  },
}

// A component scoring at least this (of 25) has genuinely landed: it is the
// bar the conversation milestones use. One averaging below FOCUS_BELOW still
// has clear room to grow.
const STRENGTH_AT = 15
const FOCUS_BELOW = 20

export interface ConversationInsights {
  /** The component the user handled best, when any landed well. */
  strongest: NVCComponent | null
  /** The component most worth attention next time. */
  focus: NVCComponent | null
  /** True when the focus component was never attempted at all. */
  focusUntried: boolean
  /** The user's own message that landed best, worth quoting back to them. */
  bestMessage: { content: string; total: number } | null
}

/**
 * Average a component over the turns that attempted it. Absent components
 * score 0 by design ("not this turn"), so counting them would punish exactly
 * the gradual unfolding the app teaches. Mirrors `averageAttempted` on the
 * server.
 */
function averageAttempted(
  messages: ReadonlyArray<ScoredMessage>,
  key: NVCComponent,
): number | null {
  const attempts = messages
    .map((m) => m.nvcScore?.[key] ?? 0)
    .filter((score) => score > 0)
  if (attempts.length === 0) return null
  return attempts.reduce((a, b) => a + b, 0) / attempts.length
}

export function summarizeConversation(
  allMessages: ReadonlyArray<ScoredMessage>,
): ConversationInsights {
  const messages = allMessages.filter((m) => m.role === 'user' && m.nvcScore)
  const averages = NVC_COMPONENTS.map((component) => ({
    component,
    avg: averageAttempted(messages, component),
  }))

  const attempted = averages.filter(
    (a): a is { component: NVCComponent; avg: number } => a.avg !== null,
  )

  const best = [...attempted].sort((a, b) => b.avg - a.avg).at(0)
  const strongest = best && best.avg >= STRENGTH_AT ? best.component : null

  // The earliest piece of the arc that never landed is the clearest next
  // step. "Landed" is the same bar the milestones use (one turn at 15 or
  // more), so this always agrees with the progress rail and the results
  // trail. Failing that, the component with the most room to grow.
  const notLanded = NVC_COMPONENTS.find(
    (component) =>
      !messages.some((m) => (m.nvcScore?.[component] ?? 0) >= STRENGTH_AT),
  )
  const weakest = [...attempted].sort((a, b) => a.avg - b.avg).at(0)
  let focus: NVCComponent | null = null
  let focusUntried = false
  if (messages.length > 0 && notLanded) {
    focus = notLanded
    focusUntried = !attempted.some((a) => a.component === notLanded)
  } else if (
    weakest &&
    weakest.avg < FOCUS_BELOW &&
    weakest.component !== strongest
  ) {
    focus = weakest.component
  }

  const top = [...messages].sort(
    (a, b) => (b.nvcScore?.total ?? 0) - (a.nvcScore?.total ?? 0),
  )[0] as ScoredMessage | undefined
  const bestMessage =
    top?.nvcScore && top.nvcScore.total >= 60
      ? { content: top.content, total: top.nvcScore.total }
      : null

  return { strongest, focus, focusUntried, bestMessage }
}

// ---------------------------------------------------------------------------
// Which scenario to suggest next
// ---------------------------------------------------------------------------

interface LadderScenario {
  _id: string
  unlockRequirements: { minLevel: number }
}

interface LadderProgress {
  scenarioId: string
  status?: string
}

/**
 * The next scenario worth suggesting: the first one on the ladder (scenarios
 * arrive ordered by `orderIndex`) that the user has not yet passed, preferring
 * ones at or below their level. Nothing is ever locked, so this is only a
 * gentle pointer, never a gate.
 */
export function pickRecommendedScenario<T extends LadderScenario>(
  scenarios: ReadonlyArray<T>,
  progress: ReadonlyArray<LadderProgress>,
  userLevel: number,
  excludeScenarioId?: string,
): T | null {
  const passed = new Set(
    progress
      .filter((p) => p.status === 'passed' || p.status === 'mastered')
      .map((p) => p.scenarioId),
  )
  const open = scenarios.filter(
    (s) => !passed.has(s._id) && s._id !== excludeScenarioId,
  )
  return (
    open.find((s) => s.unlockRequirements.minLevel <= userLevel) ??
    open.at(0) ??
    null
  )
}

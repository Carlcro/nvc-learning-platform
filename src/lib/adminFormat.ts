/**
 * Formatting for the admin panel. Costs arrive in micro-dollars (millionths of
 * a US dollar), which is how the backend stores them.
 */

/**
 * Money, with enough decimals to mean something. A practice turn costs a few
 * cents, so rounding small amounts to two places would show most rows as $0.02
 * or $0.00 and hide exactly the differences this panel exists to show.
 */
export function formatUsd(micros: number): string {
  const dollars = micros / 1_000_000
  if (dollars === 0) return '$0'
  const digits = dollars >= 100 ? 0 : dollars >= 1 ? 2 : dollars >= 0.01 ? 3 : 4
  return `$${dollars.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`
}

export function formatCount(value: number): string {
  return Math.round(value).toLocaleString('en-US')
}

/** "1 turn", "12 turns". */
export function plural(count: number, one: string, many: string): string {
  return `${formatDecimal(count)} ${count === 1 ? one : many}`
}

/** One decimal only when it carries information. */
export function formatDecimal(value: number): string {
  return value.toLocaleString('en-US', {
    maximumFractionDigits: value >= 100 ? 0 : 1,
  })
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`
}

/** "Sep 20" from a YYYY-MM-DD date, read as UTC so it never shifts a day. */
export function formatDay(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/** "today", "3 days ago", then a plain date once it is old enough. */
export function formatAgo(timestamp: number, now: number = Date.now()): string {
  const days = Math.floor((now - timestamp) / (24 * 60 * 60 * 1000))
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days} days ago`
  return formatTimestamp(timestamp)
}

const KIND_LABELS: Record<string, string> = {
  analysis: 'Turn scoring and coaching',
  character_reply: 'Character replies',
  reflection: 'Worked example after a conversation',
  scenario_readiness: 'Custom scenario questions',
  scenario_generation: 'Custom scenario building',
  daily_challenges: 'Nightly daily challenges',
}

export function kindLabel(kind: string): string {
  return KIND_LABELS[kind] ?? kind
}

/** "user_created" to "User created". */
export function humanize(value: string): string {
  const spaced = value.replace(/_/g, ' ')
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

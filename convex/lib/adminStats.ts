/**
 * Small pure helpers behind the admin statistics, kept apart from the queries
 * so the arithmetic can be tested without a deployment.
 */

const DAY_MS = 24 * 60 * 60 * 1000

/** A timestamp as a UTC calendar date, YYYY-MM-DD. */
export function utcDateOf(timestamp: number): string {
  return new Date(timestamp).toISOString().split('T')[0]
}

/** The `days` UTC dates ending on (and including) `today`, oldest first. */
export function recentDates(days: number, today: string): Array<string> {
  const [y, m, d] = today.split('-').map(Number)
  const end = Date.UTC(y, m - 1, d)
  const dates: Array<string> = []
  for (let i = days - 1; i >= 0; i--) {
    dates.push(utcDateOf(end - i * DAY_MS))
  }
  return dates
}

/** Arithmetic mean, or 0 for an empty list so callers never divide by zero. */
export function mean(values: Array<number>): number {
  if (values.length === 0) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

/** Share of `part` in `whole` as 0 to 100, or 0 when there is no whole. */
export function percent(part: number, whole: number): number {
  if (whole <= 0) return 0
  return (part / whole) * 100
}

/**
 * Nearest-rank percentile (p from 0 to 100) of an unsorted list. Nearest rank
 * always returns a value that really occurred, which is what we want when the
 * question is "how many turns does a heavy day actually have".
 */
export function percentile(values: Array<number>, p: number): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const rank = Math.ceil((p / 100) * sorted.length)
  return sorted[Math.min(sorted.length - 1, Math.max(0, rank - 1))]
}

export interface Bucket {
  label: string
  min: number
  max: number // inclusive
}

/** Count how many values fall in each inclusive bucket. */
export function bucketCounts(
  values: Array<number>,
  buckets: Array<Bucket>,
): Array<{ label: string; count: number }> {
  return buckets.map((bucket) => ({
    label: bucket.label,
    count: values.filter((v) => v >= bucket.min && v <= bucket.max).length,
  }))
}

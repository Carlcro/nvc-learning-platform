/** The date ranges the admin queries accept. */
export const RANGE_OPTIONS = [7, 30, 90] as const

export type RangeDays = (typeof RANGE_OPTIONS)[number]

export function isRangeDays(value: unknown): value is RangeDays {
  return RANGE_OPTIONS.some((option) => option === value)
}

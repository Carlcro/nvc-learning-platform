import { describe, expect, it } from 'vitest'
import {
  bucketCounts,
  mean,
  percent,
  percentile,
  recentDates,
  utcDateOf,
} from './adminStats'

describe('recentDates', () => {
  it('ends on today and runs oldest first', () => {
    expect(recentDates(3, '2026-09-20')).toEqual([
      '2026-09-18',
      '2026-09-19',
      '2026-09-20',
    ])
  })

  it('crosses month and year boundaries', () => {
    expect(recentDates(3, '2026-01-01')).toEqual([
      '2025-12-30',
      '2025-12-31',
      '2026-01-01',
    ])
  })

  it('returns exactly the number of days asked for', () => {
    expect(recentDates(90, '2026-09-20')).toHaveLength(90)
  })
})

describe('utcDateOf', () => {
  it('uses the UTC calendar day, matching the dailyUsage rows', () => {
    expect(utcDateOf(Date.UTC(2026, 8, 20, 23, 59))).toBe('2026-09-20')
  })
})

describe('mean and percent', () => {
  it('treat empty input as zero instead of dividing by zero', () => {
    expect(mean([])).toBe(0)
    expect(percent(3, 0)).toBe(0)
  })

  it('compute the plain values', () => {
    expect(mean([2, 4, 9])).toBe(5)
    expect(percent(1, 4)).toBe(25)
  })
})

describe('percentile', () => {
  it('returns a value that really occurred', () => {
    const turns = [3, 1, 40, 8, 5]
    expect(percentile(turns, 50)).toBe(5)
    expect(percentile(turns, 90)).toBe(40)
    expect(percentile(turns, 100)).toBe(40)
  })

  it('is zero for no data', () => {
    expect(percentile([], 90)).toBe(0)
  })
})

describe('bucketCounts', () => {
  it('counts inclusive ranges and leaves out what fits nowhere', () => {
    expect(
      bucketCounts(
        [0, 1, 5, 6, 100],
        [
          { label: 'low', min: 1, max: 5 },
          { label: 'high', min: 6, max: Number.MAX_SAFE_INTEGER },
        ],
      ),
    ).toEqual([
      { label: 'low', count: 2 },
      { label: 'high', count: 2 },
    ])
  })
})

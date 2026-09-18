import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  ACHIEVEMENTS,
  advanceStreak,
  completionStatusForScore,
  daysBetween,
  levelForPoints,
  newlyEarnedAchievements,
  pointsForCompletion,
  pointsInLevel,
  pointsToNextLevel,
  resolveLocalDate,
  scenarioStatusForScore,
  starsForScore,
  updateAverages,
  utcToday,
} from './progress'
import type { AchievementSnapshot, ComponentAverages } from './progress'

describe('starsForScore', () => {
  // The boundaries are the whole contract, so each one is pinned from both
  // sides rather than sampled in the middle of a band.
  it.each([
    [100, 3],
    [85, 3],
    [84, 2],
    [70, 2],
    [69, 1],
    [60, 1],
    [59, 0],
    [0, 0],
  ])('scores %i as %i stars', (score, stars) => {
    expect(starsForScore(score)).toBe(stars)
  })
})

describe('completionStatusForScore', () => {
  it.each([
    [85, 'excellent'],
    [84, 'success'],
    [70, 'success'],
    [69, 'pass'],
    [60, 'pass'],
    [59, 'incomplete'],
  ] as const)('scores %i as %s', (score, status) => {
    expect(completionStatusForScore(score)).toBe(status)
  })
})

describe('scenarioStatusForScore', () => {
  it.each([
    [85, 'mastered'],
    [84, 'passed'],
    [60, 'passed'],
    [59, 'attempted'],
  ] as const)('scores %i as %s', (score, status) => {
    expect(scenarioStatusForScore(score)).toBe(status)
  })
})

describe('daysBetween', () => {
  it('counts forward and backward', () => {
    expect(daysBetween('2026-03-01', '2026-03-02')).toBe(1)
    expect(daysBetween('2026-03-02', '2026-03-01')).toBe(-1)
    expect(daysBetween('2026-03-01', '2026-03-01')).toBe(0)
  })

  it('crosses month and year boundaries', () => {
    expect(daysBetween('2026-01-31', '2026-02-01')).toBe(1)
    expect(daysBetween('2026-12-31', '2027-01-01')).toBe(1)
  })

  it('handles a leap day', () => {
    expect(daysBetween('2028-02-28', '2028-03-01')).toBe(2)
    expect(daysBetween('2027-02-28', '2027-03-01')).toBe(1)
  })
})

describe('resolveLocalDate', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  function freezeUtc(date: string) {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(`${date}T12:00:00Z`))
  }

  it('falls back to server today when the date is missing or malformed', () => {
    freezeUtc('2026-03-10')
    expect(resolveLocalDate(undefined)).toBe('2026-03-10')
    expect(resolveLocalDate('')).toBe('2026-03-10')
    expect(resolveLocalDate('not-a-date')).toBe('2026-03-10')
    expect(resolveLocalDate('2026-3-10')).toBe('2026-03-10')
    expect(resolveLocalDate('10-03-2026')).toBe('2026-03-10')
  })

  it('accepts a date one day either side, which real timezones produce', () => {
    freezeUtc('2026-03-10')
    // A user in UTC+13 can legitimately already be on the 11th, and a user in
    // UTC-11 can still be on the 9th.
    expect(resolveLocalDate('2026-03-11')).toBe('2026-03-11')
    expect(resolveLocalDate('2026-03-09')).toBe('2026-03-09')
    expect(resolveLocalDate('2026-03-10')).toBe('2026-03-10')
  })

  it('refuses a date far from server time, so streaks cannot be fabricated', () => {
    freezeUtc('2026-03-10')
    expect(resolveLocalDate('2026-03-20')).toBe('2026-03-10')
    expect(resolveLocalDate('2026-03-01')).toBe('2026-03-10')
    expect(resolveLocalDate('2027-03-10')).toBe('2026-03-10')
  })

  it('stays correct across a month boundary', () => {
    freezeUtc('2026-04-01')
    expect(resolveLocalDate('2026-03-31')).toBe('2026-03-31')
    expect(resolveLocalDate('2026-03-30')).toBe('2026-04-01')
  })
})

describe('utcToday', () => {
  it('formats as YYYY-MM-DD', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-10T23:30:00Z'))
    expect(utcToday()).toBe('2026-03-10')
    vi.useRealTimers()
  })
})

describe('advanceStreak', () => {
  it('starts a streak when there is no prior practice', () => {
    expect(
      advanceStreak(
        { currentStreak: 0, longestStreak: 0, lastPracticeDate: '' },
        '2026-03-10',
      ),
    ).toEqual({
      currentStreak: 1,
      longestStreak: 1,
      lastPracticeDate: '2026-03-10',
    })
  })

  it('is a no-op on a second session the same day', () => {
    const state = {
      currentStreak: 4,
      longestStreak: 9,
      lastPracticeDate: '2026-03-10',
    }
    expect(advanceStreak(state, '2026-03-10')).toBe(state)
  })

  it('extends on consecutive days', () => {
    expect(
      advanceStreak(
        { currentStreak: 4, longestStreak: 9, lastPracticeDate: '2026-03-10' },
        '2026-03-11',
      ),
    ).toEqual({
      currentStreak: 5,
      longestStreak: 9,
      lastPracticeDate: '2026-03-11',
    })
  })

  it('restarts at 1 after a missed day', () => {
    expect(
      advanceStreak(
        { currentStreak: 6, longestStreak: 6, lastPracticeDate: '2026-03-10' },
        '2026-03-12',
      ),
    ).toEqual({
      currentStreak: 1,
      longestStreak: 6,
      lastPracticeDate: '2026-03-12',
    })
  })

  it('raises the longest streak as the current one passes it', () => {
    expect(
      advanceStreak(
        { currentStreak: 9, longestStreak: 9, lastPracticeDate: '2026-03-10' },
        '2026-03-11',
      ),
    ).toEqual({
      currentStreak: 10,
      longestStreak: 10,
      lastPracticeDate: '2026-03-11',
    })
  })

  it('ignores a date in the past, so a stale client cannot rewrite history', () => {
    const state = {
      currentStreak: 4,
      longestStreak: 9,
      lastPracticeDate: '2026-03-10',
    }
    expect(advanceStreak(state, '2026-03-09')).toBe(state)
  })

  it('extends across a month boundary', () => {
    expect(
      advanceStreak(
        { currentStreak: 2, longestStreak: 2, lastPracticeDate: '2026-03-31' },
        '2026-04-01',
      ).currentStreak,
    ).toBe(3)
  })
})

describe('pointsForCompletion', () => {
  it('pays 100 per star on a first completion', () => {
    expect(
      pointsForCompletion({
        finalScore: 88,
        finalStars: 3,
        isFirstCompletion: true,
        previousBestStars: 0,
        previousBestScore: 0,
      }),
    ).toBe(300)
  })

  it('awards nothing for a first completion that earned no stars', () => {
    expect(
      pointsForCompletion({
        finalScore: 40,
        finalStars: 0,
        isFirstCompletion: true,
        previousBestStars: 0,
        previousBestScore: 0,
      }),
    ).toBe(0)
  })

  it('rewards improvement on a repeat', () => {
    expect(
      pointsForCompletion({
        finalScore: 88,
        finalStars: 3,
        isFirstCompletion: false,
        previousBestStars: 1,
        previousBestScore: 65,
      }),
    ).toBe(200)
  })

  it('gives a small practice bonus for a repeat that does not improve', () => {
    expect(
      pointsForCompletion({
        finalScore: 72,
        finalStars: 2,
        isFirstCompletion: false,
        previousBestStars: 3,
        previousBestScore: 90,
      }),
    ).toBe(25)
  })

  it('cannot be farmed by replaying a scenario with no stars', () => {
    expect(
      pointsForCompletion({
        finalScore: 30,
        finalStars: 0,
        isFirstCompletion: false,
        previousBestStars: 3,
        previousBestScore: 90,
      }),
    ).toBe(0)
  })

  it('adds the perfect bonus exactly once', () => {
    const first = pointsForCompletion({
      finalScore: 100,
      finalStars: 3,
      isFirstCompletion: true,
      previousBestStars: 0,
      previousBestScore: 0,
    })
    expect(first).toBe(500) // 300 for stars plus the 200 bonus

    const second = pointsForCompletion({
      finalScore: 100,
      finalStars: 3,
      isFirstCompletion: false,
      previousBestStars: 3,
      previousBestScore: 100,
    })
    expect(second).toBe(25) // practice bonus only; the perfect bonus is spent
  })
})

describe('levelForPoints', () => {
  // Thresholds are 0/300/700/1200/1800/2500, then every 800 points.
  it.each([
    [0, 1],
    [299, 1],
    [300, 2],
    [699, 2],
    [700, 3],
    [1199, 3],
    [1200, 4],
    [1799, 4],
    [1800, 5],
    [2499, 5],
    [2500, 6],
    [3299, 6],
    [3300, 7],
    [4099, 7],
    [4100, 8],
  ])('puts %i points at level %i', (points, level) => {
    expect(levelForPoints(points)).toBe(level)
  })

  it('never reports the same level for two adjacent bands', () => {
    // Guards the seam where the fixed thresholds hand off to the +800 formula.
    const levels = [2499, 2500, 3299, 3300].map(levelForPoints)
    expect(levels).toEqual([5, 6, 6, 7])
  })
})

describe('pointsToNextLevel', () => {
  it.each([
    [0, 300],
    [299, 1],
    [300, 400],
    [1800, 700],
    [2499, 1],
    [2500, 800],
    [3299, 1],
    [3300, 800],
  ])('reports %i points as %i from the next level', (points, remaining) => {
    expect(pointsToNextLevel(points)).toBe(remaining)
  })

  it('is never zero, which would read as a level that never arrives', () => {
    for (let points = 0; points <= 6000; points += 1) {
      expect(pointsToNextLevel(points)).toBeGreaterThan(0)
    }
  })

  it('agrees with levelForPoints: spending the remainder levels you up', () => {
    for (const points of [0, 299, 300, 1799, 1800, 2499, 2500, 3299, 3300]) {
      const remaining = pointsToNextLevel(points)
      expect(levelForPoints(points + remaining)).toBe(levelForPoints(points) + 1)
    }
  })
})

describe('pointsInLevel', () => {
  it.each([
    [1, 300],
    [2, 400],
    [3, 500],
    [4, 600],
    [5, 700],
    [6, 800],
    [7, 800],
    [12, 800],
  ])('level %i spans %i points', (level, span) => {
    expect(pointsInLevel(level)).toBe(span)
  })

  it('matches the distance actually travelled through each level', () => {
    // Walking the first point of a level to the first point of the next must
    // cover exactly the band width the progress bar renders against.
    for (let level = 1; level <= 10; level++) {
      let start = 0
      while (levelForPoints(start) < level) start += 1
      let next = start
      while (levelForPoints(next) === level) next += 1
      expect(next - start).toBe(pointsInLevel(level))
    }
  })
})

describe('updateAverages', () => {
  const zero: ComponentAverages = {
    observation: 0,
    feeling: 0,
    need: 0,
    request: 0,
    overall: 0,
  }

  it('takes the first attempt as the average', () => {
    expect(
      updateAverages(
        zero,
        0,
        { observation: 20, feeling: 15, need: 10, request: 5 },
        80,
      ),
    ).toEqual({
      observation: 20,
      feeling: 15,
      need: 10,
      request: 5,
      overall: 80,
    })
  })

  it('folds a second attempt into a true mean', () => {
    const after = updateAverages(
      { observation: 20, feeling: 20, need: 20, request: 20, overall: 80 },
      1,
      { observation: 10, feeling: 10, need: 10, request: 10 },
      60,
    )
    expect(after.observation).toBe(15)
    expect(after.overall).toBe(70)
  })

  it('stays a true mean over many samples rather than averaging an average', () => {
    // Nine attempts of 90 then one of 0 must land on 81, not on 45.
    let averages = zero
    for (let i = 0; i < 9; i++) {
      averages = updateAverages(
        averages,
        i,
        { observation: 90, feeling: 90, need: 90, request: 90 },
        90,
      )
    }
    averages = updateAverages(
      averages,
      9,
      { observation: 0, feeling: 0, need: 0, request: 0 },
      0,
    )
    expect(averages.overall).toBeCloseTo(81, 10)
    expect(averages.observation).toBeCloseTo(81, 10)
  })
})

describe('newlyEarnedAchievements', () => {
  const base: AchievementSnapshot = {
    scenariosCompleted: 0,
    scenariosPassed: 0,
    scenariosMastered: 0,
    totalStars: 0,
    currentStreak: 0,
    finalScore: 0,
    empathyShown: false,
  }

  it('awards nothing for a snapshot that has achieved nothing', () => {
    expect(newlyEarnedAchievements(base, [])).toEqual([])
  })

  it('awards the first conversation', () => {
    const earned = newlyEarnedAchievements(
      { ...base, scenariosCompleted: 1 },
      [],
    )
    expect(earned.map((a) => a.id)).toEqual(['first-conversation'])
  })

  it('never re-awards something already earned', () => {
    const snapshot = { ...base, scenariosCompleted: 1 }
    expect(
      newlyEarnedAchievements(snapshot, ['first-conversation']),
    ).toEqual([])
  })

  it('can award several at once and reports them in catalog order', () => {
    const earned = newlyEarnedAchievements(
      {
        scenariosCompleted: 5,
        scenariosPassed: 3,
        scenariosMastered: 1,
        totalStars: 10,
        currentStreak: 3,
        finalScore: 100,
        empathyShown: true,
      },
      [],
    )
    expect(earned.map((a) => a.id)).toEqual([
      'first-conversation',
      'first-pass',
      'first-mastery',
      'five-completed',
      'heard-them',
      'streak-3',
      'stars-10',
      'perfect-connection',
    ])
  })

  it('only counts a perfect score, not a near-perfect one', () => {
    expect(
      newlyEarnedAchievements({ ...base, finalScore: 99 }, []).map((a) => a.id),
    ).not.toContain('perfect-connection')
    expect(
      newlyEarnedAchievements({ ...base, finalScore: 100 }, []).map((a) => a.id),
    ).toContain('perfect-connection')
  })

  it('has a unique id for every achievement', () => {
    const ids = ACHIEVEMENTS.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

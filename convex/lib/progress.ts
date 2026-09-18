/**
 * Shared, pure progression logic: dates, streaks, stars, points, achievements.
 *
 * Everything here is a pure function so mutations across files (conversation
 * completion, daily challenges, check-ins) apply identical rules instead of
 * drifting copies.
 */

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

/** Server "today" in UTC, as YYYY-MM-DD. */
export function utcToday(): string {
  return new Date().toISOString().split('T')[0]
}

/**
 * Resolve the date a practice event happened on, in the user's own timezone.
 *
 * The client sends its local calendar date so an evening session does not
 * register as tomorrow (or two sessions on one local day as different days).
 * The value is validated and only trusted within one calendar day of server
 * time, so it cannot be used to fabricate streaks.
 */
export function resolveLocalDate(localDate: string | undefined): string {
  const serverDate = utcToday()
  if (!localDate || !DATE_PATTERN.test(localDate)) return serverDate
  if (Math.abs(daysBetween(serverDate, localDate)) > 1) return serverDate
  return localDate
}

/** Whole days from date `a` to date `b` (both YYYY-MM-DD). */
export function daysBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split('-').map(Number)
  const [by, bm, bd] = b.split('-').map(Number)
  const utcA = Date.UTC(ay, am - 1, ad)
  const utcB = Date.UTC(by, bm - 1, bd)
  return Math.round((utcB - utcA) / (1000 * 60 * 60 * 24))
}

export interface StreakState {
  currentStreak: number
  longestStreak: number
  lastPracticeDate: string
}

/**
 * Advance a daily streak for activity on `today`.
 * Same day is a no-op, the next day extends, any gap restarts at 1.
 */
export function advanceStreak(state: StreakState, today: string): StreakState {
  if (state.lastPracticeDate === today) return state

  const gap = state.lastPracticeDate
    ? daysBetween(state.lastPracticeDate, today)
    : Number.POSITIVE_INFINITY
  if (gap <= 0) return state

  const currentStreak = gap === 1 ? state.currentStreak + 1 : 1
  return {
    currentStreak,
    longestStreak: Math.max(currentStreak, state.longestStreak),
    lastPracticeDate: today,
  }
}

// ---------------------------------------------------------------------------
// Scoring thresholds (single source of truth, shared with the frontend)
// ---------------------------------------------------------------------------

export function starsForScore(score: number): number {
  if (score >= 85) return 3
  if (score >= 70) return 2
  if (score >= 60) return 1
  return 0
}

export function completionStatusForScore(
  score: number,
): 'excellent' | 'success' | 'pass' | 'incomplete' {
  if (score >= 85) return 'excellent'
  if (score >= 70) return 'success'
  if (score >= 60) return 'pass'
  return 'incomplete'
}

export function scenarioStatusForScore(
  score: number,
): 'attempted' | 'passed' | 'mastered' {
  if (score >= 85) return 'mastered'
  if (score >= 60) return 'passed'
  return 'attempted'
}

// ---------------------------------------------------------------------------
// Points and levels
// ---------------------------------------------------------------------------

/**
 * Points for a scenario completion. First completions pay in full; repeats
 * reward improvement over the previous best (plus a small practice bonus), so
 * replaying an easy scenario cannot be farmed for unlimited points.
 */
export function pointsForCompletion(args: {
  finalScore: number
  finalStars: number
  isFirstCompletion: boolean
  previousBestStars: number
  previousBestScore: number
}): number {
  let points = 0
  if (args.isFirstCompletion) {
    points = 100 * args.finalStars
  } else {
    const starsGained = Math.max(0, args.finalStars - args.previousBestStars)
    points =
      starsGained > 0
        ? 100 * starsGained
        : args.finalStars > 0
          ? 25 // showing up to practice still counts for a little
          : 0
  }

  // Perfect score bonus, once per scenario
  if (args.finalScore === 100 && args.previousBestScore < 100) {
    points += 200
  }

  return points
}

const LEVEL_THRESHOLDS = [0, 300, 700, 1200, 1800, 2500]
/** Points per level once the fixed thresholds run out. */
const LEVEL_STEP = 800

/**
 * The last fixed threshold (2500) opens level 6, and every 800 points after it
 * opens the next. Getting the constant wrong here strands the user on a level
 * whose "points to next level" counts down to zero and stays there.
 */
export function levelForPoints(totalPoints: number): number {
  for (let level = 1; level < LEVEL_THRESHOLDS.length; level++) {
    if (totalPoints < LEVEL_THRESHOLDS[level]) return level
  }
  const lastThreshold = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
  return (
    LEVEL_THRESHOLDS.length +
    Math.floor((totalPoints - lastThreshold) / LEVEL_STEP)
  )
}

/** Total points at which `level` begins. */
function levelStart(level: number): number {
  if (level < LEVEL_THRESHOLDS.length) return LEVEL_THRESHOLDS[level - 1]
  const lastThreshold = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
  return lastThreshold + (level - LEVEL_THRESHOLDS.length) * LEVEL_STEP
}

export function pointsToNextLevel(totalPoints: number): number {
  return levelStart(levelForPoints(totalPoints) + 1) - totalPoints
}

/**
 * How many points the given level spans. The profile progress bar needs the
 * width of the band the user is currently in, and deriving it here keeps the
 * thresholds in one place.
 */
export function pointsInLevel(level: number): number {
  if (level < 1) return LEVEL_THRESHOLDS[1]
  return levelStart(level + 1) - levelStart(level)
}

// ---------------------------------------------------------------------------
// Running averages
// ---------------------------------------------------------------------------

export interface ComponentAverages {
  observation: number
  feeling: number
  need: number
  request: number
  overall: number
}

/**
 * True running average over all scored completions: avg' = (avg*n + x)/(n+1).
 * `sampleCount` is how many completions the previous averages already include.
 */
export function updateAverages(
  previous: ComponentAverages,
  sampleCount: number,
  attempt: { observation: number; feeling: number; need: number; request: number },
  finalScore: number,
): ComponentAverages {
  const fold = (avg: number, x: number) =>
    (avg * sampleCount + x) / (sampleCount + 1)
  return {
    observation: fold(previous.observation, attempt.observation),
    feeling: fold(previous.feeling, attempt.feeling),
    need: fold(previous.need, attempt.need),
    request: fold(previous.request, attempt.request),
    overall: fold(previous.overall, finalScore),
  }
}

// ---------------------------------------------------------------------------
// Achievements
// ---------------------------------------------------------------------------

export interface AchievementSnapshot {
  scenariosCompleted: number
  scenariosPassed: number
  scenariosMastered: number
  totalStars: number
  currentStreak: number
  finalScore: number
  empathyShown: boolean
}

export interface AchievementDefinition {
  id: string
  title: string
  description: string
  earned: (s: AchievementSnapshot) => boolean
}

/**
 * Achievement catalog. Achievements are awarded server-side the moment their
 * condition first holds and stored by id on userProgress.achievements.
 */
export const ACHIEVEMENTS: Array<AchievementDefinition> = [
  {
    id: 'first-conversation',
    title: 'First Conversation',
    description: 'You completed your first practice conversation.',
    earned: (s) => s.scenariosCompleted >= 1,
  },
  {
    id: 'first-pass',
    title: 'Finding Your Voice',
    description: 'You guided a conversation to a good place.',
    earned: (s) => s.scenariosPassed >= 1,
  },
  {
    id: 'first-mastery',
    title: 'Fluent Giraffe',
    description: 'You mastered a scenario with a score of 85 or higher.',
    earned: (s) => s.scenariosMastered >= 1,
  },
  {
    id: 'five-completed',
    title: 'Regular Practice',
    description: 'You completed five different scenarios.',
    earned: (s) => s.scenariosCompleted >= 5,
  },
  {
    id: 'heard-them',
    title: 'You Heard Them',
    description: "You tuned into the other person's feelings and needs.",
    earned: (s) => s.empathyShown,
  },
  {
    id: 'streak-3',
    title: 'Three Days Running',
    description: 'You practiced three days in a row.',
    earned: (s) => s.currentStreak >= 3,
  },
  {
    id: 'streak-7',
    title: 'A Weekly Rhythm',
    description: 'You practiced seven days in a row.',
    earned: (s) => s.currentStreak >= 7,
  },
  {
    id: 'stars-10',
    title: 'Ten Stars',
    description: 'You collected ten stars across your scenarios.',
    earned: (s) => s.totalStars >= 10,
  },
  {
    id: 'stars-25',
    title: 'Star Collector',
    description: 'You collected twenty-five stars.',
    earned: (s) => s.totalStars >= 25,
  },
  {
    id: 'perfect-connection',
    title: 'Perfect Connection',
    description: 'You finished a conversation with a perfect score.',
    earned: (s) => s.finalScore === 100,
  },
]

export function newlyEarnedAchievements(
  snapshot: AchievementSnapshot,
  alreadyEarned: Array<string>,
): Array<AchievementDefinition> {
  const earned = new Set(alreadyEarned)
  return ACHIEVEMENTS.filter((a) => !earned.has(a.id) && a.earned(snapshot))
}

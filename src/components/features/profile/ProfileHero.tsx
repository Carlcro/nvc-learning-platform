import type { UserStats } from './types'

interface ProfileHeroProps {
  stats: UserStats
}

/**
 * The profile's focal band: the guide speaking to the learner. Identity (level
 * + title), an encouraging line in the mentor's voice, the level-progress bar,
 * and a quiet row of supporting stats — all in one warm panel, so the page
 * opens with a person's growth rather than a grid of boxes.
 */
export function ProfileHero({ stats }: ProfileHeroProps) {
  const range = levelRange(stats.level)
  const currentLevelProgress = Math.max(0, range - stats.pointsToNextLevel)
  const percentage = Math.min(100, Math.round((currentLevelProgress / range) * 100))

  return (
    <div className="rounded-lg border-2 border-giraffe-100 bg-white shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center gap-6 p-6 sm:p-8">
        {/* Guide */}
        <div className="shrink-0 mx-auto md:mx-0">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-giraffe-50 border-2 border-giraffe-100 flex items-center justify-center">
            <img
              src="/giraff.png"
              alt=""
              aria-hidden="true"
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
            />
          </div>
        </div>

        {/* Identity + progress */}
        <div className="flex-1 text-center md:text-left">
          <div className="text-sm font-semibold text-giraffe-700">
            Level {stats.level}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-brown-800 text-balance">
            {getLevelTitle(stats.level)}
          </h1>
          <p className="text-brown-700 mt-1 text-pretty">
            {getMentorLine(stats.averageScores.overall, stats.scenariosCompleted)}
          </p>

          {/* Level progress */}
          <div className="mt-5 max-w-md mx-auto md:mx-0">
            <div className="flex justify-between text-sm text-brown-700 mb-2">
              <span className="font-medium">
                Progress to level {stats.level + 1}
              </span>
              <span className="font-semibold">
                {stats.pointsToNextLevel} pts to go
              </span>
            </div>
            <div
              className="h-3 bg-giraffe-100 rounded-full overflow-hidden border border-giraffe-200"
              role="progressbar"
              aria-valuenow={percentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progress to level ${stats.level + 1}`}
            >
              <div
                className="h-full bg-giraffe-400 rounded-full transition-[width] duration-700 ease-out motion-reduce:transition-none"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Supporting stats */}
      <dl className="bg-giraffe-50 border-t border-giraffe-100 px-6 sm:px-8 py-4 flex flex-wrap justify-center md:justify-start gap-x-10 gap-y-3">
        <Stat value={stats.currentStreak} label="day streak" />
        <Stat value={stats.longestStreak} label="best streak" />
        <Stat value={stats.totalPoints} label="total points" />
      </dl>
    </div>
  )
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <dd className="text-xl font-bold text-brown-800">{value}</dd>
      <dt className="text-sm text-brown-600">{label}</dt>
    </div>
  )
}

function levelRange(level: number): number {
  if (level === 1) return 300
  if (level === 2) return 400
  if (level === 3) return 500
  if (level === 4) return 600
  if (level === 5) return 700
  return 800
}

function getLevelTitle(level: number): string {
  if (level === 1) return 'Aspiring Giraffe'
  if (level === 2) return 'Empathetic Listener'
  if (level === 3) return 'Compassionate Communicator'
  if (level === 4) return 'Connection Builder'
  if (level === 5) return 'Harmony Weaver'
  return 'NVC Master'
}

/**
 * A gentle, growth-framed line from the guide. Always names something positive;
 * never a verdict. Tuned to where the learner is on their journey.
 */
function getMentorLine(overall: number, completed: number): string {
  if (completed === 0) {
    return 'Welcome. Every conversation you practice is a step toward connection.'
  }
  if (overall >= 90) return 'Your words are landing with real compassion.'
  if (overall >= 70) return "You're growing beautifully — keep going."
  if (overall >= 50) {
    return "You're finding your giraffe voice, one conversation at a time."
  }
  return "You're showing up for this, and that's what matters most."
}

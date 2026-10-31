import { Link } from '@tanstack/react-router'
import { PRIMARY_LINK } from './linkStyles'
import type { UserStats } from './types'

interface ProfileHeroProps {
  stats: UserStats
}

/**
 * The profile's header band: the guide speaking to the learner. A plain
 * heading, an encouraging line in the mentor's voice, one quiet line about
 * level and streak, and the page's single primary action.
 */
export function ProfileHero({ stats }: ProfileHeroProps) {
  return (
    <section className="bg-giraffe-100 px-4 sm:px-6 lg:px-8 pt-28 pb-10 md:pb-12">
      <div className="max-w-3xl mx-auto flex items-start gap-6 sm:gap-10">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brown-800 text-balance tracking-tight">
            Your practice so far
          </h1>
          <p className="mt-4 text-lg text-brown-700 max-w-prose text-pretty">
            {getMentorLine(
              stats.averageScores.overall,
              stats.scenariosCompleted,
            )}
          </p>
          <p className="mt-5 text-sm font-semibold text-brown-800 text-pretty">
            {getStatLine(stats)}
          </p>
          <div className="mt-6">
            <Link to="/practice" className={PRIMARY_LINK}>
              {stats.scenariosCompleted === 0
                ? 'Start practicing'
                : 'Continue practicing'}
            </Link>
          </div>
        </div>
        <img
          src="/giraff.png"
          alt=""
          aria-hidden="true"
          className="hidden sm:block w-28 md:w-36 h-auto shrink-0 object-contain"
        />
      </div>
    </section>
  )
}

/**
 * Level and points in words, plus the current streak when there is one.
 * One line, so the header never turns into a row of numbers.
 */
function getStatLine(stats: UserStats): string {
  const points = stats.totalPoints === 1 ? 'point' : 'points'
  let line = `Level ${stats.level}, with ${stats.totalPoints} ${points}`
  if (stats.pointsToNextLevel > 0) {
    line += ` and ${stats.pointsToNextLevel} more to reach level ${stats.level + 1}`
  }
  line += '.'
  if (stats.currentStreak > 1) {
    line += ` You have practiced ${stats.currentStreak} days in a row.`
  } else if (stats.currentStreak === 1) {
    line += ' Your practice streak has begun.'
  }
  return line
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
  if (overall >= 70) return 'You are growing steadily. Keep going.'
  if (overall >= 50) {
    return 'You are finding your giraffe voice, one conversation at a time.'
  }
  return 'You are showing up for this, and that is what matters most.'
}

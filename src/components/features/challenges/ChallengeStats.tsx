import { Link } from '@tanstack/react-router'
import { QUIET_LINK_CLASS } from './challengeDisplay'

interface ChallengeStatsProps {
  completedCount: number
  longestStreak: number
}

/**
 * A short, warm note about the daily challenges so far. A sentence or two
 * rather than a scoreboard: it counts what was done, never how well.
 */
export function ChallengeStats({
  completedCount,
  longestStreak,
}: ChallengeStatsProps) {
  const finished =
    completedCount === 0
      ? 'The daily challenges you finish will gather on your profile.'
      : completedCount === 1
        ? 'You have finished one daily challenge so far.'
        : `You have finished ${completedCount} daily challenges so far.`

  const run =
    longestStreak > 1
      ? ` Your longest run of practice days is ${longestStreak}.`
      : ''

  return (
    <section
      aria-labelledby="challenge-history-heading"
      className="border-t-2 border-giraffe-100 pt-8"
    >
      <h2
        id="challenge-history-heading"
        className="text-lg font-bold text-brown-800"
      >
        Your practice so far
      </h2>
      <p className="mt-2 max-w-prose text-brown-700 text-pretty">
        {finished}
        {run}{' '}
        <Link to="/profile" className={QUIET_LINK_CLASS}>
          See your profile
        </Link>
      </p>
    </section>
  )
}

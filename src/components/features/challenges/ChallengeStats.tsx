import { Link } from '@tanstack/react-router'
import { QUIET_LINK_CLASS } from './challengeDisplay'
import { useT } from '~/i18n/useT'

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
  const t = useT()
  const finished = t.challenges.stats.finished(completedCount)
  const run =
    longestStreak > 1 ? t.challenges.stats.longestRun(longestStreak) : ''

  return (
    <section
      aria-labelledby="challenge-history-heading"
      className="border-t-2 border-giraffe-100 pt-8"
    >
      <h2
        id="challenge-history-heading"
        className="text-lg font-bold text-brown-800"
      >
        {t.challenges.stats.title}
      </h2>
      <p className="mt-2 max-w-prose text-brown-700 text-pretty">
        {finished}
        {run}{' '}
        <Link to="/profile" className={QUIET_LINK_CLASS}>
          {t.challenges.stats.seeProfile}
        </Link>
      </p>
    </section>
  )
}

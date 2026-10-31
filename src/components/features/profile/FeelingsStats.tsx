import { Link } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from 'convex/_generated/api'
import { TEXT_LINK } from './linkStyles'
import { useT } from '~/i18n/useT'

/**
 * The feelings work, on the profile.
 *
 * Vocabulary practice used to live entirely in its own record, so someone could
 * check in every day for a month and see nothing for it here. This short
 * section names that half of the practice in a sentence, counts only.
 */
export function FeelingsStats() {
  const t = useT()
  const stats = useQuery(api.feelingsProgress.getStats)

  // undefined while loading, null when signed out. Neither has anything to say.
  if (!stats) return null

  const hasStarted =
    stats.totalCheckIns > 0 ||
    stats.totalFeelingsExplored > 0 ||
    stats.quizScore > 0

  return (
    <section aria-labelledby="feelings-heading">
      <h2
        id="feelings-heading"
        className="text-xl font-bold text-brown-800 text-balance"
      >
        {t.profile.feelings.title}
      </h2>
      <p className="mt-3 text-brown-700 max-w-prose text-pretty">
        {hasStarted
          ? t.profile.feelings.summary(stats)
          : t.profile.feelings.none}
      </p>
      <p className="mt-4">
        <Link to="/feelings" className={TEXT_LINK}>
          {hasStarted
            ? t.profile.feelings.keepExploring
            : t.profile.feelings.openLibrary}
        </Link>
      </p>
    </section>
  )
}

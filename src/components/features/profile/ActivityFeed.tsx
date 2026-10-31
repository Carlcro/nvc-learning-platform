import { Link } from '@tanstack/react-router'
import { TEXT_LINK } from './linkStyles'
import { useT } from '~/i18n/useT'

interface ActivityFeedProps {
  completedScenarios: number
  threeStarScenarios: number
  totalStars: number
}

/**
 * The conversations so far, in one sentence, with a quiet invitation to
 * rehearse something from the person's own life next.
 */
export function ActivityFeed({
  completedScenarios,
  threeStarScenarios,
  totalStars,
}: ActivityFeedProps) {
  const t = useT()

  return (
    <section aria-labelledby="conversations-heading">
      <h2
        id="conversations-heading"
        className="text-xl font-bold text-brown-800 text-balance"
      >
        {t.profile.conversations.title}
      </h2>
      <p className="mt-3 text-brown-700 max-w-prose text-pretty">
        {completedScenarios === 0
          ? t.profile.conversations.none
          : t.profile.conversations.summary({
              completed: completedScenarios,
              threeStars: threeStarScenarios,
              stars: totalStars,
            })}
      </p>
      <p className="mt-4">
        <Link to="/practice/create" className={TEXT_LINK}>
          {t.profile.conversations.createLink}
        </Link>
      </p>
    </section>
  )
}

import { Link } from '@tanstack/react-router'
import { summarizeGrowth } from './growth'
import { SkillStats } from './SkillStats'
import { TEXT_LINK } from './linkStyles'
import type { UserStats } from './types'
import { skillResource } from '~/lib/conversationInsights'
import { useT } from '~/i18n/useT'

interface GrowthSummaryProps {
  stats: UserStats
}

/**
 * The heart of the profile, led by a sentence rather than a number: which
 * piece of the arc comes most naturally lately, and which one to explore
 * next. The four bars sit underneath as supporting detail.
 */
export function GrowthSummary({ stats }: GrowthSummaryProps) {
  const t = useT()
  const names = t.common.components
  const { strongest, focus, focusUntried } = summarizeGrowth(
    stats.averageScores,
  )

  if (stats.scenariosCompleted === 0 || strongest === null) {
    return (
      <section aria-labelledby="growth-heading">
        <h2
          id="growth-heading"
          className="text-xl font-bold text-brown-800 text-balance"
        >
          {t.profile.growth.title}
        </h2>
        <p className="mt-3 text-brown-700 max-w-prose text-pretty">
          {t.profile.growth.empty}
        </p>
        <p className="mt-4">
          <Link to="/learn/observation" className={TEXT_LINK}>
            {t.profile.growth.emptyLink}
          </Link>
        </p>
      </section>
    )
  }

  const focusResource = focus ? skillResource(focus, t.results.skills) : null
  const focusCopy = focus ? t.profile.growth.focus[focus] : null

  return (
    <section aria-labelledby="growth-heading">
      <h2
        id="growth-heading"
        className="text-xl font-bold text-brown-800 text-balance"
      >
        {t.profile.growth.title}
      </h2>
      <p className="mt-3 text-lg text-brown-800 max-w-prose text-pretty">
        {t.profile.growth.strongest(names[strongest])}
        {focus
          ? t.profile.growth.nextToExplore(names[focus])
          : t.profile.growth.allLanding}
      </p>
      {focusResource && focusCopy && (
        <p className="mt-2 text-brown-700 max-w-prose text-pretty">
          {focusUntried ? focusCopy.untried : ''}
          {focusResource.nudge}
        </p>
      )}
      {focusResource && focusCopy && (
        <p className="mt-4">
          <Link to={focusResource.to} className={TEXT_LINK}>
            {focusCopy.visit}
          </Link>
        </p>
      )}

      <div className="mt-8">
        <SkillStats averages={stats.averageScores} />
      </div>
    </section>
  )
}

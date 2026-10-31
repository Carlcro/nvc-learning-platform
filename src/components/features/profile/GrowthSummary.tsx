import { Link } from '@tanstack/react-router'
import { COMPONENT_NAMES, summarizeGrowth } from './growth'
import { SkillStats } from './SkillStats'
import { TEXT_LINK } from './linkStyles'
import type { UserStats } from './types'
import { SKILL_RESOURCES } from '~/lib/conversationInsights'

interface GrowthSummaryProps {
  stats: UserStats
}

/**
 * The heart of the profile, led by a sentence rather than a number: which
 * piece of the arc comes most naturally lately, and which one to explore
 * next. The four bars sit underneath as supporting detail.
 */
export function GrowthSummary({ stats }: GrowthSummaryProps) {
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
          The four pieces
        </h2>
        <p className="mt-3 text-brown-700 max-w-prose text-pretty">
          Observation, feeling, need and request. Once you finish a first
          conversation, this is where you will see which of them comes
          naturally to you and which one to explore next.
        </p>
        <p className="mt-4">
          <Link to="/learn/observation" className={TEXT_LINK}>
            Start with the observations lesson
          </Link>
        </p>
      </section>
    )
  }

  const focusResource = focus ? SKILL_RESOURCES[focus] : null

  return (
    <section aria-labelledby="growth-heading">
      <h2
        id="growth-heading"
        className="text-xl font-bold text-brown-800 text-balance"
      >
        The four pieces
      </h2>
      <p className="mt-3 text-lg text-brown-800 max-w-prose text-pretty">
        Lately your strongest piece is {COMPONENT_NAMES[strongest]}.
        {focus
          ? ` Next to explore: ${COMPONENT_NAMES[focus]}.`
          : ' All four are landing well in your conversations.'}
      </p>
      {focusResource && (
        <p className="mt-2 text-brown-700 max-w-prose text-pretty">
          {focusUntried
            ? `You have not reached for ${focusResource.plural} in a conversation yet. `
            : ''}
          {focusResource.nudge}
        </p>
      )}
      {focusResource && (
        <p className="mt-4">
          <Link to={focusResource.to} className={TEXT_LINK}>
            Visit the {focusResource.label.toLowerCase()}
          </Link>
        </p>
      )}

      <div className="mt-8">
        <SkillStats averages={stats.averageScores} />
      </div>
    </section>
  )
}

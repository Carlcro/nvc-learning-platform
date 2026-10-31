import { Link } from '@tanstack/react-router'
import { PRIMARY_LINK } from './linkStyles'
import type { UserStats } from './types'
import type { Messages } from '~/i18n/messages'
import { useT } from '~/i18n/useT'

interface ProfileHeroProps {
  stats: UserStats
}

/**
 * The profile's header band: the guide speaking to the learner. A plain
 * heading, an encouraging line in the mentor's voice, one quiet line about
 * level and streak, and the page's single primary action.
 */
export function ProfileHero({ stats }: ProfileHeroProps) {
  const t = useT()

  return (
    <section className="bg-giraffe-100 px-4 sm:px-6 lg:px-8 pt-28 pb-10 md:pb-12">
      <div className="max-w-3xl mx-auto flex items-start gap-6 sm:gap-10">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brown-800 text-balance tracking-tight">
            {t.profile.hero.title}
          </h1>
          <p className="mt-4 text-lg text-brown-700 max-w-prose text-pretty">
            {
              t.profile.hero.mentor[
                getMentorLine(
                  stats.averageScores.overall,
                  stats.scenariosCompleted,
                )
              ]
            }
          </p>
          <p className="mt-5 text-sm font-semibold text-brown-800 text-pretty">
            {t.profile.hero.statLine(stats)}
          </p>
          <div className="mt-6">
            <Link to="/practice" className={PRIMARY_LINK}>
              {stats.scenariosCompleted === 0
                ? t.profile.hero.startPracticing
                : t.profile.hero.continuePracticing}
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
 * A gentle, growth-framed line from the guide. Always names something positive;
 * never a verdict. Tuned to where the learner is on their journey.
 */
function getMentorLine(
  overall: number,
  completed: number,
): keyof Messages['profile']['hero']['mentor'] {
  if (completed === 0) return 'welcome'
  if (overall >= 90) return 'compassion'
  if (overall >= 70) return 'steady'
  if (overall >= 50) return 'finding'
  return 'showingUp'
}

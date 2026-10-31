import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { CheckIcon } from '~/components/ui/Icons'

interface Achievement {
  id: string
  title: string
  description: string
  earned: boolean
}

/**
 * Every achievement in the catalog, as two calm lists: the ones earned so far
 * (with a check) and the ones still ahead (an empty ring, no check). The
 * ones ahead stay readable, so there is always a next thing to look forward
 * to without any pressure.
 */
export function AchievementsGrid() {
  const achievements = useQuery(api.userProgress.getMyAchievements)

  if (!achievements) return null

  const earned = achievements.filter((a) => a.earned)
  const ahead = achievements.filter((a) => !a.earned)

  return (
    <section aria-labelledby="achievements-heading">
      <h2
        id="achievements-heading"
        className="text-xl font-bold text-brown-800 text-balance"
      >
        Achievements
      </h2>
      <p className="mt-3 text-brown-700 max-w-prose text-pretty">
        {earned.length === 0
          ? 'Your first one arrives with your first finished conversation.'
          : `${earned.length} of ${achievements.length} so far.`}
      </p>

      <div className="mt-6 space-y-8">
        {earned.length > 0 && (
          <AchievementList title="Earned" items={earned} />
        )}
        {ahead.length > 0 && (
          <AchievementList title="Still ahead" items={ahead} />
        )}
      </div>
    </section>
  )
}

function AchievementList({
  title,
  items,
}: {
  title: string
  items: ReadonlyArray<Achievement>
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-brown-800">{title}</h3>
      <ul className="mt-3 grid sm:grid-cols-2 gap-x-10 gap-y-4">
        {items.map((achievement) => (
          <li key={achievement.id} className="flex items-start gap-3">
            {achievement.earned ? (
              <span
                className="mt-0.5 grid place-items-center w-5 h-5 rounded-full shrink-0 bg-giraffe-400 text-brown-800"
                aria-hidden="true"
              >
                <CheckIcon className="w-3 h-3" />
              </span>
            ) : (
              <span
                className="mt-0.5 w-5 h-5 rounded-full shrink-0 border-2 border-brown-200"
                aria-hidden="true"
              />
            )}
            <div className="min-w-0">
              <p className="font-semibold text-brown-800 text-sm">
                {achievement.title}
                {!achievement.earned && (
                  <span className="sr-only">, not yet earned</span>
                )}
              </p>
              <p className="text-sm text-brown-600 mt-0.5 text-pretty">
                {achievement.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { CheckIcon } from '~/components/ui/Icons'

/**
 * Every achievement in the catalog, with the ones this user has earned lit
 * up. Unearned ones stay visible but quiet, so there is always a next thing
 * to look forward to without any pressure.
 */
export function AchievementsGrid() {
  const achievements = useQuery(api.userProgress.getMyAchievements)

  if (!achievements) return null

  const earnedCount = achievements.filter((a) => a.earned).length

  return (
    <div className="bg-white rounded-lg border-2 border-giraffe-100 p-6">
      <div className="flex items-baseline justify-between gap-3 mb-4">
        <h2 className="text-lg font-bold text-brown-800">Achievements</h2>
        <span className="text-sm font-semibold text-brown-600">
          {earnedCount} of {achievements.length}
        </span>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {achievements.map((achievement) => (
          <li
            key={achievement.id}
            className={`rounded-lg border p-4 flex items-start gap-3 ${
              achievement.earned
                ? 'bg-giraffe-50 border-giraffe-200'
                : 'bg-white border-giraffe-100 opacity-60'
            }`}
          >
            <span
              className={`mt-0.5 grid place-items-center w-6 h-6 rounded-full shrink-0 ${
                achievement.earned
                  ? 'bg-giraffe-400 text-brown-800'
                  : 'bg-giraffe-100 text-brown-400'
              }`}
              aria-hidden="true"
            >
              <CheckIcon className="w-3.5 h-3.5" />
            </span>
            <div>
              <div className="font-semibold text-brown-800 text-sm">
                {achievement.title}
              </div>
              <p className="text-xs text-brown-600 mt-0.5 leading-relaxed">
                {achievement.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

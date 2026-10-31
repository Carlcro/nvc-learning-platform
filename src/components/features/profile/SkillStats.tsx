import { COMPONENT_NAMES, growthWord } from './growth'
import type { UserStats } from './types'
import { NVC_COMPONENTS } from '~/lib/conversationInsights'

interface SkillStatsProps {
  averages: UserStats['averageScores']
}

/**
 * The four pieces as quiet bars with a word each. One neutral colour for
 * every bar: the length shows movement, the word names it, and nothing is
 * marked as a failure.
 */
export function SkillStats({ averages }: SkillStatsProps) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
      {NVC_COMPONENTS.map((component) => {
        const average = Math.max(0, Math.min(25, averages[component]))
        const word = growthWord(average)
        const name = COMPONENT_NAMES[component]
        return (
          <li key={component}>
            <div className="flex items-baseline justify-between gap-3 text-sm mb-2">
              <span className="font-semibold text-brown-800">{name}</span>
              <span className="text-brown-600">{word}</span>
            </div>
            <div
              className="h-2 bg-giraffe-100 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={Math.round(average)}
              aria-valuemin={0}
              aria-valuemax={25}
              aria-valuetext={word}
              aria-label={name}
            >
              <div
                className="h-full bg-giraffe-400 rounded-full transition-[width] duration-700 ease-out motion-reduce:transition-none"
                style={{ width: `${(average / 25) * 100}%` }}
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}

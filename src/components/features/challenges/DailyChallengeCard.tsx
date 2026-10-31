import { Link } from '@tanstack/react-router'
import {
  PRIMARY_LINK_CLASS,
  QUIET_LINK_CLASS,
  challengeDifficultyLabel,
  practiceAreasPhrase,
  useNextChallengeTime,
} from './challengeDisplay'
import type { ChallengeDifficulty } from './challengeDisplay'
import { Card } from '~/components/ui/Card'

interface DailyChallengeCardProps {
  /** Undefined while the scenario is still loading. */
  title?: string
  description: string
  difficulty: ChallengeDifficulty
  /** Undefined while the scenario is still loading. */
  characterName?: string
  learningObjectives?: Array<string>
  completed?: boolean
  bonusPoints: number
  scenarioId: string
  challengeId: string
}

/**
 * Today's challenge on the calm anatomy of a scenario card: who, what, one
 * quiet line about the bonus and the reset, and a single gold action.
 */
export function DailyChallengeCard({
  title,
  description,
  difficulty,
  characterName,
  learningObjectives = [],
  completed = false,
  bonusPoints,
  scenarioId,
  challengeId,
}: DailyChallengeCardProps) {
  const nextTime = useNextChallengeTime()
  const isLoadingScenario = title === undefined

  return (
    <Card className="p-6 sm:p-8">
      <p className="text-sm text-brown-600">
        {challengeDifficultyLabel(difficulty)}
      </p>

      {isLoadingScenario ? (
        <div aria-hidden="true" className="mt-2 space-y-2">
          <div className="h-7 w-2/3 rounded bg-giraffe-50" />
          <div className="h-5 w-1/3 rounded bg-giraffe-50" />
        </div>
      ) : (
        <>
          <h3 className="mt-1 text-2xl font-bold text-brown-800 text-balance break-words">
            {title}
          </h3>
          {characterName && (
            <p className="mt-1 text-sm font-semibold text-brown-700 break-words">
              with {characterName}
            </p>
          )}
        </>
      )}

      <p className="mt-4 max-w-prose text-brown-700 leading-relaxed text-pretty break-words">
        {description}
      </p>

      {learningObjectives.length > 0 && (
        <p className="mt-3 text-sm text-brown-700">
          A good one for practicing {practiceAreasPhrase(learningObjectives)}.
        </p>
      )}

      {completed ? (
        <div className="mt-6 space-y-3">
          <p className="text-brown-800 font-semibold">
            You finished today's challenge.
          </p>
          <p className="text-sm text-brown-700">
            You are welcome to go through it again
            {nextTime ? `, and a new one arrives at ${nextTime}.` : '.'}{' '}
            <Link
              to="/practice/$scenarioId/brief"
              params={{ scenarioId }}
              search={{ dailyChallengeId: challengeId }}
              className={QUIET_LINK_CLASS}
            >
              Try it again
              {title && <span className="sr-only">: {title}</span>}
            </Link>
          </p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-brown-600">
            Worth {bonusPoints} bonus points
            {nextTime ? `. New challenge at ${nextTime}.` : '.'}
          </p>
          <Link
            to="/practice/$scenarioId/brief"
            params={{ scenarioId }}
            search={{ dailyChallengeId: challengeId }}
            className={`${PRIMARY_LINK_CLASS} w-full sm:w-auto`}
          >
            Start this conversation
          </Link>
        </div>
      )}
    </Card>
  )
}

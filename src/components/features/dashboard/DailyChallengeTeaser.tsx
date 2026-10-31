import { useQuery } from 'convex/react'
import { Link } from '@tanstack/react-router'
import { api } from '../../../../convex/_generated/api'
import { Card } from '~/components/ui/Card'
import {
  PRIMARY_LINK_CLASS,
  QUIET_LINK_CLASS,
  challengeDifficultyLabel,
  useNextChallengeTime,
} from '~/components/features/challenges/challengeDisplay'

/**
 * Today's challenge as one calm block on the landing page: a heading, the
 * situation, one quiet line of detail and one action. Works signed out too;
 * the action then leads into sign-in.
 */
export function DailyChallengeTeaser() {
  const challenge = useQuery(api.dailyChallenges.getDailyChallenge)
  const nextTime = useNextChallengeTime()

  if (challenge === undefined) {
    // Holds the block's space without announcing a wait.
    return (
      <Card className="p-6 sm:p-8" aria-busy="true">
        <h2 className="text-2xl font-bold text-brown-800 text-balance">
          Today's practice
        </h2>
        <div aria-hidden="true" className="mt-4 space-y-2">
          <div className="h-5 w-full rounded bg-giraffe-50" />
          <div className="h-5 w-4/5 rounded bg-giraffe-50" />
        </div>
      </Card>
    )
  }

  if (challenge === null) {
    return (
      <Card className="p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-brown-800 text-balance">
          Today's practice
        </h2>
        <p className="mt-3 max-w-prose text-brown-700 text-pretty">
          Today's situation is still on its way. In the meantime, every
          practice scenario is open to you.
        </p>
        <Link to="/practice" className={`${QUIET_LINK_CLASS} mt-4 inline-block`}>
          Browse practice scenarios
        </Link>
      </Card>
    )
  }

  const difficulty = challengeDifficultyLabel(challenge.difficulty)

  return (
    <Card className="p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-brown-800 text-balance">
        Today's practice
      </h2>
      <p className="mt-3 max-w-prose text-lg text-brown-700 leading-relaxed text-pretty break-words">
        {challenge.description}
      </p>

      {challenge.completed ? (
        <p className="mt-6 text-brown-700">
          <span className="font-semibold text-brown-800">
            You finished today's challenge.
          </span>
          {nextTime && ` A new one arrives at ${nextTime}.`}{' '}
          <Link to="/challenges/daily" className={QUIET_LINK_CLASS}>
            See today's challenges
          </Link>
        </p>
      ) : (
        <div className="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-brown-600">
            {difficulty}, worth {challenge.bonusPoints} bonus points
            {nextTime ? `. New challenge at ${nextTime}.` : '.'}
          </p>
          <Link
            to="/practice/$scenarioId/brief"
            params={{ scenarioId: challenge.scenarioId }}
            search={{ dailyChallengeId: challenge._id }}
            className={`${PRIMARY_LINK_CLASS} w-full sm:w-auto`}
          >
            Start today's practice
          </Link>
        </div>
      )}
    </Card>
  )
}

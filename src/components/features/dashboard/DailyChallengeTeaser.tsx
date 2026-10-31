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
import { useLocale, useT } from '~/i18n/useT'

/**
 * Today's challenge as one calm block on the landing page: a heading, the
 * situation, one quiet line of detail and one action. Works signed out too;
 * the action then leads into sign-in.
 */
export function DailyChallengeTeaser() {
  const t = useT()
  const teaser = t.home.dailyTeaser
  const locale = useLocale()
  const challenge = useQuery(api.dailyChallenges.getDailyChallenge, { locale })
  const nextTime = useNextChallengeTime()

  if (challenge === undefined) {
    // Holds the block's space without announcing a wait.
    return (
      <Card className="p-6 sm:p-8" aria-busy="true">
        <h2 className="text-2xl font-bold text-brown-800 text-balance">
          {teaser.title}
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
          {teaser.title}
        </h2>
        <p className="mt-3 max-w-prose text-brown-700 text-pretty">
          {teaser.pending}
        </p>
        <Link to="/practice" className={`${QUIET_LINK_CLASS} mt-4 inline-block`}>
          {teaser.browseScenarios}
        </Link>
      </Card>
    )
  }

  const difficulty = challengeDifficultyLabel(
    challenge.difficulty,
    t.challenges.difficulty,
  )

  return (
    <Card className="p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-brown-800 text-balance">
        {teaser.title}
      </h2>
      <p className="mt-3 max-w-prose text-lg text-brown-700 leading-relaxed text-pretty break-words">
        {challenge.description}
      </p>

      {challenge.completed ? (
        <p className="mt-6 text-brown-700">
          <span className="font-semibold text-brown-800">
            {teaser.finished}
          </span>
          {nextTime && ` ${teaser.nextArrives(nextTime)}`}{' '}
          <Link to="/challenges/daily" className={QUIET_LINK_CLASS}>
            {teaser.seeChallenges}
          </Link>
        </p>
      ) : (
        <div className="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-brown-600">
            {teaser.details(difficulty, challenge.bonusPoints, nextTime)}
          </p>
          <Link
            to="/practice/$scenarioId/brief"
            params={{ scenarioId: challenge.scenarioId }}
            search={{ dailyChallengeId: challenge._id }}
            className={`${PRIMARY_LINK_CLASS} w-full sm:w-auto`}
          >
            {teaser.start}
          </Link>
        </div>
      )}
    </Card>
  )
}

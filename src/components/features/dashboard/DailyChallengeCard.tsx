import { useMutation, useQuery } from 'convex/react'
import { Link } from '@tanstack/react-router'
import { api } from '../../../../convex/_generated/api'
import { Card, CardBody } from '~/components/ui/Card'
import { Button } from '~/components/ui/Button'

export function DailyChallengeCard() {
  const challenge = useQuery(api.dailyChallenges.getDailyChallenge)
  const seedChallenge = useMutation(api.dailyChallenges.seedDailyChallenge)

  if (challenge === undefined) {
    return (
      <Card className="animate-pulse h-48">
        <CardBody className="flex items-center justify-center">
          <div className="text-brown-400">Loading daily challenge...</div>
        </CardBody>
      </Card>
    )
  }

  if (challenge === null) {
    return (
      <Card className="bg-linear-to-br from-giraffe-50 to-white border-2 border-giraffe-200">
        <CardBody className="text-center py-8">
          <h3 className="text-xl font-bold text-brown-800 mb-2">
            No Challenge for Today
          </h3>
          <p className="text-brown-600 mb-4">
            Check back tomorrow for a new NVC challenge!
          </p>
          {/* Temporary button for demo/testing */}
          <Button variant="secondary" size="sm" onClick={() => seedChallenge()}>
            Generate Challenge
          </Button>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card
      className={`border-2 transition-colors duration-200 ${
        challenge.completed
          ? 'border-empathy-high/40 bg-empathy-high/10'
          : 'border-giraffe-200 bg-white'
      }`}
    >
      <CardBody className="py-6">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-giraffe-800 bg-giraffe-100 px-2.5 py-1 rounded-full">
              Daily focus
            </span>
            <DifficultyBadge difficulty={challenge.difficulty} />
            {challenge.completed && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-brown-800 bg-empathy-high/20 px-2.5 py-1 rounded-full">
                <span aria-hidden="true">✓</span> Completed
              </span>
            )}
          </div>

          {/* Reward chip — a contained, warm marker, not floating text */}
          <div className="inline-flex items-baseline gap-1 rounded-full bg-giraffe-100 px-3 py-1">
            <span className="text-base font-bold text-giraffe-800 leading-none">
              +{challenge.bonusPoints}
            </span>
            <span className="text-xs font-medium text-giraffe-700 leading-none">
              pts
            </span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-brown-800 mb-2">
          Daily Challenge
        </h3>

        <p className="text-brown-700 mb-6 text-lg leading-relaxed">
          {challenge.description}
        </p>

        <div className="flex flex-wrap gap-3 justify-between items-center">
          <div className="text-sm text-brown-500">Expires at midnight</div>

          {challenge.completed ? (
            <Button
              variant="secondary"
              disabled
              className="opacity-60 cursor-default"
            >
              Challenge complete
            </Button>
          ) : (
            <Link
              to="/practice/$scenarioId/brief"
              params={{ scenarioId: challenge.scenarioId }}
            >
              <Button variant="primary">Start Practice</Button>
            </Link>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

const DIFFICULTY_STYLES: Record<string, string> = {
  easy: 'text-brown-700 bg-empathy-high/15',
  medium: 'text-giraffe-800 bg-giraffe-100',
  hard: 'text-brown-700 bg-brown-100',
}

/**
 * A gentle difficulty marker. Replaces the old emoji prefix with a calm,
 * on-palette pill—warm tints only, never an alarming signal color.
 */
function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const tone = DIFFICULTY_STYLES[difficulty] ?? DIFFICULTY_STYLES.medium
  const label = difficulty.charAt(0).toUpperCase() + difficulty.slice(1)

  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tone}`}
    >
      {label}
    </span>
  )
}

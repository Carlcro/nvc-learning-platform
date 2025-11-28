import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Card, CardBody } from '~/components/ui/Card'
import { Button } from '~/components/ui/Button'
import { Link } from '@tanstack/react-router'

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
      className={`border-2 ${challenge.completed ? 'border-green-400 bg-green-50' : 'border-giraffe-300 bg-white'} relative overflow-hidden transition-all duration-300`}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <img
          src="/giraff.png"
          alt="Giraffe"
          className="w-24 h-24 object-contain"
        />
      </div>

      <CardBody className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-giraffe-600 bg-giraffe-100 px-2 py-0.5 rounded-full">
                Daily Focus
              </span>
              {challenge.completed && (
                <span className="text-xs font-bold uppercase tracking-wider text-green-700 bg-green-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span>✓</span> Completed
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-brown-800">
              {challenge.difficulty === 'easy' && '🌱 '}
              {challenge.difficulty === 'medium' && '🌿 '}
              {challenge.difficulty === 'hard' && '🌳 '}
              Daily Challenge
            </h3>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-giraffe-600">
              +{challenge.bonusPoints}
            </div>
            <div className="text-xs text-brown-500 font-medium uppercase">
              Points
            </div>
          </div>
        </div>

        <p className="text-brown-700 mb-6 text-lg leading-relaxed">
          {challenge.description}
        </p>

        <div className="flex justify-between items-center">
          <div className="text-sm text-brown-500">Expires at midnight</div>

          {challenge.completed ? (
            <Button
              variant="secondary"
              disabled
              className="opacity-50 cursor-default"
            >
              Challenge Complete!
            </Button>
          ) : (
            <Link
              to="/practice/$scenarioId"
              params={{ scenarioId: challenge.scenarioId }}
            >
              <Button
                variant="primary"
                className="shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                Start Practice
              </Button>
            </Link>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

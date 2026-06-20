import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { DailyChallengeCard } from '../../components/features/challenges/DailyChallengeCard'
import { GiraffeLoader } from '../../components/ui/GiraffeLoader'
import { ProtectedRoute } from '../../components/auth/ProtectedRoute'

export const Route = createFileRoute('/challenges/daily')({
  component: DailyChallengePage,
})

function DailyChallengePage() {
  return (
    <ProtectedRoute>
      <DailyChallengeContent />
    </ProtectedRoute>
  )
}

function DailyChallengeContent() {
  const myChallenge = useQuery(api.dailyChallenges.getMyChallenge)
  const getOrCreateProgress = useMutation(api.userProgress.getOrCreate)

  // Ensure userProgress exists
  useEffect(() => {
    if (myChallenge === null) {
      // User is authenticated but has no progress - initialize it
      getOrCreateProgress().catch(console.error)
    }
  }, [myChallenge, getOrCreateProgress])

  // Always call the hook, but skip if no scenarioId
  const scenario = useQuery(
    api.scenarios.getById,
    myChallenge?.scenarioId ? { scenarioId: myChallenge.scenarioId } : 'skip',
  )

  // Handle loading state
  if (myChallenge === undefined) {
    return <GiraffeLoader message="Finding today's challenge for you…" />
  }

  // No challenge generated yet (user is authenticated but no daily challenge exists)
  if (myChallenge === null) {
    return (
      <main className="min-h-screen bg-linear-to-b from-giraffe-50 to-cream pt-24">
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto px-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-brown-800 mb-6">
              Daily{' '}
              <span className="text-giraffe-700">
                Challenge
              </span>
            </h1>
          </div>
        </section>
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg border-2 border-giraffe-100 p-8 text-center">
            <h2 className="text-xl font-bold text-brown-800 mb-3">
              No Challenge Available
            </h2>
            <p className="text-brown-700 mb-4">
              Daily challenges are generated automatically. Check back soon!
            </p>
            <p className="text-sm text-brown-600 mb-6">
              In the meantime, you can explore other practice scenarios.
            </p>
            <Link
              to="/practice"
              className="px-6 py-3 bg-giraffe-400 text-brown-800 hover:bg-giraffe-500 font-bold rounded-full transition-colors shadow-sm inline-block"
            >
              Browse Practice Scenarios
            </Link>
          </div>
        </section>
      </main>
    )
  }

  // Get title from scenario or use a default
  const title = scenario?.title || 'Daily Challenge'
  const learningObjectives = scenario?.learningObjectives || [
    'observation',
    'feeling',
  ]
  const characterName = scenario?.characterName || 'Character'

  return (
    <main className="min-h-screen bg-linear-to-b from-giraffe-50 to-cream pt-24">
      {/* Header */}
      <section className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Title and Description */}
            <div className="text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl font-bold text-brown-800 mb-6 text-balance tracking-tight">
                Daily <span className="text-giraffe-700">Challenge</span>
              </h1>
              <p className="text-lg text-brown-700 leading-relaxed">
                Complete today's challenge to earn 2x points and maintain your
                streak!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Challenge Card */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div>
          <h2 className="text-sm font-semibold text-brown-800 mb-3">
            Recommended for You
          </h2>
          <p className="text-sm text-brown-600 mb-4">
            Based on your level ({myChallenge.userLevel}), we recommend the{' '}
            <span className="font-semibold">
              {myChallenge.recommendedDifficulty === 'easy'
                ? 'Beginner'
                : myChallenge.recommendedDifficulty === 'medium'
                  ? 'Intermediate'
                  : 'Advanced'}
            </span>{' '}
            challenge.
          </p>
          <DailyChallengeCard
            title={title}
            description={myChallenge.description}
            difficulty={myChallenge.difficulty}
            characterName={characterName}
            learningObjectives={learningObjectives}
            completed={myChallenge.completed}
            scenarioId={myChallenge.scenarioId}
            challengeId={myChallenge._id}
          />
        </div>
      </section>
    </main>
  )
}

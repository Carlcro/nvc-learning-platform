import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { DailyChallengeCard } from '../../components/features/challenges/DailyChallengeCard'
import { ChallengeStats } from '../../components/features/challenges/ChallengeStats'

export const Route = createFileRoute('/challenges/daily')({
  component: DailyChallengePage,
})

function DailyChallengePage() {
  const router = useRouter()
  const myChallenge = useQuery(api.dailyChallenges.getMyChallenge)
  const stats = useQuery(api.dailyChallenges.getUserChallengeStats)

  // Only fetch scenario if we have a scenarioId
  let scenario = undefined
  if (myChallenge?.scenarioId) {
    scenario = useQuery(api.scenarios.getById, {
      scenarioId: myChallenge.scenarioId,
    })
  }

  // Handle loading state
  if (myChallenge === undefined || stats === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-giraffe-50 to-white p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-giraffe-600 mb-4" />
            <p className="text-slate-600 font-medium">
              Loading your daily challenge...
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (myChallenge === null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-giraffe-50 to-white p-6 md:p-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-brown-900 mb-4">
            Daily Challenges
          </h1>
          <p className="text-lg text-slate-600 mb-6">
            Sign in to access daily challenges and track your progress.
          </p>
          <button
            onClick={() => router.navigate({ to: '/auth' })}
            className="px-6 py-3 bg-giraffe-400 hover:bg-giraffe-500 text-brown-800 font-bold rounded-lg transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  // No challenge generated yet
  if (!myChallenge) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-giraffe-50 to-white p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-brown-900 mb-6">
            Daily Challenges
          </h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h2 className="text-lg font-bold text-yellow-900 mb-2">
              No Challenge Today
            </h2>
            <p className="text-yellow-800 mb-4">
              A new challenge will be generated at midnight UTC. Check back
              later!
            </p>
            <p className="text-sm text-yellow-700">
              In the meantime, you can explore other practice scenarios.
            </p>
          </div>
        </div>
      </div>
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
    <div className="min-h-screen bg-gradient-to-b from-giraffe-50 to-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-brown-900 mb-2">
            Daily Challenge
          </h1>
          <p className="text-lg text-slate-600">
            Complete today's challenge to earn 2x points and maintain your
            streak!
          </p>
        </div>

        {/* Stats Section */}
        {stats && (
          <div className="mb-8">
            <ChallengeStats
              currentStreak={stats.currentStreak}
              longestStreak={stats.longestStreak}
              completedCount={stats.completedCount}
              averageScore={stats.averageScore}
              totalPoints={stats.totalPoints}
              level={stats.level}
            />
          </div>
        )}

        {/* Recommended Challenge Card */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-brown-900 mb-4">
            Recommended for You
          </h2>
          {myChallenge.recommendedDifficulty && (
            <p className="text-sm text-slate-600 mb-3">
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
          )}
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

        {/* Tips Section */}
        <div className="bg-giraffe-100 border border-giraffe-300 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-bold text-brown-900 mb-4">
            Tips for Success
          </h3>
          <ul className="space-y-3 text-slate-700">
            <li className="flex gap-3">
              <span className="text-xl flex-shrink-0">1</span>
              <span>
                Start by making a clear observation without judgment or blame
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-xl flex-shrink-0">2</span>
              <span>Express your feelings using actual emotion words</span>
            </li>
            <li className="flex gap-3">
              <span className="text-xl flex-shrink-0">3</span>
              <span>Connect your feelings to universal human needs</span>
            </li>
            <li className="flex gap-3">
              <span className="text-xl flex-shrink-0">4</span>
              <span>Make a clear, doable request (not a demand)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

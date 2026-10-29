import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { DailyChallengeCard } from '../../components/features/challenges/DailyChallengeCard'
import { ChallengeStats } from '../../components/features/challenges/ChallengeStats'
import { GiraffeLoader } from '../../components/ui/GiraffeLoader'
import { ProtectedRoute } from '../../components/auth/ProtectedRoute'
import { pageMeta } from '~/lib/seo'

export const Route = createFileRoute('/challenges/daily')({
  head: () => ({
    meta: pageMeta({
      title: 'Daily Challenge',
      description:
        'A fresh scenario every day to build fluency.',
    }),
  }),
  component: DailyChallengePage,
})

function DailyChallengePage() {
  return (
    <ProtectedRoute>
      <DailyChallengeContent />
    </ProtectedRoute>
  )
}

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Beginner',
  medium: 'Intermediate',
  hard: 'Advanced',
}

function DailyChallengeContent() {
  const myChallenge = useQuery(api.dailyChallenges.getMyChallenge)
  const stats = useQuery(api.dailyChallenges.getUserChallengeStats)
  const getOrCreateProgress = useMutation(api.userProgress.getOrCreate)

  // Ensure userProgress exists
  useEffect(() => {
    if (myChallenge === null) {
      getOrCreateProgress().catch(console.error)
    }
  }, [myChallenge, getOrCreateProgress])

  const scenario = useQuery(
    api.scenarios.getById,
    myChallenge?.scenarioId ? { scenarioId: myChallenge.scenarioId } : 'skip',
  )

  if (myChallenge === undefined) {
    return <GiraffeLoader message="Finding today's challenge for you…" />
  }

  if (myChallenge === null) {
    return (
      <main className="min-h-screen bg-linear-to-b from-giraffe-50 to-paper pt-24">
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto px-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-brown-800 mb-6">
              Daily <span className="text-giraffe-700">Challenge</span>
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

  const title = scenario?.title || 'Daily Challenge'
  const learningObjectives = scenario?.learningObjectives || [
    'observation',
    'feeling',
  ]
  const characterName = scenario?.characterName || 'Character'

  return (
    <main className="min-h-screen bg-linear-to-b from-giraffe-50 to-paper pt-24 pb-16">
      {/* Header */}
      <section className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl font-bold text-brown-800 mb-6 text-balance tracking-tight">
              Daily <span className="text-giraffe-700">Challenge</span>
            </h1>
            <p className="text-lg text-brown-700 leading-relaxed">
              A fresh scenario every day. Complete it to earn bonus points and
              keep your streak alive.
            </p>
          </div>
        </div>
      </section>

      {/* Recommended Challenge Card */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <h2 className="text-sm font-semibold text-brown-800 mb-3">
            Recommended for You
          </h2>
          <p className="text-sm text-brown-600 mb-4">
            Based on your level ({myChallenge.userLevel}), we recommend the{' '}
            <span className="font-semibold">
              {DIFFICULTY_LABELS[myChallenge.recommendedDifficulty]}
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
            completedScore={myChallenge.completedScore ?? undefined}
            bonusPoints={myChallenge.bonusPoints}
            scenarioId={myChallenge.scenarioId}
            challengeId={myChallenge._id}
          />
        </div>

        {/* Other difficulties */}
        {myChallenge.alternatives.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-brown-800 mb-3">
              Want something different today?
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {myChallenge.alternatives.map((alt) => (
                <div
                  key={alt._id}
                  className="bg-white rounded-lg border-2 border-giraffe-100 p-5 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-giraffe-100 text-giraffe-800">
                      {DIFFICULTY_LABELS[alt.difficulty]}
                    </span>
                    <span className="text-xs font-semibold text-giraffe-700">
                      +{alt.bonusPoints} pts
                    </span>
                  </div>
                  <p className="text-sm text-brown-700 leading-relaxed flex-1">
                    {alt.description}
                  </p>
                  <Link
                    to="/practice/$scenarioId/brief"
                    params={{ scenarioId: alt.scenarioId }}
                    search={{ dailyChallengeId: alt._id }}
                    className="text-sm font-semibold text-brown-800 bg-giraffe-100 hover:bg-giraffe-200 transition-colors rounded-lg px-4 py-2 text-center"
                  >
                    Take this one instead
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Streak and history */}
        {stats && (
          <ChallengeStats
            currentStreak={stats.currentStreak}
            longestStreak={stats.longestStreak}
            completedCount={stats.completedCount}
            averageScore={stats.averageScore}
            totalPoints={stats.totalPoints}
            level={stats.level}
          />
        )}
      </section>
    </main>
  )
}

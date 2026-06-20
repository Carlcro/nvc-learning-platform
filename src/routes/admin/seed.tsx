import { createFileRoute } from '@tanstack/react-router'
import { useMutation } from 'convex/react'
import { useState } from 'react'
import { api } from '../../../convex/_generated/api'
import { Button } from '~/components/ui/Button'
import { Card, CardBody } from '~/components/ui/Card'

export const Route = createFileRoute('/admin/seed')({
  component: AdminSeedPage,
})

interface SeedResult {
  success: boolean
  message: string
  breakdown?: Record<string, number>
}

type SeedSection = 'scenarios' | 'feelings' | 'quizQuestions' | 'challenges'

function AdminSeedPage() {
  const seedScenarios = useMutation(api.scenarios.seedAll)
  const seedAllFeelings = useMutation(api.seed.seedAllFeelingsPublic)
  const seedQuizQuestionsOnly = useMutation(
    api.seed.seedQuizQuestionsOnlyPublic,
  )
  const seedDailyChallenge = useMutation(api.dailyChallenges.seedDailyChallenge)
  const getSeedStats = useMutation(api.seed.getSeedStats)

  const [loading, setLoading] = useState<SeedSection | null>(null)
  const [results, setResults] = useState<
    Record<SeedSection, SeedResult | null>
  >({
    scenarios: null,
    feelings: null,
    quizQuestions: null,
    challenges: null,
  })
  const [stats, setStats] = useState<any>(null)

  const handleSeed = async (section: SeedSection) => {
    setLoading(section)
    try {
      let result: SeedResult

      switch (section) {
        case 'scenarios': {
          const res = (await seedScenarios()) as any
          result = {
            success: res.success,
            message: res.message,
            breakdown: res.breakdown,
          }
          break
        }
        case 'feelings': {
          const res = (await seedAllFeelings()) as any
          result = {
            success: true,
            message: res.message || 'Feelings seeded successfully',
          }
          break
        }
        case 'quizQuestions': {
          const res = (await seedQuizQuestionsOnly()) as any
          result = {
            success: true,
            message: res.message || 'Quiz questions seeded successfully',
          }
          break
        }
        case 'challenges': {
          const res = (await seedDailyChallenge()) as any
          result = {
            success: true,
            message: res.message || 'Daily challenge seeded successfully',
          }
          break
        }
        default:
          result = { success: false, message: 'Unknown section' }
      }

      setResults((prev) => ({ ...prev, [section]: result }))
      // Refresh stats after successful seed
      if (result.success) {
        await refreshStats()
      }
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [section]: {
          success: false,
          message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      }))
    } finally {
      setLoading(null)
    }
  }

  const refreshStats = async () => {
    try {
      const stats = (await getSeedStats()) as any
      setStats(stats)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-giraffe-50 to-cream pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-brown-800">
            Database Seed Management
          </h1>
          <p className="text-brown-600">
            Easily populate your database with all necessary seed data
          </p>
        </div>

        {/* Stats Card */}
        {stats && (
          <Card className="bg-giraffe-50 border-2 border-giraffe-300">
            <CardBody>
              <h2 className="text-xl font-bold text-brown-800 mb-4">
                Database Status
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-white rounded-lg border border-giraffe-200">
                  <div className="text-2xl font-bold text-giraffe-600">
                    {stats.totalFeelings || 0}
                  </div>
                  <div className="text-xs text-giraffe-700 mt-1">Feelings</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border border-giraffe-200">
                  <div className="text-2xl font-bold text-giraffe-600">
                    {stats.totalQuizQuestions || 0}
                  </div>
                  <div className="text-xs text-giraffe-700 mt-1">Quiz Q's</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border border-giraffe-200">
                  <div className="text-2xl font-bold text-giraffe-600">
                    Scenarios
                  </div>
                  <div className="text-xs text-giraffe-700 mt-1">
                    {Object.values(stats.feelingsByFamily || {}).length}
                  </div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border border-giraffe-200">
                  <div className="text-2xl font-bold text-giraffe-600">
                    Challenges
                  </div>
                  <div className="text-xs text-giraffe-700 mt-1">
                    Coming Soon
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Seed Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Scenarios Section */}
          <Card>
            <CardBody className="space-y-4">
              <h2 className="text-xl font-bold text-brown-800">
                NVC Scenarios
              </h2>
              <p className="text-sm text-brown-600">
                Add 9 practice scenarios (3 beginner, 4 intermediate, 2
                advanced) for users to practice NVC roleplay.
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-giraffe-700 font-bold">•</span>
                  <span>Colleague Feedback</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-giraffe-700 font-bold">•</span>
                  <span>Romantic Partner Distance</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-giraffe-700 font-bold">•</span>
                  <span>Team Undermining</span>
                </div>
              </div>

              <Button
                onClick={() => handleSeed('scenarios')}
                isLoading={loading === 'scenarios'}
                disabled={loading !== null}
                variant="primary"
                size="lg"
                className="w-full"
              >
                {loading === 'scenarios' ? 'Seeding...' : 'Seed Scenarios (9)'}
              </Button>

              {results.scenarios && (
                <div
                  className={`p-3 rounded-lg text-sm font-semibold ${
                    results.scenarios.success
                      ? 'bg-empathy-high/15 text-brown-800 border border-empathy-high/40'
                      : 'bg-empathy-low/15 text-empathy-low border border-empathy-low/40'
                  }`}
                >
                  {results.scenarios.success ? '✓ ' : '✗ '}
                  {results.scenarios.message}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Feelings Section */}
          <Card>
            <CardBody className="space-y-4">
              <h2 className="text-xl font-bold text-brown-800">
                Feelings Library
              </h2>
              <p className="text-sm text-brown-600">
                Add 60+ feelings organized by family and intensity for the
                feelings wheel and emotion learning.
              </p>

              <div className="space-y-2 text-sm">
                <div>Families included:</div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-giraffe-100 text-brown-700 rounded text-xs">
                    Joyful
                  </span>
                  <span className="px-2 py-1 bg-giraffe-100 text-brown-700 rounded text-xs">
                    Peaceful
                  </span>
                  <span className="px-2 py-1 bg-giraffe-100 text-brown-700 rounded text-xs">
                    Angry
                  </span>
                  <span className="px-2 py-1 bg-giraffe-100 text-brown-700 rounded text-xs">
                    Scared
                  </span>
                </div>
              </div>

              <Button
                onClick={() => handleSeed('feelings')}
                isLoading={loading === 'feelings'}
                disabled={loading !== null}
                variant="primary"
                size="lg"
                className="w-full"
              >
                {loading === 'feelings' ? 'Seeding...' : 'Seed Feelings (60+)'}
              </Button>

              {results.feelings && (
                <div
                  className={`p-3 rounded-lg text-sm font-semibold ${
                    results.feelings.success
                      ? 'bg-empathy-high/15 text-brown-800 border border-empathy-high/40'
                      : 'bg-empathy-low/15 text-empathy-low border border-empathy-low/40'
                  }`}
                >
                  {results.feelings.success ? '✓ ' : '✗ '}
                  {results.feelings.message}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Quiz Questions Section */}
          <Card>
            <CardBody className="space-y-4">
              <h2 className="text-xl font-bold text-brown-800">
                Quiz Questions
              </h2>
              <p className="text-sm text-brown-600">
                Add 30 questions across 3 difficulty levels to help users learn
                to identify real feelings vs pseudo-feelings.
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Level 1 (Easy)</span>
                  <span className="font-semibold">10 questions</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Level 2 (Medium)</span>
                  <span className="font-semibold">10 questions</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Level 3 (Hard)</span>
                  <span className="font-semibold">10 questions</span>
                </div>
              </div>

              <Button
                onClick={() => handleSeed('quizQuestions')}
                isLoading={loading === 'quizQuestions'}
                disabled={loading !== null}
                variant="primary"
                size="lg"
                className="w-full"
              >
                {loading === 'quizQuestions' ? 'Seeding...' : 'Seed Quiz (30)'}
              </Button>

              {results.quizQuestions && (
                <div
                  className={`p-3 rounded-lg text-sm font-semibold ${
                    results.quizQuestions.success
                      ? 'bg-empathy-high/15 text-brown-800 border border-empathy-high/40'
                      : 'bg-empathy-low/15 text-empathy-low border border-empathy-low/40'
                  }`}
                >
                  {results.quizQuestions.success ? '✓ ' : '✗ '}
                  {results.quizQuestions.message}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Daily Challenges Section */}
          <Card>
            <CardBody className="space-y-4">
              <h2 className="text-xl font-bold text-brown-800">
                Daily Challenge
              </h2>
              <p className="text-sm text-brown-600">
                Create today's daily challenge by randomly selecting from
                available scenarios.
              </p>

              <div className="space-y-2 text-sm bg-giraffe-50 p-3 rounded-lg border-2 border-giraffe-100">
                <div className="font-semibold text-brown-800">How it works:</div>
                <ul className="list-disc list-inside text-brown-700 space-y-1">
                  <li>Randomly picks a scenario</li>
                  <li>Awards bonus points</li>
                  <li>Resets daily at midnight</li>
                </ul>
              </div>

              <Button
                onClick={() => handleSeed('challenges')}
                isLoading={loading === 'challenges'}
                disabled={loading !== null}
                variant="primary"
                size="lg"
                className="w-full"
              >
                {loading === 'challenges'
                  ? 'Creating...'
                  : 'Create Daily Challenge'}
              </Button>

              {results.challenges && (
                <div
                  className={`p-3 rounded-lg text-sm font-semibold ${
                    results.challenges.success
                      ? 'bg-empathy-high/15 text-brown-800 border border-empathy-high/40'
                      : 'bg-empathy-low/15 text-empathy-low border border-empathy-low/40'
                  }`}
                >
                  {results.challenges.success ? '✓ ' : '✗ '}
                  {results.challenges.message}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Seed All Button */}
        <Card className="bg-giraffe-100 border-2 border-giraffe-400">
          <CardBody className="space-y-4">
            <h2 className="text-xl font-bold text-brown-800">Quick Setup</h2>
            <p className="text-sm text-brown-700">
              Click below to seed everything at once. This is perfect for
              setting up a fresh database.
            </p>
            <Button
              onClick={() => {
                handleSeed('scenarios')
                handleSeed('feelings')
                handleSeed('quizQuestions')
                handleSeed('challenges')
              }}
              isLoading={loading !== null}
              disabled={loading !== null}
              variant="primary"
              size="lg"
              className="w-full bg-giraffe-600 hover:bg-giraffe-700"
            >
              {loading ? 'Seeding All...' : 'Seed Everything'}
            </Button>
          </CardBody>
        </Card>

        {/* Refresh Stats Button */}
        <div className="flex justify-center">
          <Button onClick={refreshStats} variant="secondary" size="sm">
            Refresh Stats
          </Button>
        </div>

        {/* Help Card */}
        <Card className="bg-giraffe-50 border-2 border-giraffe-200">
          <CardBody>
            <div className="space-y-3">
              <h3 className="font-bold text-brown-800">Help & Information</h3>
              <div className="space-y-2 text-sm text-brown-700">
                <div>
                  <div className="font-semibold">What is seeding?</div>
                  <p className="text-xs mt-1">
                    Seeding is the process of automatically adding predefined
                    data to your database. This is useful for development and
                    ensuring your app has content from the start.
                  </p>
                </div>
                <div>
                  <div className="font-semibold">
                    Is it safe to seed multiple times?
                  </div>
                  <p className="text-xs mt-1">
                    Yes! The seed functions are smart and won't create
                    duplicates if data already exists.
                  </p>
                </div>
                <div>
                  <div className="font-semibold">
                    What if I need to clear data?
                  </div>
                  <p className="text-xs mt-1">
                    Use the Convex Dashboard to manually delete data if needed.
                    Data deletion is handled there.
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </main>
  )
}

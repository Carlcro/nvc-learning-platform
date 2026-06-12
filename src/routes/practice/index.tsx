import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery as useConvexQuery } from 'convex/react'
import { useState } from 'react'
import { api } from '../../../convex/_generated/api'
import { ScenarioCard } from '~/components/features/roleplay/ScenarioCard'
import { ProtectedRoute } from '~/components/auth/ProtectedRoute'

export const Route = createFileRoute('/practice/')({
  component: ProtectedPracticeHub,
})

function ProtectedPracticeHub() {
  return (
    <ProtectedRoute>
      <PracticeHub />
    </ProtectedRoute>
  )
}

type Category = 'workplace' | 'family' | 'friendship' | 'self_expression'
type Difficulty = 'beginner' | 'intermediate' | 'advanced'

/**
 * Shows the user's current level and how far they are from the next one.
 * Levels gently signal which scenarios will feel like a stretch - nothing is
 * ever blocked.
 */
function LevelIndicator({
  level,
  pointsToNext,
}: {
  level: number
  pointsToNext?: number
}) {
  return (
    <div className="inline-flex items-center gap-4 bg-white rounded-xl border-2 border-giraffe-200 px-5 py-3 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-brown-600">Your Level</span>
        <span className="text-2xl font-bold text-giraffe-600">{level}</span>
      </div>
      {pointsToNext !== undefined && pointsToNext > 0 && (
        <div className="border-l border-giraffe-200 pl-4 text-sm text-brown-600">
          <span className="font-semibold text-brown-800">{pointsToNext}</span>{' '}
          points to Level {level + 1}
        </div>
      )}
    </div>
  )
}

function PracticeHub() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>(
    'all',
  )
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    Difficulty | 'all'
  >('all')

  // Fetch scenarios ordered by index
  const scenarios = useConvexQuery(api.scenarios.listByOrder) || []

  // Fetch user's per-scenario progress (status, best scores, stars)
  const userProgress =
    useConvexQuery(api.scenarioProgress.getUserProgress) || []

  // Fetch overall progress for the user's level. Scenarios are never blocked;
  // the level only drives a "recommended at level N" hint on harder scenarios.
  const overallProgress = useConvexQuery(api.userProgress.getByUserId)
  const userLevel = overallProgress?.level ?? 1

  // Look up a user's saved progress for a given scenario id.
  const getScenarioProgress = (scenarioId: string) =>
    userProgress.find((p: any) => p.scenarioId === scenarioId) || null

  // Filter scenarios
  const filteredScenarios = scenarios.filter((scenario) => {
    const categoryMatch =
      selectedCategory === 'all' || scenario.category === selectedCategory
    const difficultyMatch =
      selectedDifficulty === 'all' || scenario.difficulty === selectedDifficulty
    return categoryMatch && difficultyMatch
  })

  const handleStartScenario = (scenarioId: string | unknown) => {
    navigate({ to: `/practice/${scenarioId}/brief` })
  }

  const handleViewBest = (
    scenarioId: string | unknown,
    conversationId: string,
  ) => {
    navigate({
      to: `/practice/${scenarioId}/conversation/${conversationId}`,
      search: { view: 'archive' },
    })
  }

  const categories: Array<{
    value: Category | 'all'
    label: string
  }> = [
    { value: 'all', label: 'All' },
    { value: 'workplace', label: 'Workplace' },
    { value: 'family', label: 'Family' },
    { value: 'friendship', label: 'Friendship' },
    { value: 'self_expression', label: 'Self-Expression' },
  ]

  const difficulties: Array<{ value: Difficulty | 'all'; label: string }> = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ]

  return (
    <main className="min-h-screen bg-linear-to-b from-giraffe-50 to-cream pt-24">
      {/* Header with Giraffe Speaking */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            {/* Left side - Giraffe Mascot */}

            {/* Right side - Title and Description */}
            <div className="text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl font-bold text-brown-800 mb-6">
                Practice <br />
                <span className="bg-linear-to-r from-giraffe-600 to-giraffe-500 bg-clip-text text-transparent">
                  Your Skills
                </span>
              </h1>

              <p className="text-lg text-brown-700 mb-8 leading-relaxed">
                Engage in realistic conversations. Each scenario presents a
                different communication challenge where you can apply what
                you've learned.
              </p>

              <LevelIndicator
                level={userLevel}
                pointsToNext={overallProgress?.pointsToNextLevel}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex relative">
          <div className="space-y-4">
            {/* Category Filter */}
            <div>
              <h2 className="text-sm font-semibold text-brown-800 mb-3">
                By Category
              </h2>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 text-sm ${
                      selectedCategory === cat.value
                        ? 'bg-linear-to-r from-giraffe-500 to-giraffe-400 text-white shadow-lg'
                        : 'bg-white border-2 border-giraffe-200 text-brown-700 hover:border-giraffe-300'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <h2 className="text-sm font-semibold text-brown-800 mb-3">
                By Difficulty
              </h2>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((diff) => (
                  <button
                    key={diff.value}
                    onClick={() => setSelectedDifficulty(diff.value)}
                    className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 text-sm ${
                      selectedDifficulty === diff.value
                        ? 'bg-linear-to-r from-giraffe-500 to-giraffe-400 text-white shadow-lg'
                        : 'bg-white border-2 border-giraffe-200 text-brown-700 hover:border-giraffe-300'
                    }`}
                  >
                    {diff.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex-col items-center absolute right-0 -top-[300px] hidden md:flex">
            {/* Speech Bubble */}
            <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg border-2 border-giraffe-200 relative max-w-sm">
              <p className="text-lg text-brown-800 text-center font-medium">
                Practice Non-Violent Communication in realistic scenarios. Learn
                by doing in a safe, judgment-free environment.
              </p>
              {/* Speech bubble tail */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
            </div>

            {/* Giraffe Image */}
            <img
              src="/giraff.png"
              alt="Giraffe - Your NVC Guide"
              className="mx-auto object-contain h-80 w-auto"
            />
          </div>
        </div>
      </section>

      {/* Scenarios Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredScenarios.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-brown-600">
              No scenarios match your filters. Try adjusting them!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScenarios.map((scenario) => (
              <ScenarioCard
                key={scenario._id}
                id={scenario._id}
                title={scenario.title}
                description={scenario.description}
                category={scenario.category}
                difficulty={scenario.difficulty}
                characterName={scenario.characterName}
                minLevel={scenario.unlockRequirements.minLevel}
                userLevel={userLevel}
                progress={getScenarioProgress(scenario._id)}
                onStart={handleStartScenario}
                onViewBest={handleViewBest}
              />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-linear-to-b from-cream to-giraffe-50 py-12 px-4 sm:px-6 lg:px-8 border-t border-giraffe-200 mt-12">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-2xl font-bold text-brown-800">
            Tips for Success
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border-2 border-giraffe-100">
              <p className="text-sm text-brown-700 font-semibold">Observe</p>
              <p className="text-xs text-brown-600 mt-1">
                Describe facts without judgment
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-giraffe-100">
              <p className="text-sm text-brown-700 font-semibold">Feel</p>
              <p className="text-xs text-brown-600 mt-1">
                Express actual emotions
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-giraffe-100">
              <p className="text-sm text-brown-700 font-semibold">Request</p>
              <p className="text-xs text-brown-600 mt-1">
                Ask for what you need
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

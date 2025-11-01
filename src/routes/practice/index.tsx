import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery as useConvexQuery } from 'convex/react'
import { useState } from 'react'
import { api } from '../../../convex/_generated/api'
import { BackButton } from '~/components/ui/BackButton'
import { ScenarioCard } from '~/components/features/roleplay/ScenarioCard'

export const Route = createFileRoute('/practice/')({
  component: PracticeHub,
})

type Category = 'workplace' | 'family' | 'friendship' | 'self_expression'
type Difficulty = 'beginner' | 'intermediate' | 'advanced'

function PracticeHub() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>(
    'all',
  )
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    Difficulty | 'all'
  >('all')

  // Fetch scenarios
  const scenarios = useConvexQuery(api.scenarios.list) || []

  // For now, use a mock user level (in real app, this would come from auth)
  const userLevel = 5

  // Filter scenarios
  const filteredScenarios = scenarios.filter((scenario) => {
    const categoryMatch =
      selectedCategory === 'all' || scenario.category === selectedCategory
    const difficultyMatch =
      selectedDifficulty === 'all' || scenario.difficulty === selectedDifficulty
    return categoryMatch && difficultyMatch
  })

  const handleStartScenario = (scenarioId: string | unknown) => {
    navigate({ to: `/practice/roleplay/${scenarioId}` })
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
    <main className="min-h-screen bg-gradient-to-b from-giraffe-50 to-cream">
      {/* Back Button */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <BackButton to="/" label="Back to Home" />
      </section>

      {/* Header */}
      <section className="bg-gradient-to-r from-giraffe-600 to-giraffe-500 py-12 px-4 sm:px-6 lg:px-8 border-b border-giraffe-300">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-3">
              Practice Scenarios
            </h1>
            <p className="text-lg text-giraffe-50 max-w-2xl mx-auto">
              Practice Non-Violent Communication in realistic scenarios. Learn
              by doing in a safe, judgment-free environment.
            </p>
          </div>

          {/* User Level Info */}
          <div className="bg-giraffe-700 rounded-lg px-4 py-3 text-center text-giraffe-50">
            <span className="font-semibold">Your Level:</span> {userLevel}/10
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                      ? 'bg-gradient-to-r from-giraffe-500 to-giraffe-400 text-white shadow-lg'
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
                      ? 'bg-gradient-to-r from-giraffe-500 to-giraffe-400 text-white shadow-lg'
                      : 'bg-white border-2 border-giraffe-200 text-brown-700 hover:border-giraffe-300'
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
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
                unlockLevel={scenario.unlockLevel}
                isLocked={userLevel < scenario.unlockLevel}
                onStart={handleStartScenario}
              />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-cream to-giraffe-50 py-12 px-4 sm:px-6 lg:px-8 border-t border-giraffe-200 mt-12">
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

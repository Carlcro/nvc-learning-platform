import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery as useConvexQuery } from 'convex/react'
import { useState } from 'react'
import { api } from '../../../convex/_generated/api'
import type { ReactNode } from 'react'
import { ScenarioCard } from '~/components/features/roleplay/ScenarioCard'
import { Button } from '~/components/ui/Button'
import { SpeechBubble } from '~/components/ui/SpeechBubble'
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

  // Fetch scenarios ordered by index. Keep the raw value so we can tell
  // "still loading" (undefined) apart from "loaded, but empty" ([]) - otherwise
  // the empty-state copy flashes before data arrives.
  const scenariosResult = useConvexQuery(api.scenarios.listByOrder)
  const isLoadingScenarios = scenariosResult === undefined
  const scenarios = scenariosResult ?? []

  // Fetch user's per-scenario progress (status, best scores, stars)
  const userProgress =
    useConvexQuery(api.scenarioProgress.getUserProgress) || []

  // Fetch overall progress for the user's level. Scenarios are never blocked;
  // the level only drives a "recommended at level N" hint on harder scenarios.
  const overallProgress = useConvexQuery(api.userProgress.getByUserId)
  const userLevel = overallProgress?.level ?? 1

  // Look up a user's saved progress for a given scenario id.
  const getScenarioProgress = (scenarioId: string) =>
    userProgress.find((p) => p.scenarioId === scenarioId) || null

  // Filter scenarios
  const filteredScenarios = scenarios.filter((scenario) => {
    const categoryMatch =
      selectedCategory === 'all' || scenario.category === selectedCategory
    const difficultyMatch =
      selectedDifficulty === 'all' || scenario.difficulty === selectedDifficulty
    return categoryMatch && difficultyMatch
  })

  const hasActiveFilters =
    selectedCategory !== 'all' || selectedDifficulty !== 'all'

  const clearFilters = () => {
    setSelectedCategory('all')
    setSelectedDifficulty('all')
  }

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
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left - Title and Description (the first thing the user reads) */}
            <div className="text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl font-bold text-brown-800 mb-6 text-balance tracking-tight">
                Practice <span className="text-giraffe-700">Your Skills</span>
              </h1>

              <p className="text-lg text-brown-700 mb-8 leading-relaxed max-w-prose mx-auto md:mx-0">
                Engage in realistic conversations. Each scenario presents a
                different communication challenge where you can apply what
                you've learned.
              </p>

              <LevelIndicator
                level={userLevel}
                pointsToNext={overallProgress?.pointsToNextLevel}
              />
            </div>

            {/* Right - Giraffe guide (decorative; desktop only) */}
            <div className="hidden md:flex flex-col items-center">
              <SpeechBubble className="mb-8 max-w-sm">
                <p className="text-lg text-brown-800 text-center font-medium text-pretty">
                  Practice Non-Violent Communication in realistic scenarios.
                  Learn by doing in a safe, judgment-free environment.
                </p>
              </SpeechBubble>
              <img
                src="/giraff.png"
                alt="Your compassionate communication guide"
                className="object-contain h-72 w-auto drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {/* Category Filter */}
          <div role="group" aria-label="Filter scenarios by category">
            <h2 className="text-sm font-semibold text-brown-800 mb-3">
              By Category
            </h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <FilterChip
                  key={cat.value}
                  selected={selectedCategory === cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                >
                  {cat.label}
                </FilterChip>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div role="group" aria-label="Filter scenarios by difficulty">
            <h2 className="text-sm font-semibold text-brown-800 mb-3">
              By Difficulty
            </h2>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((diff) => (
                <FilterChip
                  key={diff.value}
                  selected={selectedDifficulty === diff.value}
                  onClick={() => setSelectedDifficulty(diff.value)}
                >
                  {diff.label}
                </FilterChip>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Scenarios Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoadingScenarios ? (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            aria-busy="true"
            aria-label="Loading scenarios"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredScenarios.length === 0 ? (
          hasActiveFilters ? (
            <div className="text-center py-12">
              <p className="text-brown-700 mb-4">
                No scenarios match these filters.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-brown-700">
                No scenarios are available yet. Check back soon!
              </p>
            </div>
          )
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

/**
 * A filter toggle. Selection is exposed to assistive tech via aria-pressed and
 * shown with a leading check (a non-color cue), so it never relies on color
 * alone. Fill + dark text keeps it readable; min height meets the 44px target.
 */
function FilterChip({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 min-h-11 px-4 py-2 rounded-full font-semibold text-sm cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-giraffe-300 focus-visible:ring-offset-2 ${
        selected
          ? 'bg-giraffe-400 text-brown-800 border-2 border-giraffe-500'
          : 'bg-white text-brown-700 border-2 border-giraffe-200 hover:border-giraffe-300 hover:bg-giraffe-50'
      }`}
    >
      {selected && (
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4 -ml-1"
        >
          <path
            fillRule="evenodd"
            d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.3 3.29 6.8-6.8a1 1 0 0 1 1.4 0Z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {children}
    </button>
  )
}

/**
 * Shaped placeholder shown while scenarios load, so the grid never flashes the
 * empty-state copy. Pulse only runs when motion is allowed.
 */
function SkeletonCard() {
  return (
    <div
      aria-hidden="true"
      className="rounded-lg border-2 border-giraffe-100 bg-white overflow-hidden motion-safe:animate-pulse"
    >
      <div className="h-8 bg-giraffe-100" />
      <div className="px-6 py-4 border-b border-giraffe-100 space-y-2">
        <div className="h-3 w-20 bg-giraffe-100 rounded" />
        <div className="h-5 w-3/4 bg-giraffe-200 rounded" />
      </div>
      <div className="px-6 py-4 space-y-3">
        <div className="h-3 w-full bg-giraffe-100 rounded" />
        <div className="h-3 w-5/6 bg-giraffe-100 rounded" />
        <div className="h-16 bg-giraffe-50 rounded-lg" />
      </div>
      <div className="px-6 py-4 border-t border-giraffe-100 bg-giraffe-50">
        <div className="h-10 bg-giraffe-200 rounded-lg" />
      </div>
    </div>
  )
}

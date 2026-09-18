import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery as useConvexQuery, useMutation } from 'convex/react'
import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { api } from '../../../convex/_generated/api'
import type { ReactNode } from 'react'
import type { Id } from 'convex/_generated/dataModel'
import { pageMeta } from '~/lib/seo'
import { ScenarioCard } from '~/components/features/roleplay/ScenarioCard'
import { Button } from '~/components/ui/Button'
import { SpeechBubble } from '~/components/ui/SpeechBubble'
import { ProtectedRoute } from '~/components/auth/ProtectedRoute'
import { pickRecommendedScenario } from '~/lib/conversationInsights'

export const Route = createFileRoute('/practice/')({
  head: () => ({
    meta: pageMeta({
      title: 'Practice',
      description:
        'Rehearse a difficult conversation with a practice partner who answers in character.',
    }),
  }),
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
    <div className="inline-flex items-center gap-4 bg-white rounded-lg border-2 border-giraffe-100 px-5 py-3 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-brown-600">Your Level</span>
        <span className="text-2xl font-bold text-giraffe-700">{level}</span>
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

  // The user's own scenario queued for deletion (drives the confirm dialog)
  const [pendingDelete, setPendingDelete] = useState<{
    id: Id<'scenarios'>
    title: string
  } | null>(null)

  // Fetch scenarios ordered by index. Keep the raw value so we can tell
  // "still loading" (undefined) apart from "loaded, but empty" ([]) - otherwise
  // the empty-state copy flashes before data arrives.
  const scenariosResult = useConvexQuery(api.scenarios.listByOrder)
  const isLoadingScenarios = scenariosResult === undefined
  const scenarios = scenariosResult ?? []

  // Fetch the user's own scenarios (shaped from real situations in their life)
  const myScenarios = useConvexQuery(api.scenarios.listMine) ?? []

  // Fetch user's per-scenario progress (status, best scores, stars)
  const userProgress =
    useConvexQuery(api.scenarioProgress.getUserProgress) || []

  // Fetch overall progress for the user's level. Scenarios are never blocked;
  // the level only drives a "recommended at level N" hint on harder scenarios.
  const overallProgress = useConvexQuery(api.userProgress.getByUserId)
  const userLevel = overallProgress?.level ?? 1

  // Scenarios with a conversation waiting to be picked up again.
  const activeScenarioIds =
    useConvexQuery(api.conversations.listMyActiveScenarioIds) ?? []
  const hasActiveConversation = (scenarioId: string) =>
    activeScenarioIds.some((id) => id === scenarioId)

  // One concrete suggestion: a waiting conversation first, otherwise the next
  // scenario on the ladder that has not been passed. A pointer, never a gate.
  const waitingScenario =
    [...myScenarios, ...scenarios].find((s) => hasActiveConversation(s._id)) ??
    null
  const recommendedScenario = pickRecommendedScenario(
    scenarios,
    userProgress,
    userLevel,
  )
  const suggestion = waitingScenario
    ? {
        scenario: waitingScenario,
        eyebrow: 'Pick up where you left off',
        note: `Your conversation with ${waitingScenario.characterName} is waiting for you.`,
        action: 'Continue',
      }
    : recommendedScenario
      ? {
          scenario: recommendedScenario,
          eyebrow:
            userProgress.length === 0 ? 'A good place to start' : 'Suggested next',
          note: recommendedScenario.description,
          action:
            userProgress.find(
              (p) => p.scenarioId === recommendedScenario._id,
            )?.status === 'attempted'
              ? 'Try it again'
              : 'Start',
        }
      : null

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
    // The transcript is the one good review screen: scores, the coaching at
    // each turn, and how the mood moved.
    navigate({
      to: `/practice/${scenarioId}/transcript/${conversationId}`,
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
      {/* Header: intro + filters in one column, giraffe guide in the other */}
      <section className="pt-6 pb-4 sm:pt-8 sm:pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left - Title, description, level, and the filters */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brown-800 mb-3 text-balance tracking-tight">
                Practice <span className="text-giraffe-700">Your Skills</span>
              </h1>

              <p className="text-base sm:text-lg text-brown-700 mb-5 leading-relaxed max-w-prose mx-auto md:mx-0">
                Engage in realistic conversations. Each scenario presents a
                different communication challenge where you can apply what
                you've learned.
              </p>

              <LevelIndicator
                level={userLevel}
                pointsToNext={overallProgress?.pointsToNextLevel}
              />

              {/* Filters - grouped with the intro so the giraffe can stand tall */}
              <div className="mt-6 space-y-3 text-left">
                <div role="group" aria-label="Filter scenarios by category">
                  <h2 className="text-sm font-semibold text-brown-800 mb-2">
                    By Category
                  </h2>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
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

                <div role="group" aria-label="Filter scenarios by difficulty">
                  <h2 className="text-sm font-semibold text-brown-800 mb-2">
                    By Difficulty
                  </h2>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
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
            </div>

            {/* Right - Giraffe guide (decorative; desktop only) */}
            <div className="hidden md:flex flex-col items-center">
              <SpeechBubble className="mb-6 max-w-sm">
                <p className="text-base lg:text-lg text-brown-800 text-center font-medium text-pretty">
                  Practice Non-Violent Communication in realistic scenarios.
                  Learn by doing in a safe, judgment-free environment.
                </p>
              </SpeechBubble>
              <img
                src="/giraff.png"
                alt="Your compassionate communication guide"
                className="object-contain h-52 lg:h-64 w-auto drop-shadow-xl mb-6"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Your own conversations - shaped from real situations in your life */}
      <section className="px-4 sm:px-6 lg:px-8 pt-2 pb-2">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* One clear next step, so the grid below is a choice rather than
              a question. Waits for the data so it never flashes and swaps. */}
          {suggestion && !isLoadingScenarios && (
            <div className="rounded-lg border-2 border-giraffe-400 bg-white shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 px-5 sm:px-8 py-5">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-giraffe-800">
                    {suggestion.eyebrow}
                  </p>
                  <h2 className="text-lg sm:text-xl font-bold text-brown-800 text-balance">
                    {suggestion.scenario.title}
                  </h2>
                  <p className="text-sm text-brown-600 text-pretty mt-1 max-w-prose line-clamp-2">
                    {suggestion.note}
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => handleStartScenario(suggestion.scenario._id)}
                  className="w-full sm:w-auto flex-shrink-0 px-8"
                >
                  {suggestion.action}
                </Button>
              </div>
            </div>
          )}

          {/* Entry point - turn a real situation into a practice space */}
          <button
            type="button"
            onClick={() => navigate({ to: '/practice/create' })}
            className="group relative w-full overflow-hidden text-left rounded-lg border-2 border-giraffe-200 bg-linear-to-br from-white to-giraffe-50 hover:border-giraffe-300 transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-giraffe-300 focus-visible:ring-offset-2"
          >
            <div className="flex items-center gap-4 sm:gap-6 px-5 sm:px-8 py-5">
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-brown-800">
                  Rehearse a real conversation
                </h2>
                <p className="text-sm text-brown-600 text-pretty mt-1 max-w-prose">
                  Have something difficult coming up? Shape it into a practice
                  space and try what you want to say, gently, before the real
                  thing.
                </p>
              </div>

              {/* Action affordance: a full pill on wider screens, a chevron on phones */}
              <span className="hidden md:inline-flex items-center gap-1.5 flex-shrink-0 rounded-lg bg-giraffe-400 group-hover:bg-giraffe-500 text-brown-800 font-semibold px-5 py-3 transition-colors duration-200">
                Start shaping it
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:translate-x-0"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.3 4.3a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4-1.4L11.58 10 7.3 5.7a1 1 0 0 1 0-1.4Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                className="md:hidden w-5 h-5 flex-shrink-0 text-giraffe-600"
              >
                <path
                  fillRule="evenodd"
                  d="M7.3 4.3a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4-1.4L11.58 10 7.3 5.7a1 1 0 0 1 0-1.4Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </button>

          {/* The user's own scenarios, if they've made any */}
          {myScenarios.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-brown-800 mb-3">
                Your own scenarios
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myScenarios.map((scenario) => (
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
                    hasActiveConversation={hasActiveConversation(scenario._id)}
                    onStart={handleStartScenario}
                    onViewBest={handleViewBest}
                    onDelete={() =>
                      setPendingDelete({
                        id: scenario._id,
                        title: scenario.title,
                      })
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Scenarios Grid - mirrors the header's container so the cards line up
          with the filters above (max-width inner, padding outer). */}
      <section className="px-4 sm:px-6 lg:px-8 pt-2 pb-8">
        <div className="max-w-6xl mx-auto">
          {myScenarios.length > 0 && (
            <h2 className="text-sm font-semibold text-brown-800 mb-3">
              Scenario library
            </h2>
          )}
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
                  hasActiveConversation={hasActiveConversation(scenario._id)}
                  isRecommended={recommendedScenario?._id === scenario._id}
                  onStart={handleStartScenario}
                  onViewBest={handleViewBest}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-linear-to-b from-cream to-giraffe-50 py-12 px-4 sm:px-6 lg:px-8 border-t border-giraffe-200 mt-12">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-2xl font-bold text-brown-800">
            One piece at a time
          </h2>
          <p className="text-sm text-brown-700 max-w-prose mx-auto text-pretty">
            A real conversation unfolds gradually. One of these per message is
            plenty, and the others can wait for their turn.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: 'Observe', hint: 'Describe facts without judgment' },
              { name: 'Feel', hint: 'Name the actual emotion' },
              { name: 'Need', hint: 'Say what matters underneath' },
              { name: 'Request', hint: 'Ask for one doable thing' },
            ].map((tip) => (
              <div
                key={tip.name}
                className="bg-white rounded-lg p-4 border-2 border-giraffe-100"
              >
                <p className="text-sm text-brown-700 font-semibold">
                  {tip.name}
                </p>
                <p className="text-xs text-brown-600 mt-1">{tip.hint}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DeleteScenarioDialog
        scenario={pendingDelete}
        onClose={() => setPendingDelete(null)}
      />
    </main>
  )
}

/**
 * Confirmation before permanently removing one of the user's own scenarios.
 * Framed gently and reversibly-worded - the destructive action is never the
 * default focus, and the warm "Keep it" sits beside it.
 */
function DeleteScenarioDialog({
  scenario,
  onClose,
}: {
  scenario: { id: Id<'scenarios'>; title: string } | null
  onClose: () => void
}) {
  const deleteScenario = useMutation(api.scenarios.deleteCustom)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!scenario) return
    setIsDeleting(true)
    setError(null)
    try {
      await deleteScenario({ scenarioId: scenario.id })
      setIsDeleting(false)
      onClose()
    } catch {
      setError("That didn't go through. Take a breath and try again.")
      setIsDeleting(false)
    }
  }

  return (
    <Dialog.Root
      open={scenario !== null}
      onOpenChange={(open) => {
        if (!open && !isDeleting) {
          setError(null)
          onClose()
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-brown-900/40 z-40" />
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="bg-giraffe-400 text-brown-800 px-6 py-4">
              <Dialog.Title className="text-lg font-bold">
                Delete this scenario?
              </Dialog.Title>
            </div>

            <div className="p-6 space-y-3">
              <Dialog.Description className="text-brown-800 text-sm leading-relaxed text-pretty">
                <span className="font-semibold">{scenario?.title}</span> and its
                practice history will be removed for good.
              </Dialog.Description>
              {error && (
                <p className="text-sm text-empathy-low font-medium">{error}</p>
              )}
            </div>

            <div className="border-t border-giraffe-100 px-6 py-4 flex gap-3 justify-end bg-giraffe-50">
              <Dialog.Close asChild>
                <button
                  type="button"
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-semibold text-brown-700 hover:bg-giraffe-100 rounded-lg transition-colors duration-200 cursor-pointer disabled:opacity-50"
                >
                  Keep it
                </button>
              </Dialog.Close>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-semibold text-brown-900 bg-empathy-low hover:brightness-95 rounded-lg transition-all duration-200 disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
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
          className="w-4 h-4 -ml-1 animate-pop-in"
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

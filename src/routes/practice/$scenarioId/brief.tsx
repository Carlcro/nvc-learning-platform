import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import { useState } from 'react'
import { api } from '../../../../convex/_generated/api'
import type { Id } from 'convex/_generated/dataModel'
import { Button } from '~/components/ui/Button'
import { ProtectedRoute } from '~/components/auth/ProtectedRoute'

export const Route = createFileRoute('/practice/$scenarioId/brief')({
  component: ProtectedBrief,
})

function ProtectedBrief() {
  return (
    <ProtectedRoute>
      <ScenarioBrief />
    </ProtectedRoute>
  )
}

const categoryLabels: Record<string, string> = {
  workplace: 'Workplace',
  family: 'Family',
  friendship: 'Friendship',
  self_expression: 'Self-Expression',
}

// Difficulty reads as a warm ramp: calm green (easy) -> gold -> coral
// (intense). Dark text keeps every chip legible on its fill.
const difficultyChip: Record<string, string> = {
  beginner: 'bg-empathy-high text-brown-900',
  intermediate: 'bg-giraffe-300 text-brown-900',
  advanced: 'bg-empathy-low text-brown-900',
}

const TIPS = [
  'Start with observations - describe what you saw or heard, without judgment.',
  'Express feelings as emotions, not thoughts or blame.',
  'Connect those feelings to the needs underneath them - what matters to you?',
  'Make specific, doable requests that invite collaboration, not demands.',
]

function ScenarioBrief() {
  const navigate = useNavigate()
  const { scenarioId } = Route.useParams()
  const currentUser = useQuery(api.users.getCurrentUser)
  const [isCreatingConversation, setIsCreatingConversation] = useState(false)
  const [startError, setStartError] = useState<string | null>(null)

  const scenario = useQuery(api.scenarios.getById, {
    scenarioId: scenarioId as Id<'scenarios'>,
  })

  const userProgress = useQuery(api.scenarioProgress.getScenarioProgress, {
    scenarioId: scenarioId as Id<'scenarios'>,
  })

  const createConversation = useMutation(api.conversations.create)
  const initializeScenarioProgress = useMutation(
    api.scenarioProgress.initializeScenarioProgress,
  )

  const handleStartConversation = async () => {
    if (!currentUser) return

    try {
      setStartError(null)
      setIsCreatingConversation(true)

      await initializeScenarioProgress({
        scenarioId: scenarioId as Id<'scenarios'>,
      })

      const conversationId = await createConversation({
        userId: currentUser._id,
        scenarioId: scenarioId as Id<'scenarios'>,
      })

      navigate({
        to: `/practice/${scenarioId}/conversation/${conversationId}`,
      })
    } catch {
      setStartError("That didn't go through. Take a breath and try again.")
      setIsCreatingConversation(false)
    }
  }

  const handleBack = () => {
    navigate({ to: '/practice' })
  }

  if (!scenario) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin motion-reduce:animate-none mb-4 inline-block">
            <svg
              className="w-12 h-12 text-giraffe-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-brown-600">Loading scenario...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-giraffe-50 to-cream pt-32 sm:pt-36 pb-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back link - breathing room under the nav, plus wayfinding */}
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brown-700 hover:text-brown-900 mb-6 rounded cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-giraffe-300 focus-visible:ring-offset-2"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path
              fillRule="evenodd"
              d="M12.7 4.3a1 1 0 0 1 0 1.4L8.42 10l4.3 4.3a1 1 0 0 1-1.42 1.4l-5-5a1 1 0 0 1 0-1.4l5-5a1 1 0 0 1 1.4 0Z"
              clipRule="evenodd"
            />
          </svg>
          Back to scenarios
        </button>

        {/* Card */}
        <div className="bg-white rounded-2xl border-2 border-giraffe-200 overflow-hidden shadow-sm">
          {/* Compact header */}
          <header className="bg-giraffe-400 px-6 sm:px-8 py-5">
            <h1 className="text-2xl sm:text-3xl font-bold text-brown-800 text-balance">
              {scenario.title}
            </h1>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brown-700 text-cream">
                {categoryLabels[
                  scenario.category as keyof typeof categoryLabels
                ] || scenario.category}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                  difficultyChip[
                    scenario.difficulty as keyof typeof difficultyChip
                  ] ?? 'bg-giraffe-100 text-brown-900'
                }`}
              >
                {scenario.difficulty}
              </span>
            </div>
          </header>

          {/* Body */}
          <div className="px-6 sm:px-8 py-6 space-y-6">
            {/* Situation - the setup the user needs first */}
            <section>
              <h2 className="text-lg font-bold text-brown-800 mb-2">
                Situation
              </h2>
              <p className="text-brown-700 leading-relaxed bg-giraffe-50 rounded-xl p-4 border border-giraffe-100 text-pretty">
                {scenario.situation}
              </p>
            </section>

            {/* Two columns keep the brief short on desktop */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* About the character */}
              <section>
                <h2 className="text-lg font-bold text-brown-800 mb-2">
                  About {scenario.characterName}
                </h2>
                <div className="space-y-3">
                  {scenario.characterPersonality && (
                    <div className="bg-giraffe-50 rounded-xl p-4 border border-giraffe-100">
                      <p className="text-xs font-semibold text-brown-700 mb-1">
                        Personality
                      </p>
                      <p className="text-brown-700 text-sm leading-relaxed">
                        {scenario.characterPersonality}
                      </p>
                    </div>
                  )}
                  {scenario.characterBackground && (
                    <div className="bg-giraffe-50 rounded-xl p-4 border border-giraffe-100">
                      <p className="text-xs font-semibold text-brown-700 mb-1">
                        Background
                      </p>
                      <p className="text-brown-700 text-sm leading-relaxed">
                        {scenario.characterBackground}
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* What you'll practice */}
              <section>
                <h2 className="text-lg font-bold text-brown-800 mb-2">
                  What you'll practice
                </h2>
                <ol className="space-y-2">
                  {scenario.learningObjectives.map(
                    (objective: string, idx: number) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 bg-giraffe-50 rounded-xl p-3 border border-giraffe-100"
                      >
                        <span className="flex-shrink-0 grid place-items-center w-6 h-6 rounded-full bg-giraffe-400 text-brown-800 text-xs font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-brown-700 text-sm capitalize">
                          {objective}
                        </span>
                      </li>
                    ),
                  )}
                </ol>

                {scenario.focusArea && (
                  <p className="mt-3 text-sm text-brown-700">
                    <span className="font-semibold text-brown-800">
                      Focus:{' '}
                    </span>
                    <span className="capitalize">
                      {scenario.focusArea.replace(/_/g, ' ')}
                    </span>
                  </p>
                )}
              </section>
            </div>

            {/* Tips - collapsed by default to keep the page short */}
            <details className="group rounded-xl border border-giraffe-200 bg-giraffe-50/70">
              <summary className="flex items-center justify-between gap-2 cursor-pointer list-none px-4 py-3 font-bold text-brown-800 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-giraffe-300 focus-visible:ring-offset-2">
                Tips for success
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  className="w-5 h-5 text-brown-600 transition-transform group-open:rotate-180 motion-reduce:transition-none"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.59l3.3-3.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.42Z"
                    clipRule="evenodd"
                  />
                </svg>
              </summary>
              <ul className="px-4 pb-4 space-y-2 text-sm text-brown-700">
                {TIPS.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span aria-hidden="true" className="text-giraffe-700 mt-0.5">
                      •
                    </span>
                    <span className="text-pretty">{tip}</span>
                  </li>
                ))}
                <li className="flex items-start gap-2">
                  <span aria-hidden="true" className="text-giraffe-700 mt-0.5">
                    •
                  </span>
                  <span className="text-pretty">
                    Stay curious about {scenario.characterName}'s perspective and
                    needs, too.
                  </span>
                </li>
              </ul>
            </details>

            {/* Personal best, if any */}
            {userProgress && userProgress.bestScore > 0 && (
              <div className="flex items-center gap-2 rounded-xl border border-empathy-high/40 bg-empathy-high/15 px-4 py-3 text-sm">
                <span className="font-semibold text-brown-800">
                  Your best: {userProgress.bestScore}/100
                </span>
                {userProgress.bestStars > 0 && (
                  <span
                    role="img"
                    aria-label={`${userProgress.bestStars} of 3 stars`}
                    className="text-giraffe-700"
                  >
                    {'★'.repeat(userProgress.bestStars)}
                  </span>
                )}
                <span className="text-brown-600">
                  · {userProgress.attempts}{' '}
                  {userProgress.attempts === 1 ? 'attempt' : 'attempts'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky action bar - Start is always one tap away, no scrolling */}
      <div className="fixed bottom-0 inset-x-0 z-30 border-t border-giraffe-200 bg-white/95 backdrop-blur-sm shadow-[0_-2px_12px_rgba(45,30,17,0.06)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          {startError ? (
            <p className="flex-1 text-sm text-empathy-low font-medium">
              {startError}
            </p>
          ) : (
            <p className="flex-1 hidden sm:block text-sm text-brown-600">
              Ready when you are — take your time.
            </p>
          )}
          <Button
            onClick={handleStartConversation}
            variant="primary"
            size="lg"
            className="px-8 flex-1 sm:flex-none"
            isLoading={isCreatingConversation}
            disabled={isCreatingConversation}
          >
            {isCreatingConversation ? 'Starting...' : 'Start Conversation'}
          </Button>
        </div>
      </div>
    </main>
  )
}

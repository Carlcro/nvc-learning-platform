import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import { useEffect, useRef, useState } from 'react'
import { api } from '../../../../convex/_generated/api'
import type { Id } from 'convex/_generated/dataModel'
import { Button } from '~/components/ui/Button'
import { GiraffeLoader } from '~/components/ui/GiraffeLoader'
import { ProtectedRoute } from '~/components/auth/ProtectedRoute'
import { StarIcon } from '~/components/ui/Icons'

export const Route = createFileRoute('/practice/$scenarioId/brief')({
  // Daily challenges arrive here with their challenge id; keep it through the
  // brief so completing the conversation can credit the challenge.
  validateSearch: (search: Record<string, unknown>) => ({
    dailyChallengeId:
      (search.dailyChallengeId as string | undefined) ?? undefined,
  }),
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
  const { dailyChallengeId } = Route.useSearch()
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

  // The card footer holds the real Start button. While it's scrolled out of
  // view, a floating pill stands in so starting never requires scrolling.
  const footerRef = useRef<HTMLDivElement>(null)
  const [footerInView, setFooterInView] = useState(true)

  useEffect(() => {
    const footer = footerRef.current
    if (!footer) return

    const observer = new IntersectionObserver(
      ([entry]) => setFooterInView(entry.isIntersecting),
      { threshold: 0.4 },
    )
    observer.observe(footer)
    return () => observer.disconnect()
  }, [scenario])

  const handleStartConversation = async () => {
    if (!currentUser) return

    try {
      setStartError(null)
      setIsCreatingConversation(true)

      await initializeScenarioProgress({
        scenarioId: scenarioId as Id<'scenarios'>,
      })

      const conversationId = await createConversation({
        scenarioId: scenarioId as Id<'scenarios'>,
      })

      navigate({
        to: `/practice/${scenarioId}/conversation/${conversationId}`,
        search: { dailyChallengeId },
      })
    } catch {
      setStartError("That didn't go through. Take a breath and try again.")
      setIsCreatingConversation(false)
    }
  }

  const handleBack = () => {
    navigate({ to: '/practice' })
  }

  if (scenario === undefined) {
    return <GiraffeLoader message="Setting the scene for your conversation…" />
  }

  // Loaded but not found (deleted, or someone else's private scenario).
  if (scenario === null) {
    return (
      <main className="min-h-screen bg-linear-to-b from-giraffe-50 to-cream pt-32 px-6">
        <div className="max-w-xl mx-auto bg-white rounded-lg border-2 border-giraffe-100 p-8 text-center">
          <h1 className="text-2xl font-bold text-brown-800 mb-3">
            We could not find this scenario
          </h1>
          <p className="text-brown-700 mb-6">
            It may have been removed, or the link is no longer valid.
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-giraffe-400 text-brown-800 rounded-lg font-semibold hover:bg-giraffe-500 transition-colors cursor-pointer"
          >
            Back to scenarios
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-giraffe-50 to-cream pt-32 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-8">
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
        <div className="bg-white rounded-lg border-2 border-giraffe-100 overflow-hidden shadow-sm">
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
              <p className="text-brown-700 leading-relaxed bg-giraffe-50 rounded-lg p-4 border border-giraffe-100 text-pretty">
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
                    <div className="bg-giraffe-50 rounded-lg p-4 border border-giraffe-100">
                      <p className="text-xs font-semibold text-brown-700 mb-1">
                        Personality
                      </p>
                      <p className="text-brown-700 text-sm leading-relaxed">
                        {scenario.characterPersonality}
                      </p>
                    </div>
                  )}
                  {scenario.characterBackground && (
                    <div className="bg-giraffe-50 rounded-lg p-4 border border-giraffe-100">
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
                        className="flex items-start gap-3 bg-giraffe-50 rounded-lg p-3 border border-giraffe-100"
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
            <details className="group rounded-lg border border-giraffe-200 bg-giraffe-50/70">
              <summary className="flex items-center justify-between gap-2 cursor-pointer list-none px-4 py-3 font-bold text-brown-800 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-giraffe-300 focus-visible:ring-offset-2">
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
              <div className="flex items-center gap-2 rounded-lg border border-empathy-high/40 bg-empathy-high/15 px-4 py-3 text-sm">
                <span className="font-semibold text-brown-800">
                  Your best: {userProgress.bestScore}/100
                </span>
                {userProgress.bestStars > 0 && (
                  <span
                    role="img"
                    aria-label={`${userProgress.bestStars} of 3 stars`}
                    className="inline-flex items-center gap-0.5 text-giraffe-700"
                  >
                    {Array.from({ length: userProgress.bestStars }).map(
                      (_, i) => (
                        <StarIcon key={i} className="w-4 h-4" />
                      ),
                    )}
                  </span>
                )}
                <span className="text-brown-600">
                  · {userProgress.attempts}{' '}
                  {userProgress.attempts === 1 ? 'attempt' : 'attempts'}
                </span>
              </div>
            )}
          </div>

          {/* Card footer - the real call to action, part of the brief itself */}
          <footer className="border-t border-giraffe-100 bg-giraffe-50 px-6 sm:px-8 py-5">
            <div
              ref={footerRef}
              className="flex flex-col sm:flex-row sm:items-center gap-3"
            >
              {startError ? (
                <p className="flex-1 text-sm text-empathy-low font-medium">
                  {startError}
                </p>
              ) : (
                <p className="flex-1 text-sm text-brown-600">
                  Ready when you are. Take your time.
                </p>
              )}
              <Button
                onClick={handleStartConversation}
                variant="primary"
                size="lg"
                className="px-8 w-full sm:w-auto"
                isLoading={isCreatingConversation}
                disabled={isCreatingConversation}
              >
                {isCreatingConversation ? 'Starting...' : 'Start Conversation'}
              </Button>
            </div>
          </footer>
        </div>
      </div>

      {/* Floating stand-in - appears only while the card footer is off-screen,
          echoing the floating nav pill. It fades away once the real button
          scrolls into view, so the two never show at the same time. */}
      <div
        aria-hidden={footerInView}
        className={`fixed bottom-5 inset-x-0 z-30 flex flex-col items-center gap-2 px-4 pointer-events-none transition-all duration-300 ease-out motion-reduce:transition-none ${
          footerInView
            ? 'opacity-0 translate-y-3'
            : 'opacity-100 translate-y-0'
        }`}
      >
        {startError && (
          <p className="pointer-events-auto max-w-md text-center rounded-full bg-white border border-empathy-low/40 shadow-md px-4 py-2 text-sm text-empathy-low font-medium">
            {startError}
          </p>
        )}
        <button
          type="button"
          onClick={handleStartConversation}
          disabled={isCreatingConversation}
          tabIndex={footerInView ? -1 : 0}
          className={`inline-flex items-center justify-center gap-2 rounded-full bg-giraffe-400 hover:bg-giraffe-500 text-brown-800 font-semibold text-lg px-8 py-3.5 shadow-lg cursor-pointer transition-colors duration-200 motion-safe:active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-giraffe-300 focus-visible:ring-offset-2 ${
            footerInView ? '' : 'pointer-events-auto'
          }`}
        >
          {isCreatingConversation && (
            <svg
              className="animate-spin -ml-1 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {isCreatingConversation ? 'Starting...' : 'Start Conversation'}
        </button>
      </div>
    </main>
  )
}

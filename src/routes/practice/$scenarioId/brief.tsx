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

interface DifficultyColor {
  badge: string
  text: string
}

const difficultyColors: Record<string, DifficultyColor> = {
  beginner: {
    badge: 'bg-green-100 text-green-800',
    text: 'text-green-700',
  },
  intermediate: {
    badge: 'bg-yellow-100 text-yellow-800',
    text: 'text-yellow-700',
  },
  advanced: {
    badge: 'bg-red-100 text-red-800',
    text: 'text-red-700',
  },
}

const categoryLabels: Record<string, string> = {
  workplace: 'Workplace',
  family: 'Family',
  friendship: 'Friendship',
  self_expression: 'Self-Expression',
}

function ScenarioBrief() {
  const navigate = useNavigate()
  const { scenarioId } = Route.useParams()
  const currentUser = useQuery(api.users.getCurrentUser)
  const [isCreatingConversation, setIsCreatingConversation] = useState(false)

  // Get scenario
  const scenario = useQuery(api.scenarios.getById, {
    scenarioId: scenarioId as Id<'scenarios'>,
  })

  // Get user progress
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
      setIsCreatingConversation(true)

      // Initialize scenario progress first if it doesn't exist
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
    } catch (error) {
    } finally {
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
          <div className="animate-spin mb-4">
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


  const colors =
    difficultyColors[scenario.difficulty as keyof typeof difficultyColors]

  return (
    <main className="min-h-screen bg-linear-to-b from-giraffe-50 to-cream pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Main Content Card */}
        <div className="bg-white rounded-lg border-2 border-giraffe-200 overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-giraffe-600 to-giraffe-500 px-6 sm:px-8 py-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {scenario.title}
                </h1>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-emerald-500 bg-opacity-20 text-white rounded-full text-sm font-semibold">
                    {categoryLabels[
                      scenario.category as keyof typeof categoryLabels
                    ] || scenario.category}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${colors.badge}`}
                  >
                    {scenario.difficulty}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 sm:px-8 py-8 space-y-8">
            {/* Situation Section */}
            <div>
              <h2 className="text-xl font-bold text-brown-800 mb-4 flex items-center gap-2">
                Situation
              </h2>
              <p className="text-brown-700 leading-relaxed bg-giraffe-50 rounded-lg p-4 border border-giraffe-100">
                {scenario.situation}
              </p>
            </div>

            {/* Character Info Section */}
            <div>
              <h2 className="text-xl font-bold text-brown-800 mb-4 flex items-center gap-2">
                About {scenario.characterName}
              </h2>
              <div className="space-y-4">
                {scenario.characterPersonality && (
                  <div className="bg-cream rounded-lg p-4 border border-giraffe-100">
                    <p className="text-sm font-semibold text-giraffe-700 mb-1">
                      Personality
                    </p>
                    <p className="text-brown-700">
                      {scenario.characterPersonality}
                    </p>
                  </div>
                )}

                {scenario.characterBackground && (
                  <div className="bg-cream rounded-lg p-4 border border-giraffe-100">
                    <p className="text-sm font-semibold text-giraffe-700 mb-1">
                      Background
                    </p>
                    <p className="text-brown-700">
                      {scenario.characterBackground}
                    </p>
                  </div>
                )}

                {scenario.characterHiddenNeeds.length > 0 && (
                  <div className="bg-cream rounded-lg p-4 border border-giraffe-100">
                    <p className="text-sm font-semibold text-giraffe-700 mb-2">
                      What They Need
                    </p>
                    <ul className="space-y-1">
                      {scenario.characterHiddenNeeds.map(
                        (need: string, idx: number) => (
                          <li
                            key={idx}
                            className="text-sm text-brown-700 flex items-start gap-2"
                          >
                            <span className="text-giraffe-500 mt-1">•</span>
                            <span>{need}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Learning Objectives Section */}
            <div>
              <h2 className="text-xl font-bold text-brown-800 mb-4 flex items-center gap-2">
                What You'll Practice
              </h2>
              <ul className="space-y-2">
                {scenario.learningObjectives.map(
                  (objective: string, idx: number) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 bg-giraffe-50 rounded-lg p-3 border border-giraffe-100"
                    >
                      <span className="text-giraffe-600 font-bold mt-0.5">
                        {idx + 1}.
                      </span>
                      <span className="text-brown-700 capitalize">
                        {objective}
                      </span>
                    </li>
                  ),
                )}
              </ul>

              {scenario.focusArea && (
                <div className="mt-4 bg-blue-50 border border-blue-300 rounded-lg p-4">
                  <p className="text-sm">
                    <span className="font-semibold text-blue-900">Focus: </span>
                    <span className="text-blue-800 capitalize">
                      {scenario.focusArea.replace(/_/g, ' ')}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Tips Section */}
            <div className="bg-linear-to-r from-giraffe-50 to-cream rounded-lg p-6 border-2 border-giraffe-200">
              <h3 className="text-lg font-bold text-giraffe-900 mb-4 flex items-center gap-2">
                <span className="text-xl">💡</span>
                Tips for Success
              </h3>
              <ul className="space-y-2 text-brown-700">
                <li className="flex items-start gap-2">
                  <span className="text-giraffe-600 font-bold">•</span>
                  <span>
                    Focus on observations first - describe what you see and hear
                    without judgment
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-giraffe-600 font-bold">•</span>
                  <span>
                    Express your feelings as emotions, not thoughts or blame
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-giraffe-600 font-bold">•</span>
                  <span>
                    Connect your feelings to your underlying needs - what
                    matters to you?
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-giraffe-600 font-bold">•</span>
                  <span>
                    Make specific, doable requests that invite collaboration,
                    not demands
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-giraffe-600 font-bold">•</span>
                  <span>
                    Stay curious about {scenario.characterName}'s perspective
                    and needs too
                  </span>
                </li>
              </ul>
            </div>

            {/* Progress Indicator */}
            {userProgress && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-900">
                  <span className="font-semibold">Your Best Score:</span>{' '}
                  {userProgress.bestScore}/100
                  {userProgress.bestStars > 0 && (
                    <span className="ml-2">
                      {'⭐'.repeat(userProgress.bestStars)}
                    </span>
                  )}
                </p>
                <p className="text-xs text-green-800 mt-1">
                  Attempts: {userProgress.attempts}
                </p>
              </div>
            )}
          </div>

          {/* Footer with Buttons */}
          <div className="border-t border-giraffe-200 bg-cream px-6 sm:px-8 py-6 flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleBack}
              variant="secondary"
              className="sm:flex-1"
            >
              Back to Scenarios
            </Button>
            <Button
              onClick={handleStartConversation}
              variant="primary"
              className="sm:flex-1"
              isLoading={isCreatingConversation}
              disabled={isCreatingConversation}
            >
              {isCreatingConversation ? 'Starting...' : 'Start Conversation'}
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}

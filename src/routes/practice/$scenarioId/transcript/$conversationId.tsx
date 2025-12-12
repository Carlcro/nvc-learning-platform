import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import type { Id } from 'convex/_generated/dataModel'
import { TranscriptView } from '~/components/features/roleplay/TranscriptView'

export const Route = createFileRoute(
  '/practice/$scenarioId/transcript/$conversationId',
)({
  component: TranscriptPage,
})

function TranscriptPage() {
  const { scenarioId, conversationId } = Route.useParams()
  const navigate = useNavigate()

  const scenario = useQuery(api.scenarios.getById, {
    scenarioId: scenarioId as Id<'scenarios'>,
  })

  const conversation = useQuery(
    api.conversations.getById,
    conversationId
      ? { conversationId: conversationId as Id<'conversations'> }
      : 'skip',
  )

  const handleBack = () => {
    navigate({ to: '/practice' })
  }

  if (!scenario || !conversation) {
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
          <p className="text-brown-600">Loading transcript...</p>
        </div>
      </div>
    )
  }

  return (
    <TranscriptView
      messages={conversation.messages}
      scenarioTitle={scenario.title}
      characterName={scenario.characterName}
      finalScore={conversation.finalScore || 0}
      completedAt={conversation.completedAt || conversation.lastMessageAt}
      initialMood={scenario.characterInitialMood}
      onBack={handleBack}
    />
  )
}

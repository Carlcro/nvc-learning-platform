import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import type { Id } from 'convex/_generated/dataModel'
import { pageMeta } from '~/lib/seo'
import { TranscriptView } from '~/components/features/roleplay/TranscriptView'
import { Button } from '~/components/ui/Button'
import { GiraffeLoader } from '~/components/ui/GiraffeLoader'
import { getMessages } from '~/i18n/messages'
import { useT } from '~/i18n/useT'

export const Route = createFileRoute(
  '/practice/$scenarioId/transcript/$conversationId',
)({
  head: ({ match }) => {
    const t = getMessages(match.context.locale)
    return { meta: pageMeta(t.results.transcript.meta) }
  },
  // Where the reader came from, so Back returns them there: 'results' is the
  // results screen of this same conversation; anything else is the hub.
  validateSearch: (search: Record<string, unknown>) => ({
    from: search.from === 'results' ? ('results' as const) : undefined,
  }),
  component: TranscriptPage,
})

function TranscriptPage() {
  const { scenarioId, conversationId } = Route.useParams()
  const { from } = Route.useSearch()
  const navigate = useNavigate()
  const t = useT()
  const copy = t.results.transcript

  const scenario = useQuery(api.scenarios.getById, {
    scenarioId: scenarioId as Id<'scenarios'>,
  })

  const conversation = useQuery(
    api.conversations.getById,
    conversationId
      ? { conversationId: conversationId as Id<'conversations'> }
      : 'skip',
  )

  const fromResults = from === 'results'
  const handleBack = () => {
    if (fromResults) {
      navigate({
        to: `/practice/${scenarioId}/conversation/${conversationId}`,
        search: { view: 'results' },
      })
      return
    }
    navigate({ to: '/practice' })
  }

  if (scenario === undefined || conversation === undefined) {
    return <GiraffeLoader message={copy.loading} />
  }

  // Loaded but not found (deleted, or not this person's conversation).
  if (scenario === null || conversation === null) {
    return (
      <main className="min-h-screen bg-linear-to-b from-giraffe-50 to-paper pt-32 px-6">
        <div className="max-w-xl mx-auto bg-white rounded-lg border-2 border-giraffe-100 p-8 text-center">
          <h1 className="text-2xl font-bold text-brown-800 mb-3">
            {copy.notFound.title}
          </h1>
          <p className="text-brown-700 mb-6">{copy.notFound.body}</p>
          <Button
            onClick={() => navigate({ to: '/practice' })}
            variant="primary"
          >
            {copy.backToPractice}
          </Button>
        </div>
      </main>
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
      reflection={conversation.reflection ?? null}
      backLabel={fromResults ? copy.backToResults : copy.backToPractice}
      onBack={handleBack}
    />
  )
}

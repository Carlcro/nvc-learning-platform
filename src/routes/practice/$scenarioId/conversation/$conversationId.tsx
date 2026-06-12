import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { ConversationView } from '~/components/features/roleplay/ConversationView'
import { FeedbackPanel } from '~/components/features/roleplay/FeedbackPanel'
import { MessageInput } from '~/components/features/roleplay/MessageInput'
import { MilestoneCelebration } from '~/components/features/roleplay/MilestoneCelebration'
import { RewindButton } from '~/components/features/roleplay/RewindButton'
import { ScenarioResults } from '~/components/features/roleplay/ScenarioResults'
import { Button } from '~/components/ui/Button'
import { GiraffeLoader } from '~/components/ui/GiraffeLoader'
import { useConversation } from '~/hooks/useConversation'

export const Route = createFileRoute(
  '/practice/$scenarioId/conversation/$conversationId',
)({
  validateSearch: (search: Record<string, unknown>) => ({
    view: (search.view as string | undefined) ?? undefined,
    dailyChallengeId:
      (search.dailyChallengeId as string | undefined) ?? undefined,
  }),
  component: ConversationComponent,
})

function LoadingScreen({ label }: { label: string }) {
  const message = label.toLowerCase().includes('scenario')
    ? 'Setting the scene for your conversation…'
    : 'Getting things ready for you…'
  return <GiraffeLoader message={message} />
}

function ConversationComponent() {
  const { scenarioId, conversationId } = Route.useParams()
  const search = Route.useSearch()
  const isArchiveMode = search.view === 'archive'

  const [mobileFeedbackExpanded, setMobileFeedbackExpanded] = useState(false)
  const [showScenarioContext, setShowScenarioContext] = useState(false)

  const {
    scenario,
    conversation,
    currentUser,
    messages,
    feedback,
    isLoading,
    conversationStarted,
    completion,
    celebration,
    error,
    sendMessage,
    completeScenario,
    startNewConversation,
    rewind,
    goToPractice,
    viewTranscript,
    dismissCelebration,
    dismissError,
  } = useConversation({ scenarioId, conversationId })

  if (currentUser === undefined) return <LoadingScreen label="Initializing..." />
  if (!scenario || conversation === undefined)
    return <LoadingScreen label="Loading scenario..." />

  if (completion) {
    return (
      <ScenarioResults
        finalScore={completion.finalScore}
        stars={completion.finalStars}
        scenarioTitle={scenario.title}
        messageCount={messages.length}
        onRetry={startNewConversation}
        onNext={goToPractice}
        onViewTranscript={viewTranscript}
      />
    )
  }

  const userMessageCount = messages.filter((m) => m.role === 'user').length
  const lastScore =
    userMessageCount > 0
      ? (messages.filter((m) => m.role === 'user').at(-1)?.nvcScore?.total ?? 0)
      : 0
  const canEndConversation =
    !isArchiveMode &&
    userMessageCount > 0 &&
    messages.length > 3 &&
    (lastScore >= 70 || messages.length >= 10)

  const characterMood =
    conversation?.currentCharacterMood ?? scenario.characterInitialMood

  return (
    <div className="h-screen bg-cream flex flex-col pt-24">
      <MilestoneCelebration
        celebration={celebration}
        onDismiss={dismissCelebration}
      />

      {error && (
        <div className="bg-empathy-low/15 border-b-2 border-empathy-low/40 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <p className="text-brown-800 text-sm font-medium">{error}</p>
            <button
              onClick={dismissError}
              className="text-brown-700 hover:text-brown-900 text-sm font-semibold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {isArchiveMode && (
        <div className="bg-giraffe-50 border-b-2 border-giraffe-200 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <div className="text-brown-800 font-semibold">
              Viewing Completed Conversation
            </div>
            <p className="text-brown-700 text-sm">
              This conversation has been completed. You can review it but cannot
              make changes.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto w-full gap-4 flex">
        <div>
          <div className="flex items-end gap-2">
            <h1 className="text-xl font-bold">{scenario.title}</h1>
            {conversationStarted && (
              <button
                onClick={() => setShowScenarioContext(true)}
                className="text-nowrap text-sm font-semibold text-brown-700 hover:text-brown-900 underline cursor-pointer"
              >
                View Scenario
              </button>
            )}
          </div>
          <p className="text-brown-700 text-sm">
            Practicing with <strong>{scenario.characterName}</strong>
          </p>
        </div>
      </div>

      {conversationStarted && (
        <div className="flex-1 flex overflow-hidden gap-6 max-w-7xl mx-auto w-full">
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6">
              <ConversationView
                messages={messages}
                characterName={scenario.characterName}
                isLoading={isLoading}
              />
            </div>

            <div className="border-t border-giraffe-200 bg-cream px-6 py-4 space-y-3 shrink-0">
              {canEndConversation && (
                <Button
                  onClick={completeScenario}
                  variant="secondary"
                  className="w-full"
                >
                  End & Get Results
                </Button>
              )}

              <MessageInput
                onSubmit={sendMessage}
                isLoading={isLoading}
                disabled={isLoading || isArchiveMode}
                onStartOver={startNewConversation}
              />

              {/* Rewind Button - show after at least one user message */}
              {userMessageCount > 0 && !isArchiveMode && (
                <div className="flex justify-center pt-1">
                  <RewindButton
                    rewindsRemaining={
                      (conversation?.maxRewinds ?? 2) -
                      (conversation?.rewindsUsed ?? 0)
                    }
                    onRewind={rewind}
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="w-[420px] hidden lg:flex flex-col min-w-0 px-6 overflow-hidden">
            <FeedbackPanel
              feedback={feedback}
              isLoading={isLoading}
              messageCount={userMessageCount}
              learningObjectives={scenario.learningObjectives}
              characterMood={characterMood}
              characterName={scenario.characterName}
              milestones={conversation?.milestonesAchieved}
            />
          </div>
        </div>
      )}

      {conversationStarted && (
        <>
          {!mobileFeedbackExpanded && (
            <div className="lg:hidden border-t border-giraffe-200 bg-white px-4 py-3">
              <button
                onClick={() => setMobileFeedbackExpanded(true)}
                className="w-full flex items-center justify-between gap-2 text-brown-700 hover:text-brown-900 font-semibold text-sm cursor-pointer"
              >
                <span>View Feedback</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </button>
            </div>
          )}

          {mobileFeedbackExpanded && (
            <div className="lg:hidden fixed inset-0 bg-white z-50 flex flex-col">
              <div className="bg-giraffe-400 text-brown-800 px-4 py-4 flex items-center justify-between">
                <h2 className="font-bold text-lg">Live Feedback</h2>
                <button
                  onClick={() => setMobileFeedbackExpanded(false)}
                  className="text-brown-700 hover:text-brown-900 transition-colors cursor-pointer"
                  aria-label="Close feedback panel"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <FeedbackPanel
                  feedback={feedback}
                  isLoading={isLoading}
                  messageCount={userMessageCount}
                  learningObjectives={scenario.learningObjectives}
                  characterMood={characterMood}
                  characterName={scenario.characterName}
                  milestones={conversation?.milestonesAchieved}
                />
              </div>

              <div className="border-t border-giraffe-200 bg-white px-4 py-3">
                <button
                  onClick={() => setMobileFeedbackExpanded(false)}
                  className="w-full bg-giraffe-400 hover:bg-giraffe-500 text-brown-800 font-semibold py-3 rounded-lg transition-colors cursor-pointer"
                >
                  Continue Conversation
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <Dialog.Root
        open={showScenarioContext}
        onOpenChange={setShowScenarioContext}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
          <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-giraffe-400 text-brown-800 px-6 py-4 sticky top-0 flex items-center justify-between">
                <h2 className="text-xl font-bold">Scenario Context</h2>
                <Dialog.Close asChild>
                  <button
                    className="text-brown-700 hover:text-brown-900 transition-colors p-1 cursor-pointer"
                    aria-label="Close scenario context"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </Dialog.Close>
              </div>

              <div className="px-6 py-6 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-brown-800 mb-3">
                    Situation
                  </h3>
                  <p className="text-brown-700 leading-relaxed">
                    {scenario.situation}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-brown-700 mb-3">
                    What You'll Practice:
                  </h3>
                  <ul className="space-y-2">
                    {scenario.learningObjectives.map(
                      (goal: string, idx: number) => (
                        <li
                          key={idx}
                          className="text-sm text-brown-700 flex items-start gap-2"
                        >
                          <span className="text-giraffe-700 mt-0.5">•</span>
                          <span>{goal}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>

                <div className="bg-giraffe-50 border border-giraffe-200 rounded-lg p-4 text-sm text-brown-700">
                  <strong className="text-brown-800">Tip:</strong> Remember to
                  express your observations, feelings, needs, and requests
                  clearly.
                </div>
              </div>

              <div className="border-t border-giraffe-200 bg-cream px-6 py-4">
                <Dialog.Close asChild>
                  <button className="w-full bg-giraffe-400 hover:bg-giraffe-500 text-brown-800 font-semibold py-3 rounded-lg transition-colors cursor-pointer">
                    Continue Conversation
                  </button>
                </Dialog.Close>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

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
    skillHint,
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
  } = useConversation({
    scenarioId,
    conversationId,
    dailyChallengeId: search.dailyChallengeId,
  })

  if (currentUser === undefined) return <LoadingScreen label="Initializing..." />
  if (!scenario || conversation === undefined)
    return <LoadingScreen label="Loading scenario..." />

  if (completion) {
    return (
      <ScenarioResults
        finalScore={completion.finalScore}
        stars={completion.finalStars}
        pointsEarned={completion.pointsEarned}
        newAchievements={completion.newAchievements}
        scenarioTitle={scenario.title}
        characterName={scenario.characterName}
        characterHiddenNeeds={scenario.characterHiddenNeeds}
        messageCount={messages.length}
        milestones={conversation?.milestonesAchieved}
        onRetry={startNewConversation}
        onNext={goToPractice}
        onViewTranscript={viewTranscript}
      />
    )
  }

  const userMessageCount = messages.filter((m) => m.role === 'user').length

  // Finishing is the reward for completing the full arc: the user can only end
  // once they have expressed a feeling, a need, and a clear request. These
  // milestones accumulate across the conversation and never reset.
  const milestones = conversation?.milestonesAchieved
  const canEndConversation =
    !isArchiveMode &&
    !isLoading && // wait until the character's closing reply is on screen
    !!milestones?.feelingExpressed &&
    !!milestones.needIdentified &&
    !!milestones.requestMade

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
              className="text-brown-700 hover:text-brown-900 text-sm font-semibold cursor-pointer rounded px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown-500 focus-visible:ring-offset-2"
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
                className="text-nowrap text-sm font-semibold text-brown-700 hover:text-brown-900 underline cursor-pointer rounded px-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown-500 focus-visible:ring-offset-2"
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
                // This button is earned: it only exists once a feeling, a need,
                // and a request have all been expressed. Let it arrive like the
                // small win it is.
                <div className="animate-celebrate-in">
                  <Button
                    onClick={completeScenario}
                    variant="secondary"
                    className="w-full"
                  >
                    Wrap up and see how it went
                  </Button>
                </div>
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

          <div className="w-[420px] hidden lg:flex flex-col min-w-0 px-6 pb-6 overflow-hidden">
            <FeedbackPanel
              feedback={feedback}
              skillHint={skillHint}
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
                className="w-full min-h-11 flex items-center justify-between gap-2 text-brown-700 hover:text-brown-900 font-semibold text-sm cursor-pointer rounded-lg px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown-500 focus-visible:ring-offset-2"
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
                  className="grid place-items-center w-11 h-11 -mr-2 rounded-full text-brown-700 hover:text-brown-900 hover:bg-giraffe-300/50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown-500 focus-visible:ring-offset-2 focus-visible:ring-offset-giraffe-400"
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
                  skillHint={skillHint}
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
                  className="w-full bg-giraffe-400 hover:bg-giraffe-500 text-brown-800 font-semibold py-3 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-giraffe-500 focus-visible:ring-offset-2"
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
                    className="grid place-items-center w-11 h-11 -mr-2 rounded-full text-brown-700 hover:text-brown-900 hover:bg-giraffe-300/50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown-500 focus-visible:ring-offset-2 focus-visible:ring-offset-giraffe-400"
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
                  <button className="w-full bg-giraffe-400 hover:bg-giraffe-500 text-brown-800 font-semibold py-3 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-giraffe-500 focus-visible:ring-offset-2">
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

import {
  MAX_USER_TURNS,
  MIN_TURNS_TO_WRAP_UP,
  TURNS_REMAINING_WARNING,
} from 'convex/lib/limits'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { pageMeta } from '~/lib/seo'
import { ConversationView } from '~/components/features/roleplay/ConversationView'
import {
  FeedbackPanel,
  getScoreMessage,
} from '~/components/features/roleplay/FeedbackPanel'
import { MessageInput } from '~/components/features/roleplay/MessageInput'
import { MilestoneCelebration } from '~/components/features/roleplay/MilestoneCelebration'
import { RewindButton } from '~/components/features/roleplay/RewindButton'
import { ScenarioResults } from '~/components/features/roleplay/ScenarioResults'
import { StartOverButton } from '~/components/features/roleplay/StartOverButton'
import { Button } from '~/components/ui/Button'
import { GiraffeLoader } from '~/components/ui/GiraffeLoader'
import { useConversation } from '~/hooks/useConversation'
import { isNVCComponent } from '~/lib/conversationInsights'

export const Route = createFileRoute(
  '/practice/$scenarioId/conversation/$conversationId',
)({
  head: () => ({
    meta: pageMeta({
      title: 'Conversation',
      description:
        'Practice compassionate communication turn by turn, with feedback as you go.',
    }),
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    view: (search.view as string | undefined) ?? undefined,
    dailyChallengeId:
      (search.dailyChallengeId as string | undefined) ?? undefined,
    // The piece to work on, carried over from the last attempt's results.
    focus: isNVCComponent(search.focus) ? search.focus : undefined,
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

  const [mobileFeedbackExpanded, setMobileFeedbackExpanded] = useState(false)
  const [showScenarioContext, setShowScenarioContext] = useState(false)
  // Words handed back to the composer after a rewind.
  const [restoredDraft, setRestoredDraft] = useState<{
    id: number
    text: string
  } | null>(null)

  const {
    scenario,
    conversation,
    currentUser,
    messages,
    feedback,
    skillHint,
    isLoading,
    isCompleting,
    conversationStarted,
    completion,
    reflection,
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
    view: search.view,
  })

  // Take back the last turn and hand its words back for reshaping.
  const handleRewind = async () => {
    const text = await rewind()
    if (text) setRestoredDraft((prev) => ({ id: (prev?.id ?? 0) + 1, text }))
    setMobileFeedbackExpanded(false)
  }

  if (currentUser === undefined) return <LoadingScreen label="Initializing..." />
  if (scenario === undefined || conversation === undefined)
    return <LoadingScreen label="Loading scenario..." />

  // null (as opposed to undefined) means loaded and not found: a deleted or
  // foreign scenario/conversation should not spin forever.
  if (scenario === null || conversation === null) {
    return (
      <main className="min-h-screen bg-cream pt-28 px-6">
        <div className="max-w-xl mx-auto bg-white rounded-lg border-2 border-giraffe-100 p-8 text-center">
          <h1 className="text-2xl font-bold text-brown-800 mb-3">
            We could not find this conversation
          </h1>
          <p className="text-brown-700 mb-6">
            It may have been removed, or the link is no longer valid.
          </p>
          <Button onClick={goToPractice} variant="primary">
            Back to Practice
          </Button>
        </div>
      </main>
    )
  }

  if (completion) {
    return (
      <ScenarioResults
        finalScore={completion.finalScore}
        stars={completion.finalStars}
        pointsEarned={completion.pointsEarned}
        newAchievements={completion.newAchievements}
        summary={completion.summary}
        reflection={reflection}
        scenarioId={scenarioId}
        scenarioTitle={scenario.title}
        characterName={scenario.characterName}
        characterHiddenNeeds={scenario.characterHiddenNeeds}
        finalMood={conversation.currentCharacterMood}
        messages={messages}
        milestones={conversation.milestonesAchieved}
        onRetry={startNewConversation}
        onNext={goToPractice}
        onViewTranscript={viewTranscript}
      />
    )
  }

  // Derived from the conversation's own status, not just the URL: reaching a
  // finished conversation without the search param used to render a fully
  // enabled composer that could only fail on send.
  const isArchiveMode =
    search.view === 'archive' || conversation.status !== 'in_progress'

  const userMessageCount = messages.filter((m) => m.role === 'user').length

  // Completing the full arc is the celebrated ending: a feeling, a need, and a
  // clear request, all expressed. Milestones accumulate and never reset.
  const milestones = conversation.milestonesAchieved
  const completedArc =
    !!milestones?.feelingExpressed &&
    !!milestones.needIdentified &&
    !!milestones.requestMade

  // Someone who cannot reach the milestones still needs a way out that keeps
  // what they managed, so wrapping up opens once there is a conversation worth
  // reflecting on. Without this a struggling beginner, exactly the person who
  // most needs the results screen, could only abandon and lose everything.
  const turnsRemaining = MAX_USER_TURNS - userMessageCount
  const reachedTurnLimit = turnsRemaining <= 0
  const canEndConversation =
    !isArchiveMode &&
    !isLoading && // wait until the character's closing reply is on screen
    (completedArc || userMessageCount >= MIN_TURNS_TO_WRAP_UP)

  const showTurnsRemaining =
    !isArchiveMode &&
    !reachedTurnLimit &&
    turnsRemaining <= TURNS_REMAINING_WARNING

  const characterMood = conversation.currentCharacterMood
  const rewindsRemaining =
    (conversation.maxRewinds ?? 2) - (conversation.rewindsUsed ?? 0)

  const feedbackPanel = (
    <FeedbackPanel
      feedback={feedback}
      skillHint={skillHint}
      isLoading={isLoading}
      messageCount={userMessageCount}
      learningObjectives={scenario.learningObjectives}
      focusArea={scenario.focusArea}
      retryFocus={search.focus}
      characterMood={characterMood}
      characterName={scenario.characterName}
      milestones={conversation.milestonesAchieved}
      onRetryLastTurn={
        isArchiveMode || isLoading ? undefined : () => void handleRewind()
      }
      rewindsRemaining={rewindsRemaining}
    />
  )

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
                initialMood={scenario.characterInitialMood}
                isLoading={isLoading}
              />
            </div>

            <div className="border-t border-giraffe-200 bg-cream px-6 py-4 space-y-3 shrink-0">
              {canEndConversation && (
                // Completing the arc is a small win, so that version arrives
                // with a flourish. The plain version is a quiet way out for
                // someone who is stuck, and should not feel like a consolation.
                <div className={completedArc ? 'animate-celebrate-in' : ''}>
                  <Button
                    onClick={completeScenario}
                    variant="secondary"
                    className="w-full"
                    disabled={isCompleting}
                    isLoading={isCompleting}
                  >
                    {completedArc
                      ? 'Wrap up and see how it went'
                      : 'Wrap up here and see how it went'}
                  </Button>
                </div>
              )}

              {reachedTurnLimit && !isArchiveMode ? (
                <p className="text-center text-sm text-brown-600 py-2">
                  This is as far as this conversation goes. Wrap it up above to
                  see how it went, and you can always start it again.
                </p>
              ) : (
                <MessageInput
                  onSubmit={sendMessage}
                  isLoading={isLoading}
                  disabled={isLoading || isArchiveMode}
                  restoredDraft={restoredDraft}
                />
              )}

              {showTurnsRemaining && (
                <p className="text-center text-sm text-brown-500">
                  {turnsRemaining === 1
                    ? 'One message left in this conversation.'
                    : `${turnsRemaining} messages left in this conversation.`}
                </p>
              )}

              {/* Taking back a turn, or the whole conversation. Both sit apart
                  from Send and both ask first, so neither happens by slip. */}
              {userMessageCount > 0 && !isArchiveMode && (
                <div className="flex items-center justify-center gap-2 pt-1">
                  <RewindButton
                    rewindsRemaining={rewindsRemaining}
                    onRewind={handleRewind}
                    disabled={isLoading}
                  />
                  <StartOverButton
                    onStartOver={() => startNewConversation(search.focus)}
                    canWrapUp={canEndConversation}
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="w-[420px] hidden lg:flex flex-col min-w-0 px-6 pb-6 overflow-hidden">
            {feedbackPanel}
          </div>
        </div>
      )}

      {conversationStarted && (
        <>
          {!mobileFeedbackExpanded && (
            <div className="lg:hidden border-t border-giraffe-200 bg-white px-4 py-3">
              <button
                onClick={() => setMobileFeedbackExpanded(true)}
                aria-label="Open the full feedback"
                className="w-full min-h-11 flex items-center justify-between gap-3 text-left text-brown-700 hover:text-brown-900 text-sm cursor-pointer rounded-lg px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown-500 focus-visible:ring-offset-2"
              >
                {/* On a phone the panel is out of sight, so the latest turn's
                    result lands right here; the full panel is one tap away.
                    Keyed by turn so each new result eases in and is noticed. */}
                {isLoading ? (
                  <span className="font-semibold">Reading your message…</span>
                ) : feedback ? (
                  <span
                    key={userMessageCount}
                    className="flex items-center gap-3 min-w-0 animate-step-in"
                  >
                    <span className="shrink-0 grid place-items-center w-11 h-11 rounded-full bg-giraffe-100 border border-giraffe-300 font-bold text-brown-800 tabular-nums">
                      {feedback.score.total}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-brown-800">
                        {getScoreMessage(feedback.score.total)}
                      </span>
                      {feedback.feedback && (
                        <span className="block text-xs text-brown-600 line-clamp-2">
                          Try next: {feedback.feedback}
                        </span>
                      )}
                    </span>
                  </span>
                ) : (
                  <span className="font-semibold">
                    Tips for your first message
                  </span>
                )}
                <svg
                  className="w-5 h-5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
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

              <div className="flex-1 overflow-y-auto">{feedbackPanel}</div>

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
                  <strong className="text-brown-800">Tip:</strong> A real
                  conversation unfolds a piece at a time. An observation in one
                  message, a feeling in the next, a request later on. You do not
                  need to fit all four into every message.
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

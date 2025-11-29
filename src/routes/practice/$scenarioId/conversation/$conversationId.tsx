import { createFileRoute } from '@tanstack/react-router'
import { useAction, useMutation, useQuery } from 'convex/react'
import { useCallback, useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { api } from '../../../../../convex/_generated/api'
import type { Message } from '~/components/features/roleplay/ConversationView'
import type { FeedbackData } from '~/components/features/roleplay/FeedbackPanel'
import type { Id } from 'convex/_generated/dataModel'
import { ConversationView } from '~/components/features/roleplay/ConversationView'
import { FeedbackPanel } from '~/components/features/roleplay/FeedbackPanel'
import { MessageInput } from '~/components/features/roleplay/MessageInput'
import { ScenarioResults } from '~/components/features/roleplay/ScenarioResults'
import { Button } from '~/components/ui/Button'

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

function ConversationComponent() {
  const { scenarioId, conversationId } = Route.useParams()
  const navigate = Route.useNavigate()
  const search = Route.useSearch()
  const isArchiveMode = search.view === 'archive'

  const currentUser = useQuery(api.users.getCurrentUser)

  const scenario = useQuery(api.scenarios.getById, {
    scenarioId: scenarioId as Id<'scenarios'>,
  })

  const conversation = useQuery(
    api.conversations.getById,
    conversationId
      ? { conversationId: conversationId as Id<'conversations'> }
      : 'skip',
  )

  const scenarioProgress = useQuery(
    api.scenarioProgress.getScenarioProgress,
    scenarioId
      ? ({ scenarioId: scenarioId } as { scenarioId: Id<'scenarios'> })
      : 'skip',
  )

  const analyzeMessage = useAction(api.ai.analyzeNVCResponse)
  const generateCharacterResponse = useAction(api.ai.generateCharacterResponse)

  const addMessage = useMutation(api.conversations.addMessage)
  const completeConversation = useMutation(api.conversations.complete)
  const abandonConversation = useMutation(api.conversations.abandon)
  const createConversation = useMutation(api.conversations.create)
  const updateUserProgress = useMutation(api.userProgress.updateProgress)
  const updateScenarioProgress = useMutation(
    api.scenarioProgress.updateScenarioProgress,
  )

  const [messages, setMessages] = useState<Array<Message>>([])
  const [feedback, setFeedback] = useState<FeedbackData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const [conversationStarted, setConversationStarted] = useState(false)
  const [mobileFeedbackExpanded, setMobileFeedbackExpanded] = useState(false)
  const [showScenarioContext, setShowScenarioContext] = useState(false)

  useEffect(() => {
    if (!scenario || !currentUser) return

    if (conversation && conversation.status === 'in_progress') {
      setConversationStarted(true)

      if (
        Array.isArray(conversation.messages) &&
        conversation.messages.length > 0
      ) {
        setMessages(conversation.messages)

        const lastUserMessageWithFeedback = [...conversation.messages]
          .reverse()
          .find((msg) => msg.role === 'user' && msg.feedback)

        if (lastUserMessageWithFeedback) {
          setFeedback({
            score: {
              observation:
                lastUserMessageWithFeedback.nvcScore?.observation || 0,
              feeling: lastUserMessageWithFeedback.nvcScore?.feeling || 0,
              need: lastUserMessageWithFeedback.nvcScore?.need || 0,
              request: lastUserMessageWithFeedback.nvcScore?.request || 0,
              total: lastUserMessageWithFeedback.nvcScore?.total || 0,
            },
            feedback: lastUserMessageWithFeedback.feedback || '',
            whatWentWell: lastUserMessageWithFeedback.whatWentWell || '',
            giraffeAlternative:
              lastUserMessageWithFeedback.giraffeAlternative || '',
            isJackalLanguage:
              lastUserMessageWithFeedback.isJackalLanguage || false,
          })
        }
      } else {
        setMessages([
          {
            role: 'assistant',
            content: scenario.aiOpeningMessage,
            timestamp: Date.now(),
          },
        ])
      }
    }
  }, [scenario, currentUser, conversation])

  const handleSendMessage = useCallback(
    async (userMessage: string) => {
      if (!conversationId || !scenario) return

      setIsLoading(true)
      setFeedback(null)

      try {
        const userMsg: Message = {
          role: 'user',
          content: userMessage,
          timestamp: Date.now(),
        }
        setMessages((prev) => [...prev, userMsg])

        const analysis = await analyzeMessage({
          userMessage,
          conversationHistory: [...messages, userMsg],
          userLevel: 5,
        })

        await addMessage({
          conversationId: conversationId as any,
          role: 'user',
          content: userMessage,
          nvcScore: {
            observation: analysis.observation,
            feeling: analysis.feeling,
            need: analysis.need,
            request: analysis.request,
            total: analysis.total,
          },
          feedback: analysis.feedback,
          isJackalLanguage: analysis.isJackalLanguage,
          jackalPhrases: analysis.jackalPhrases,
          giraffeAlternative: analysis.giraffeAlternative,
          whatWentWell: analysis.whatWentWell,
        })

        setMessages((prev) => {
          const updated = [...prev]
          const lastIndex = updated.length - 1
          if (updated[lastIndex]?.role === 'user') {
            updated[lastIndex] = {
              ...updated[lastIndex],
              nvcScore: {
                observation: analysis.observation,
                feeling: analysis.feeling,
                need: analysis.need,
                request: analysis.request,
                total: analysis.total,
              },
              feedback: analysis.feedback,
              whatWentWell: analysis.whatWentWell,
            }
          }
          return updated
        })

        setFeedback({
          score: {
            observation: analysis.observation,
            feeling: analysis.feeling,
            need: analysis.need,
            request: analysis.request,
            total: analysis.total,
          },
          feedback: analysis.feedback,
          whatWentWell: analysis.whatWentWell,
          giraffeAlternative: analysis.giraffeAlternative,
          isJackalLanguage: analysis.isJackalLanguage,
        })

        const characterResponse = await generateCharacterResponse({
          userMessage,
          conversationHistory: messages.concat([
            {
              role: 'user',
              content: userMessage,
              timestamp: Date.now(),
              nvcScore: {
                observation: analysis.observation,
                feeling: analysis.feeling,
                need: analysis.need,
                request: analysis.request,
                total: analysis.total,
              },
            },
          ]),
          scenario: {
            title: scenario.title,
            characterName: scenario.characterName,
            characterPersonality: scenario.characterPersonality,
            characterInitialMood: scenario.characterInitialMood,
            characterBackground: scenario.characterBackground || '',
            characterHiddenNeeds: scenario.characterHiddenNeeds,
          },
          userNVCScore: analysis.total,
          userLevel: 5,
        })

        await addMessage({
          conversationId: conversationId as any,
          role: 'assistant',
          content: characterResponse,
        })

        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: characterResponse,
            timestamp: Date.now(),
          },
        ])
      } catch (error) {
        setFeedback({
          score: { observation: 0, feeling: 0, need: 0, request: 0, total: 0 },
          feedback: 'Error analyzing message. Please try again.',
          whatWentWell: '',
          giraffeAlternative: '',
          isJackalLanguage: false,
        })
      } finally {
        setIsLoading(false)
      }
    },
    [
      conversationId,
      scenario,
      messages,
      analyzeMessage,
      generateCharacterResponse,
      addMessage,
    ],
  )

  const handleCompleteScenario = async () => {
    if (!conversationId || !scenario) return

    try {
      const result = await completeConversation({
        conversationId: conversationId as any,
      })
      setFinalScore(result.finalScore)
      setIsCompleted(true)

      // Calculate stars from final score
      let finalStars = 0
      if (result.finalScore >= 85) finalStars = 3
      else if (result.finalScore >= 70) finalStars = 2
      else if (result.finalScore >= 60) finalStars = 1

      // Determine completion status
      let completionStatus: 'excellent' | 'success' | 'pass' | 'incomplete' =
        'incomplete'
      if (result.finalScore >= 85) completionStatus = 'excellent'
      else if (result.finalScore >= 70) completionStatus = 'success'
      else if (result.finalScore >= 60) completionStatus = 'pass'

      // Calculate average component scores
      const userMessages = messages.filter(
        (m) => m.role === 'user' && m.nvcScore,
      )
      const averageComponentScores =
        userMessages.length > 0
          ? {
              observation:
                userMessages.reduce(
                  (sum, m) => sum + (m.nvcScore?.observation || 0),
                  0,
                ) / userMessages.length,
              feeling:
                userMessages.reduce(
                  (sum, m) => sum + (m.nvcScore?.feeling || 0),
                  0,
                ) / userMessages.length,
              need:
                userMessages.reduce(
                  (sum, m) => sum + (m.nvcScore?.need || 0),
                  0,
                ) / userMessages.length,
              request:
                userMessages.reduce(
                  (sum, m) => sum + (m.nvcScore?.request || 0),
                  0,
                ) / userMessages.length,
            }
          : undefined

      // Determine if this is the first completion (with at least 1 star)
      // It's first completion if:
      // 1. No scenarioProgress exists yet, OR
      // 2. scenarioProgress.status is 'available', 'in_progress', or 'attempted'
      //    (not 'passed' or 'mastered' - which means at least 1 star earned)
      const isFirstCompletion =
        !scenarioProgress ||
        (scenarioProgress.status !== 'passed' &&
          scenarioProgress.status !== 'mastered')

      // Determine scenario progress status
      // Only mark as 'passed' or 'mastered' if score >= 60 (at least 1 star)
      // Otherwise mark as 'attempted'
      let scenarioStatus: 'attempted' | 'passed' | 'mastered' = 'attempted'
      if (result.finalScore >= 85) scenarioStatus = 'mastered'
      else if (result.finalScore >= 60) scenarioStatus = 'passed'

      // Update scenario progress (for displaying on practice page)
      await updateScenarioProgress({
        scenarioId: scenarioId as Id<'scenarios'>,
        score: result.finalScore,
        stars: finalStars,
        status: scenarioStatus,
        conversationId: conversationId as Id<'conversations'>,
        objectivesCompleted: [],
        // TODO: Implement learning objectives tracking by comparing component scores against scenario requirements
      })

      // Update user overall progress (for level, points, streaks)
      await updateUserProgress({
        scenarioId: scenarioId,
        finalScore: result.finalScore,
        finalStars,
        completionStatus,
        averageComponentScores,
        isFirstCompletion,
      })
    } catch (error) {
      // Error handling already shown to user via UI feedback
    }
  }

  const handleStartNewConversation = async () => {
    if (!currentUser || !scenario) return

    try {
      if (conversationId) {
        await abandonConversation({ conversationId: conversationId as any })
      }

      const newConversationId = await createConversation({
        userId: currentUser._id,
        scenarioId: scenarioId as any,
      })

      navigate({
        to: `/practice/${scenarioId}/conversation/${newConversationId}`,
        search: {
          view: undefined,
          dailyChallengeId: undefined,
        },
      })

      setMessages([
        {
          role: 'assistant',
          content: scenario.aiOpeningMessage,
          timestamp: Date.now(),
        },
      ])
      setFeedback(null)
      setIsCompleted(false)
      setConversationStarted(true)
    } catch (error) {
      // Error handling already managed
    }
  }

  const handleRetry = async () => {
    await handleStartNewConversation()
  }

  const handleNext = () => {
    navigate({ to: '/practice' })
  }

  const handleViewTranscript = () => {
    // TODO: Implement transcript viewing functionality
  }

  if (!scenario || currentUser === undefined) {
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
          <p className="text-brown-600">
            {currentUser === undefined
              ? 'Initializing...'
              : 'Loading scenario...'}
          </p>
        </div>
      </div>
    )
  }

  if (isCompleted) {
    return (
      <ScenarioResults
        finalScore={finalScore}
        scenarioTitle={scenario.title}
        messageCount={messages.length}
        onRetry={handleRetry}
        onNext={handleNext}
        onViewTranscript={handleViewTranscript}
      />
    )
  }

  return (
    <div className="h-screen bg-cream flex flex-col pt-24">
      {isArchiveMode && (
        <div className="bg-blue-50 border-b-2 border-blue-300 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <div className="text-blue-700 font-semibold">
              Viewing Completed Conversation
            </div>
            <p className="text-blue-600 text-sm">
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
                className="text-nowrap text-xl text-giraffe-600 underline cursor-pointer"
              >
                View Scenario
              </button>
            )}
          </div>
          <p className="text-giraffe-700 text-sm">
            Practicing with <strong>{scenario.characterName}</strong>
          </p>
        </div>
      </div>

      {!conversationStarted && conversation === null && (
        <div className="bg-linear-to-b from-giraffe-100 to-cream px-6 py-8 border-b border-giraffe-200 flex-shrink-0 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="bg-white rounded-lg border-2 border-giraffe-200 p-6">
              <h2 className="text-lg font-bold text-brown-800 mb-3">
                Situation
              </h2>
              <p className="text-brown-700 leading-relaxed mb-4">
                {scenario.situation}
              </p>

              <h3 className="text-sm font-bold text-giraffe-700 mt-4 mb-2">
                What You'll Practice:
              </h3>
              <ul className="space-y-1 mb-6">
                {scenario.learningObjectives.map(
                  (goal: string, idx: number) => (
                    <li
                      key={idx}
                      className="text-sm text-brown-700 flex items-start gap-2"
                    >
                      <span className="text-giraffe-500 mt-0.5">•</span>
                      <span>{goal}</span>
                    </li>
                  ),
                )}
              </ul>

              <div className="bg-blue-50 border border-blue-300 rounded-lg p-3 text-sm text-blue-800">
                <strong>Tip:</strong> Remember to express your observations,
                feelings, needs, and requests clearly.
              </div>
            </div>

            <Button
              onClick={handleStartNewConversation}
              variant="primary"
              size="lg"
              className="w-full"
            >
              Start Conversation
            </Button>
          </div>
        </div>
      )}

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
              {(() => {
                const userMessages = messages.filter((m) => m.role === 'user')
                const lastUserMessage = userMessages[userMessages.length - 1]
                const lastScore = lastUserMessage.nvcScore?.total || 0
                const canEndConversation =
                  messages.length > 3 &&
                  !isArchiveMode &&
                  (lastScore >= 70 || messages.length >= 10)

                return (
                  canEndConversation && (
                    <Button
                      onClick={handleCompleteScenario}
                      variant="secondary"
                      className="w-full"
                    >
                      End & Get Results
                    </Button>
                  )
                )
              })()}

              <MessageInput
                onSubmit={handleSendMessage}
                isLoading={isLoading}
                disabled={isLoading || isArchiveMode}
                onStartOver={handleStartNewConversation}
              />
            </div>
          </div>

          <div className="w-80 hidden lg:flex flex-col min-w-0 p-6 overflow-hidden">
            <FeedbackPanel
              feedback={feedback}
              isLoading={isLoading}
              messageCount={messages.filter((m) => m.role === 'user').length}
              learningObjectives={scenario.learningObjectives}
              characterMood={
                conversation?.currentCharacterMood ||
                scenario.characterInitialMood ||
                0
              }
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
                className="w-full flex items-center justify-between gap-2 text-giraffe-700 hover:text-giraffe-800 font-semibold text-sm"
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
              <div className="bg-linear-to-r from-giraffe-600 to-giraffe-500 text-white px-4 py-4 flex items-center justify-between">
                <h2 className="font-bold text-lg">Live Feedback</h2>
                <button
                  onClick={() => setMobileFeedbackExpanded(false)}
                  className="text-white hover:text-giraffe-100 transition-colors"
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
                  messageCount={
                    messages.filter((m) => m.role === 'user').length
                  }
                  learningObjectives={scenario.learningObjectives}
                  characterMood={
                    conversation?.currentCharacterMood ||
                    scenario.characterInitialMood ||
                    0
                  }
                />
              </div>

              <div className="border-t border-giraffe-200 bg-white px-4 py-3">
                <button
                  onClick={() => setMobileFeedbackExpanded(false)}
                  className="w-full bg-giraffe-600 hover:bg-giraffe-700 text-white font-semibold py-3 rounded-lg transition-colors"
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
              <div className="bg-linear-to-r from-giraffe-600 to-giraffe-500 text-white px-6 py-4 sticky top-0 flex items-center justify-between">
                <h2 className="text-xl font-bold">Scenario Context</h2>
                <Dialog.Close asChild>
                  <button
                    className="text-white hover:text-giraffe-100 transition-colors p-1"
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
                  <h3 className="text-sm font-bold text-giraffe-700 mb-3">
                    What You'll Practice:
                  </h3>
                  <ul className="space-y-2">
                    {scenario.learningObjectives.map(
                      (goal: string, idx: number) => (
                        <li
                          key={idx}
                          className="text-sm text-brown-700 flex items-start gap-2"
                        >
                          <span className="text-giraffe-500 mt-0.5">•</span>
                          <span>{goal}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 text-sm text-blue-800">
                  <strong>Tip:</strong> Remember to express your observations,
                  feelings, needs, and requests clearly.
                </div>
              </div>

              <div className="border-t border-giraffe-200 bg-cream px-6 py-4">
                <Dialog.Close asChild>
                  <button className="w-full bg-giraffe-600 hover:bg-giraffe-700 text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer">
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

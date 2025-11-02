import { createFileRoute } from '@tanstack/react-router'
import { useAction, useMutation, useQuery } from 'convex/react'
import { useCallback, useEffect, useState } from 'react'
import { api } from '../../../convex/_generated/api'
import type { Message } from '~/components/features/roleplay/ConversationView'
import type { FeedbackData } from '~/components/features/roleplay/FeedbackPanel'
import { ConversationView } from '~/components/features/roleplay/ConversationView'
import { FeedbackPanel } from '~/components/features/roleplay/FeedbackPanel'
import { MessageInput } from '~/components/features/roleplay/MessageInput'
import { ScenarioResults } from '~/components/features/roleplay/ScenarioResults'
import { Button } from '~/components/ui/Button'

export const Route = createFileRoute('/practice/roleplay/$id')({
  component: RoleplayComponent,
})

function RoleplayComponent() {
  const { id: scenarioId } = Route.useParams()
  const navigate = Route.useNavigate()

  const currentUser = useQuery(api.users.getCurrentUser)

  // Queries and Mutations
  const scenario = useQuery(api.scenarios.getById, {
    scenarioId: scenarioId as any,
  })

  // Only query for active conversation if we have valid IDs
  // Use "skip" to skip the query when IDs and user are not ready
  const conversation = useQuery(
    api.conversations.getActive,
    currentUser && scenarioId
      ? {
          userId: currentUser._id,
          scenarioId: scenarioId as any,
        }
      : 'skip',
  )

  // Actions (for AI)
  const analyzeMessage = useAction(api.ai.analyzeNVCResponse)
  const generateCharacterResponse = useAction(api.ai.generateCharacterResponse)

  // Mutations
  const createConversation = useMutation(api.conversations.create)
  const addMessage = useMutation(api.conversations.addMessage)
  const completeConversation = useMutation(api.conversations.complete)
  const abandonConversation = useMutation(api.conversations.abandon)

  // Local state
  const [messages, setMessages] = useState<Array<Message>>([])
  const [feedback, setFeedback] = useState<FeedbackData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [finalScore, setFinalScore] = useState(0)

  const [conversationId, setConversationId] = useState<any | null>(null)
  const [conversationStarted, setConversationStarted] = useState(false)
  const [mobileFeedbackExpanded, setMobileFeedbackExpanded] = useState(false)
  const [showScenarioContext, setShowScenarioContext] = useState(false)

  useEffect(() => {
    if (!scenario || !currentUser) return

    // If there's an existing in-progress conversation, load it and auto-start
    if (conversation && conversation.status === 'in_progress') {
      setConversationId(conversation._id)
      setConversationStarted(true) // Auto-start the chat view

      // Load messages if they exist
      if (conversation.messages && Array.isArray(conversation.messages) && conversation.messages.length > 0) {
        setMessages(conversation.messages)

        // Restore feedback from the last user message that has feedback
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
        // No messages yet - initialize with AI opening message
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

        // Step 1: Analyze message
        const analysis = await analyzeMessage({
          userMessage,
          conversationHistory: [...messages, userMsg],
          userLevel: 5, // Dev user level
        })

        // Step 2: Add user message with score (backend)
        await addMessage({
          conversationId,
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

        // Update user message with score and feedback
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

        // Display feedback
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

        // Step 3: Generate character response
        // Use the current messages state which now includes the user message with scores
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
            characterEmotionalState: scenario.characterEmotionalState,
            characterBackground: scenario.characterBackground,
            characterHiddenNeeds: scenario.characterHiddenNeeds,
          },
          userNVCScore: analysis.total,
          userLevel: 5, // Dev user level
        })

        // Step 4: Add character response
        await addMessage({
          conversationId,
          role: 'assistant',
          content: characterResponse,
        })

        // Update local messages
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: characterResponse,
            timestamp: Date.now(),
          },
        ])

        // Check if conversation should end (arbitrary: 8 exchanges = 16 messages)
        if (messages.length >= 15) {
          // Allow user to complete or continue
          // For now, we'll let them continue indefinitely
        }
      } catch (error) {
        console.error('Error sending message:', error)
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
    if (!conversationId) return

    try {
      const result = await completeConversation({ conversationId })
      setFinalScore(result.finalScore)
      setIsCompleted(true)
    } catch (error) {
      console.error('Error completing conversation:', error)
    }
  }

  const handleStartNewConversation = async () => {
    if (!currentUser || !scenario) return

    try {
      if (conversationId) {
        await abandonConversation({ conversationId })
      }

      // Create a new conversation
      const newConversationId = await createConversation({
        userId: currentUser._id,
        scenarioId: scenarioId as any,
      })

      setConversationId(newConversationId)

      // Initialize with AI opening message
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
      console.error('Error starting new conversation:', error)
    }
  }

  const handleRetry = async () => {
    // Retry after completing a scenario - same as start new
    await handleStartNewConversation()
  }

  const handleNext = () => {
    navigate({ to: '/practice' })
  }

  const handleViewTranscript = () => {
    // TODO: Implement transcript view
    console.log('View transcript')
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
    <div className="h-screen bg-cream flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-giraffe-600 to-giraffe-500 text-white px-6 py-4 shadow-md flex-shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{scenario.title}</h1>
            <p className="text-giraffe-100 text-sm">
              Practicing with <strong>{scenario.characterName}</strong>
            </p>
          </div>
          <button
            onClick={() => navigate({ to: '/practice' })}
            className="text-giraffe-100 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Scenario Brief - Show only if conversation hasn't started AND there's no existing conversation (but not while loading) */}
      {!conversationStarted && conversation === null && (
        <div className="bg-gradient-to-b from-giraffe-100 to-cream px-6 py-8 border-b border-giraffe-200 flex-shrink-0 overflow-y-auto">
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
                {scenario.learningGoals.map((goal, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-brown-700 flex items-start gap-2"
                  >
                    <span className="text-giraffe-500 mt-0.5">•</span>
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-blue-50 border border-blue-300 rounded-lg p-3 text-sm text-blue-800">
                <strong>Tip:</strong> Remember to express your observations,
                feelings, needs, and requests clearly.
              </div>
            </div>

            {/* Start button for new conversation */}
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

      {/* Main Conversation Area */}
      {conversationStarted && (
        <div className="flex-1 flex overflow-hidden gap-6 max-w-7xl mx-auto w-full">
          {/* Conversation Column */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Scrollable Conversation Messages */}
            <div className="flex-1 overflow-y-auto p-6">
              <ConversationView
                messages={messages}
                characterName={scenario.characterName}
                isLoading={isLoading}
              />
            </div>

            {/* Fixed Bottom Area - Always Visible */}
            <div className="border-t border-giraffe-200 bg-cream px-6 py-4 space-y-3 shrink-0">
              {/* End Conversation Button */}
              {messages.length > 3 && (
                <Button
                  onClick={handleCompleteScenario}
                  variant="secondary"
                  className="w-full"
                >
                  End & Get Results
                </Button>
              )}

              {/* Message Input */}
              <MessageInput
                onSubmit={handleSendMessage}
                isLoading={isLoading}
                disabled={isLoading}
                onStartOver={handleStartNewConversation}
                onViewContext={() => setShowScenarioContext(true)}
              />
            </div>
          </div>

          {/* Feedback Panel */}
          <div className="w-80 hidden lg:flex flex-col min-w-0 p-6 overflow-hidden">
            <FeedbackPanel
              feedback={feedback}
              isLoading={isLoading}
              messageCount={messages.filter((m) => m.role === 'user').length}
            />
          </div>
        </div>
      )}

      {/* Mobile Feedback - Minimized by default */}
      {conversationStarted && (
        <>
          {/* Minimized Feedback Tab */}
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

          {/* Expanded Full-Screen Feedback */}
          {mobileFeedbackExpanded && (
            <div className="lg:hidden fixed inset-0 bg-white z-50 flex flex-col">
              {/* Header */}
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

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <FeedbackPanel
                  feedback={feedback}
                  isLoading={isLoading}
                  messageCount={
                    messages.filter((m) => m.role === 'user').length
                  }
                />
              </div>

              {/* Close Button */}
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

      {/* Scenario Context Modal */}
      {showScenarioContext && conversationStarted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-giraffe-600 to-giraffe-500 text-white px-6 py-4 sticky top-0 flex items-center justify-between">
              <h2 className="text-xl font-bold">Scenario Context</h2>
              <button
                onClick={() => setShowScenarioContext(false)}
                className="text-white hover:text-giraffe-100 transition-colors"
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
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-brown-800 mb-3">
                  Situation
                </h3>
                <p className="text-brown-700 leading-relaxed">
                  {scenario?.situation}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-giraffe-700 mb-3">
                  What You'll Practice:
                </h3>
                <ul className="space-y-2">
                  {scenario?.learningGoals.map((goal, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-brown-700 flex items-start gap-2"
                    >
                      <span className="text-giraffe-500 mt-0.5">•</span>
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 text-sm text-blue-800">
                <strong>Tip:</strong> Remember to express your observations,
                feelings, needs, and requests clearly.
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-giraffe-200 bg-cream px-6 py-4">
              <button
                onClick={() => setShowScenarioContext(false)}
                className="w-full bg-giraffe-600 hover:bg-giraffe-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Continue Conversation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

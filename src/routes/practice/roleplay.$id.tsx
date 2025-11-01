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
import { useDevUser } from '~/hooks/useDevUser'

export const Route = createFileRoute('/practice/roleplay/$id')({
  component: RoleplayComponent,
})

function RoleplayComponent() {
  const { id: scenarioId } = Route.useParams()
  const navigate = Route.useNavigate()

  // Development user - will be replaced with real auth
  const { userId, isLoading: userLoading } = useDevUser()

  // Queries and Mutations
  const scenario = useQuery(api.scenarios.getById, {
    scenarioId: scenarioId as any,
  })

  // Only query for active conversation if we have valid IDs
  // Use "skip" to skip the query when IDs and user are not ready
  const conversation = useQuery(
    api.conversations.getActive,
    userId && scenarioId
      ? {
          userId: userId as any,
          scenarioId: scenarioId as any,
        }
      : 'skip'
  )

  // Actions (for AI)
  const analyzeMessage = useAction(api.ai.analyzeNVCResponse)
  const generateCharacterResponse = useAction(api.ai.generateCharacterResponse)

  // Mutations
  const createConversation = useMutation(api.conversations.create)
  const addMessage = useMutation(api.conversations.addMessage)
  const completeConversation = useMutation(api.conversations.complete)

  // Local state
  const [messages, setMessages] = useState<Array<Message>>([])
  const [feedback, setFeedback] = useState<FeedbackData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [finalScore, setFinalScore] = useState(0)

  const [conversationId, setConversationId] = useState<any | null>(null)
  const [conversationStarted, setConversationStarted] = useState(false)

  // Initialize conversation on mount
  useEffect(() => {
    if (!scenario || !conversationStarted) return

    const initConversation = async () => {
      try {
        if (!userId) return
        // Create conversation if it doesn't exist
        let convId: any = conversation?._id
        if (!convId) {
          convId = await createConversation({
            userId: userId as any,
            scenarioId: scenarioId as any,
          })
        }

        setConversationId(convId)

        // Initialize with AI opening message
        const initialMessage: Message = {
          role: 'assistant',
          content: scenario.aiOpeningMessage,
          timestamp: Date.now(),
        }

        setMessages([initialMessage])
      } catch (error) {
        console.error('Failed to initialize conversation:', error)
      }
    }

    initConversation()
  }, [scenario, conversationStarted])

  const handleSendMessage = useCallback(
    async (userMessage: string) => {
      if (!conversationId || !scenario) return

      setIsLoading(true)
      setFeedback(null)

      try {
        // Step 1: Analyze message
        const analysis = await analyzeMessage({
          userMessage,
          conversationHistory: messages,
          userLevel: 5, // Dev user level
        })

        // Step 2: Add user message with score
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

        // Update local messages
        const userMsg: Message = {
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
          feedback: analysis.feedback,
          whatWentWell: analysis.whatWentWell,
        }
        setMessages((prev) => [...prev, userMsg])

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
        const characterResponse = await generateCharacterResponse({
          userMessage,
          conversationHistory: [...messages, userMsg],
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

  const handleRetry = async () => {
    setMessages([])
    setFeedback(null)
    setIsCompleted(false)
    setConversationStarted(false)
    setConversationId(null)
    // Slight delay to ensure state clears
    setTimeout(() => setConversationStarted(true), 100)
  }

  const handleNext = () => {
    navigate({ to: '/practice' })
  }

  const handleViewTranscript = () => {
    // TODO: Implement transcript view
    console.log('View transcript')
  }

  if (!scenario || userLoading) {
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
            {userLoading ? 'Initializing...' : 'Loading scenario...'}
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
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-giraffe-600 to-giraffe-500 text-white px-6 py-4 shadow-md">
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
            ✕
          </button>
        </div>
      </div>

      {/* Scenario Brief */}
      {messages.length === 0 && !conversationStarted && (
        <div className="bg-gradient-to-b from-giraffe-100 to-cream px-6 py-8 border-b border-giraffe-200">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="bg-white rounded-lg border-2 border-giraffe-200 p-6">
              <h2 className="text-lg font-bold text-brown-800 mb-3">
                📋 Situation
              </h2>
              <p className="text-brown-700 leading-relaxed mb-4">
                {scenario.situation}
              </p>

              <h3 className="text-sm font-bold text-giraffe-700 mt-4 mb-2">
                🎯 What You'll Practice:
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
                <strong>💡 Tip:</strong> Remember to express your observations,
                feelings, needs, and requests clearly.
              </div>
            </div>

            <Button
              onClick={() => setConversationStarted(true)}
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
        <div className="flex-1 flex overflow-hidden gap-6 max-w-7xl mx-auto w-full p-6">
          {/* Conversation Column */}
          <div className="flex-1 flex flex-col min-w-0">
            <ConversationView
              messages={messages}
              characterName={scenario.characterName}
              isLoading={isLoading}
            />

            {/* End Conversation Button */}
            {messages.length > 3 && (
              <div className="mt-4 flex gap-3">
                <Button
                  onClick={handleCompleteScenario}
                  variant="secondary"
                  className="flex-1"
                >
                  ✓ End & Get Results
                </Button>
              </div>
            )}

            {/* Message Input */}
            <div className="mt-4 border-t border-giraffe-200 pt-4">
              <MessageInput
                onSubmit={handleSendMessage}
                isLoading={isLoading}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Feedback Panel */}
          <div className="w-80 hidden lg:flex flex-col min-w-0">
            <FeedbackPanel feedback={feedback} isLoading={isLoading} />
          </div>
        </div>
      )}

      {/* Mobile Feedback */}
      {conversationStarted && feedback && (
        <div className="lg:hidden border-t border-giraffe-200 bg-giraffe-50 p-4 max-h-64 overflow-y-auto">
          <FeedbackPanel feedback={feedback} isLoading={false} />
        </div>
      )}
    </div>
  )
}

/**
 * ConversationView Component
 *
 * Main interface for AI roleplay conversation
 * Displays messages, character responses, and feedback
 */

import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

export interface Message {
  id?: string
  role: 'user' | 'assistant'
  content: string
  timestamp?: number
  nvcScore?: {
    observation: number
    feeling: number
    need: number
    request: number
    total: number
  }
  feedback?: string
  whatWentWell?: string
  isJackalLanguage?: boolean
  jackalPhrases?: Array<string>
  giraffeAlternative?: string
  empathyShown?: boolean
  characterMood?: number
}

interface ConversationViewProps {
  messages: Array<Message>
  characterName: string
  isLoading?: boolean
}

/**
 * Render message text with the analysis' jackal phrases gently marked, so the
 * abstract "jackal language" feedback points at the exact words that carried
 * it. The marking is a soft underline, never red ink.
 */
function highlightJackalPhrases(
  content: string,
  phrases: Array<string>,
): ReactNode {
  const escaped = phrases
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  if (escaped.length === 0) return content

  const splitter = new RegExp(`(${escaped.join('|')})`, 'gi')
  const matcher = new RegExp(`^(?:${escaped.join('|')})$`, 'i')

  return content.split(splitter).map((part, i) =>
    matcher.test(part) ? (
      <mark
        key={i}
        title="This might land as judgment or blame"
        className="bg-white/40 text-inherit rounded px-0.5 -mx-0.5 underline decoration-empathy-low decoration-2 underline-offset-2 box-decoration-clone"
      >
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  )
}

function MessageBubble({
  message,
  characterName,
}: {
  message: Message
  characterName: string
}) {
  const isUser = message.role === 'user'
  const jackalPhrases =
    isUser && message.isJackalLanguage ? (message.jackalPhrases ?? []) : []
  const hasHighlights = jackalPhrases.length > 0

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
          isUser
            ? 'bg-linear-to-br from-giraffe-400 to-giraffe-500 text-brown-800'
            : 'bg-linear-to-br from-brown-600 to-brown-700 text-white'
        }`}
      >
        {isUser ? 'You' : characterName.charAt(0)}
      </div>

      {/* Message Content */}
      <div
        className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'} flex-1 max-w-lg`}
      >
        {/* Sender Label */}
        <div className="text-xs font-semibold text-brown-600">
          {isUser ? 'You' : characterName}
        </div>

        {/* Message Bubble */}
        <div
          className={`px-4 py-3 rounded-lg leading-relaxed ${
            isUser
              ? 'bg-linear-to-br from-giraffe-300 to-giraffe-400 text-brown-900 rounded-br-none'
              : 'bg-white border-2 border-giraffe-200 text-brown-800 rounded-bl-none'
          }`}
        >
          {hasHighlights
            ? highlightJackalPhrases(message.content, jackalPhrases)
            : message.content}
        </div>

        {/* One quiet line explaining the marks, only when there are marks */}
        {hasHighlights && (
          <p className="text-[11px] text-brown-500">
            Underlined words may land as judgment or blame.
          </p>
        )}
      </div>
    </div>
  )
}

export function ConversationView({
  messages,
  characterName,
  isLoading = false,
}: ConversationViewProps) {
  const endRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col w-full h-full bg-cream">
      {/* Conversation Messages */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-8 space-y-6 scrollbar-thin scrollbar-thumb-giraffe-400 scrollbar-track-cream">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-brown-800 mb-2">
                Welcome to the Roleplay!
              </h3>
              <p className="text-brown-600 max-w-xs">
                Read the character's message below and respond with your
                message. You'll receive real-time feedback on your NVC
                communication.
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <MessageBubble
                key={index}
                message={message}
                characterName={characterName}
              />
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-linear-to-br from-brown-600 to-brown-700 flex items-center justify-center text-white font-bold text-sm">
                  {characterName.charAt(0)}
                </div>
                <div className="flex flex-col gap-2 items-start flex-1">
                  <div className="text-xs font-semibold text-brown-600">
                    {characterName}
                  </div>
                  <div className="bg-white border-2 border-giraffe-200 rounded-lg rounded-bl-none px-4 py-3 flex gap-2">
                    <div
                      className="w-2 h-2 bg-giraffe-400 rounded-full animate-typing-dot"
                      style={{ animationDelay: '0ms' }}
                    />
                    <div
                      className="w-2 h-2 bg-giraffe-400 rounded-full animate-typing-dot"
                      style={{ animationDelay: '150ms' }}
                    />
                    <div
                      className="w-2 h-2 bg-giraffe-400 rounded-full animate-typing-dot"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Scroll Target */}
        <div ref={endRef} />
      </div>
    </div>
  )
}

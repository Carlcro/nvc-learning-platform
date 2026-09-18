/**
 * TranscriptView Component
 *
 * Full conversation transcript with annotations showing the journey
 * Includes summary stats, mood progression, and export functionality
 */

import { useState } from 'react'
import { AnnotatedMessage } from './AnnotatedMessage'
import { EmpathyMeter } from './EmpathyMeter'
import { Button } from '~/components/ui/Button'

interface NVCScore {
  observation: number
  feeling: number
  need: number
  request: number
  total: number
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  nvcScore?: NVCScore
  feedback?: string
  whatWentWell?: string
  giraffeAlternative?: string
  isJackalLanguage?: boolean
  jackalPhrases?: Array<string>
  characterMood?: number
}

interface TranscriptViewProps {
  messages: Array<Message>
  scenarioTitle: string
  characterName: string
  finalScore: number
  completedAt: number
  initialMood: number
  /** One of the user's messages said another way, shown on that message. */
  reflection?: {
    messageIndex: number
    rewrite: string
    why: string
  } | null
  /** Names where Back leads (the results screen, or the practice hub). */
  backLabel?: string
  onBack: () => void
}

function ExportIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
      />
    </svg>
  )
}

function MoodJourney({
  messages,
  initialMood,
}: {
  messages: Array<Message>
  initialMood: number
}) {
  const moodPoints = [
    { index: 0, mood: initialMood, label: 'Start' },
    ...messages
      .filter((m) => m.role === 'assistant' && m.characterMood !== undefined)
      .map((m, idx) => ({
        index: idx + 1,
        mood: m.characterMood!,
        label: `Response ${idx + 1}`,
      })),
  ]

  const maxMood = 10
  const minMood = -10
  const range = maxMood - minMood

  return (
    <div className="bg-giraffe-50 rounded-lg p-4 border border-giraffe-100">
      <h3 className="text-sm font-semibold text-brown-700 mb-3">Mood Journey</h3>
      <div className="relative h-24">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          <div className="border-b border-giraffe-200 text-xs text-brown-500 text-right pr-2">
            +10
          </div>
          <div className="border-b border-giraffe-200 text-xs text-brown-500 text-right pr-2">
            0
          </div>
          <div className="text-xs text-brown-500 text-right pr-2">-10</div>
        </div>

        {/* Mood line */}
        <svg
          className="absolute inset-0 w-full h-full overflow-visible"
          style={{ left: '24px', width: 'calc(100% - 24px)' }}
        >
          <polyline
            fill="none"
            stroke="url(#moodGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={moodPoints
              .map((point, idx) => {
                const x = (idx / (moodPoints.length - 1 || 1)) * 100
                const y = ((maxMood - point.mood) / range) * 100
                return `${x}%,${y}%`
              })
              .join(' ')}
          />
          <defs>
            <linearGradient id="moodGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E07856" />
              <stop offset="50%" stopColor="#F5B841" />
              <stop offset="100%" stopColor="#7FB069" />
            </linearGradient>
          </defs>
          {moodPoints.map((point, idx) => {
            const x = (idx / (moodPoints.length - 1 || 1)) * 100
            const y = ((maxMood - point.mood) / range) * 100
            const color =
              point.mood >= 3
                ? '#7FB069'
                : point.mood >= 0
                  ? '#F5B841'
                  : '#E07856'
            return (
              <circle
                key={idx}
                cx={`${x}%`}
                cy={`${y}%`}
                r="4"
                fill={color}
                stroke="white"
                strokeWidth="2"
              />
            )
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex justify-between mt-2 text-xs text-brown-600">
        <span>Conversation Start</span>
        <span>Conversation End</span>
      </div>
    </div>
  )
}

function SummaryStats({
  messages,
  finalScore,
}: {
  messages: Array<Message>
  finalScore: number
}) {
  const userMessages = messages.filter((m) => m.role === 'user')
  const userMessagesWithScores = userMessages.filter((m) => m.nvcScore)
  // Counted as what went right, never as a tally of slips: the slips are
  // marked gently on the messages themselves, where they can teach something.
  const giraffeCount = userMessages.filter((m) => !m.isJackalLanguage).length
  const bestTurn = userMessagesWithScores.reduce(
    (best, m) => Math.max(best, m.nvcScore?.total ?? 0),
    0,
  )

  // Components are scored per turn only when attempted (absent = 0), so the
  // average counts attempted turns only; zeros would punish a healthy,
  // spread-out conversation.
  const avgComponent = (key: keyof NVCScore): number | null => {
    const attempts = userMessagesWithScores
      .map((m) => m.nvcScore?.[key] ?? 0)
      .filter((score) => score > 0)
    if (attempts.length === 0) return null
    return attempts.reduce((a, b) => a + b, 0) / attempts.length
  }

  const avgComponents =
    userMessagesWithScores.length > 0
      ? {
          observation: avgComponent('observation'),
          feeling: avgComponent('feeling'),
          need: avgComponent('need'),
          request: avgComponent('request'),
        }
      : null

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg p-4 border border-giraffe-100 text-center">
        <div className="text-2xl font-bold text-giraffe-700">{finalScore}</div>
        <div className="text-xs text-brown-600">Final Score</div>
      </div>
      <div className="bg-white rounded-lg p-4 border border-giraffe-100 text-center">
        <div className="text-2xl font-bold text-brown-700">
          {userMessages.length}
        </div>
        <div className="text-xs text-brown-600">Your Messages</div>
      </div>
      <div className="bg-white rounded-lg p-4 border border-giraffe-100 text-center">
        <div className="text-2xl font-bold text-brown-800">
          {giraffeCount}
          <span className="text-sm font-semibold text-brown-500">
            {' '}
            of {userMessages.length}
          </span>
        </div>
        <div className="text-xs text-brown-600">Free of Blame</div>
      </div>
      <div className="bg-white rounded-lg p-4 border border-giraffe-100 text-center">
        <div className="text-2xl font-bold text-brown-800">{bestTurn}</div>
        <div className="text-xs text-brown-600">Best Single Turn</div>
      </div>

      {avgComponents && (
        <div className="col-span-2 md:col-span-4 bg-white rounded-lg p-4 border border-giraffe-100">
          <h4 className="text-sm font-semibold text-brown-700">
            Average Component Scores
          </h4>
          <p className="text-xs text-brown-500 mb-3">
            Out of 25, across the messages where you used each one. A dot means
            it was not part of this conversation.
          </p>
          <div className="grid grid-cols-4 gap-3">
            {Object.entries(avgComponents).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-lg font-bold text-giraffe-700">
                  {value === null ? '·' : Math.round(value)}
                </div>
                <div className="text-xs text-brown-600 capitalize">{key}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function TranscriptView({
  messages,
  scenarioTitle,
  characterName,
  finalScore,
  completedAt,
  initialMood,
  reflection = null,
  backLabel = 'Back to Practice',
  onBack,
}: TranscriptViewProps) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle')

  const handleExport = async () => {
    const transcript = messages
      .map((m, idx) => {
        const role = m.role === 'user' ? 'You' : characterName
        const score = m.nvcScore ? ` [Score: ${m.nvcScore.total}/100]` : ''
        return `[${idx + 1}] ${role}${score}:\n${m.content}`
      })
      .join('\n\n')

    const exportText = `
CONVERSATION TRANSCRIPT
=======================
Scenario: ${scenarioTitle}
Final Score: ${finalScore}/100
Date: ${new Date(completedAt).toLocaleDateString()}

${transcript}
    `.trim()

    try {
      await navigator.clipboard.writeText(exportText)
      setCopyStatus('copied')
      setTimeout(() => setCopyStatus('idle'), 2000)
    } catch {
      // Fallback for browsers that don't support clipboard API
      console.error('Failed to copy to clipboard')
    }
  }

  const completedDate = new Date(completedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  // Get previous mood for each assistant message
  const getPreviousMood = (index: number): number | undefined => {
    for (let i = index - 1; i >= 0; i--) {
      if (
        messages[i].role === 'assistant' &&
        messages[i].characterMood !== undefined
      ) {
        return messages[i].characterMood
      }
    }
    return initialMood
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-giraffe-50 to-cream pt-24 sm:pt-28">
      {/* Wayfinding row. It sits in the page flow under the floating nav (the
          same shell as the brief), rather than a bar pinned over it. */}
      <div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 text-brown-700 hover:text-brown-900 transition-colors cursor-pointer rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-giraffe-300 focus-visible:ring-offset-2"
            >
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="font-semibold text-sm">{backLabel}</span>
            </button>

            <Button
              onClick={handleExport}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ExportIcon />
              {copyStatus === 'copied' ? 'Copied!' : 'Copy Transcript'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Title Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-brown-800">
            Conversation Transcript
          </h1>
          <p className="text-lg text-giraffe-700">{scenarioTitle}</p>
          <p className="text-sm text-brown-600">{completedDate}</p>
        </div>

        {/* Final Score */}
        <div className="bg-white rounded-xl p-6 border-2 border-giraffe-200">
          <div className="text-center mb-4">
            <span className="text-sm text-brown-600">Final Score</span>
            <div className="text-4xl font-bold text-giraffe-700">
              {finalScore}/100
            </div>
          </div>
          <EmpathyMeter score={finalScore} showLabel={false} />
        </div>

        {/* Mood Journey */}
        <MoodJourney messages={messages} initialMood={initialMood} />

        {/* Summary Stats */}
        <SummaryStats messages={messages} finalScore={finalScore} />

        {/* Messages */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-brown-800">
            Full Conversation
          </h2>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <AnnotatedMessage
                key={index}
                message={message}
                characterName={characterName}
                messageIndex={index}
                reflection={
                  reflection?.messageIndex === index ? reflection : undefined
                }
                previousMood={
                  message.role === 'assistant'
                    ? getPreviousMood(index)
                    : undefined
                }
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 pb-4">
          <Button onClick={onBack} variant="primary">
            {backLabel}
          </Button>
        </div>
      </div>
    </main>
  )
}

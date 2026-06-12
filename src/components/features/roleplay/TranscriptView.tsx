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
          className="absolute inset-0 w-full h-full"
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
  const jackalCount = userMessages.filter((m) => m.isJackalLanguage).length

  const avgComponents =
    userMessagesWithScores.length > 0
      ? {
          observation:
            userMessagesWithScores.reduce(
              (sum, m) => sum + (m.nvcScore?.observation || 0),
              0,
            ) / userMessagesWithScores.length,
          feeling:
            userMessagesWithScores.reduce(
              (sum, m) => sum + (m.nvcScore?.feeling || 0),
              0,
            ) / userMessagesWithScores.length,
          need:
            userMessagesWithScores.reduce(
              (sum, m) => sum + (m.nvcScore?.need || 0),
              0,
            ) / userMessagesWithScores.length,
          request:
            userMessagesWithScores.reduce(
              (sum, m) => sum + (m.nvcScore?.request || 0),
              0,
            ) / userMessagesWithScores.length,
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
          {messages.length}
        </div>
        <div className="text-xs text-brown-600">Total Messages</div>
      </div>
      <div className="bg-white rounded-lg p-4 border border-giraffe-100 text-center">
        <div className="text-2xl font-bold text-brown-800">
          {userMessages.length - jackalCount}
        </div>
        <div className="text-xs text-brown-600">Giraffe Responses</div>
      </div>
      <div className="bg-white rounded-lg p-4 border border-giraffe-100 text-center">
        <div className="text-2xl font-bold text-brown-800">{jackalCount}</div>
        <div className="text-xs text-brown-600">Jackal Responses</div>
      </div>

      {avgComponents && (
        <div className="col-span-2 md:col-span-4 bg-white rounded-lg p-4 border border-giraffe-100">
          <h4 className="text-sm font-semibold text-brown-700 mb-3">
            Average Component Scores
          </h4>
          <div className="grid grid-cols-4 gap-3">
            {Object.entries(avgComponents).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-lg font-bold text-giraffe-700">
                  {Math.round(value)}
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
    <div className="min-h-screen bg-gradient-to-b from-giraffe-50 to-cream">
      {/* Header */}
      <div className="bg-white border-b border-giraffe-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-brown-700 hover:text-brown-900 transition-colors cursor-pointer"
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
              <span className="font-medium">Back</span>
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

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
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
            Back to Practice
          </Button>
        </div>
      </div>
    </div>
  )
}

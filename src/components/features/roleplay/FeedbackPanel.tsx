/**
 * FeedbackPanel Component
 *
 * Right-side panel showing NVC analysis, progress steps, and coaching feedback
 * Design inspired by v0 mockup with giraffe color scheme
 */

import {
  Check,
  Handshake,
  Heart,
  Loader2,
  Sparkles,
  Sprout,
  Star,
} from 'lucide-react'
import type { Milestones } from './MilestoneProgress'
import type { FeedbackData, NVCScore } from './types'

export type { FeedbackData, NVCScore }

interface FeedbackPanelProps {
  feedback: FeedbackData | null
  isLoading?: boolean
  messageCount?: number
  learningObjectives?: Array<string>
  characterMood?: number
  characterName?: string
  milestones?: Milestones
}

function getMoodLabel(mood: number): { label: string; color: string } {
  if (mood >= 6)
    return {
      label: 'Open',
      color: 'bg-empathy-high/20 text-brown-800 border-empathy-high/40',
    }
  if (mood >= 3)
    return {
      label: 'Warming',
      color: 'bg-giraffe-100 text-brown-800 border-giraffe-300',
    }
  if (mood >= 0)
    return {
      label: 'Neutral',
      color: 'bg-cream text-brown-700 border-giraffe-200',
    }
  if (mood >= -6)
    return {
      label: 'Guarded',
      color: 'bg-empathy-low/15 text-brown-800 border-empathy-low/30',
    }
  return {
    label: 'Defensive',
    color: 'bg-empathy-low/25 text-brown-900 border-empathy-low/50',
  }
}

// Mood bar fill, warm and gentle: green when open, gold while warming, soft
// coral when guarded - never an alarming red.
function getMoodFill(mood: number): string {
  if (mood >= 6) return 'bg-empathy-high'
  if (mood >= 3) return 'bg-giraffe-400'
  if (mood >= 0) return 'bg-giraffe-300'
  if (mood >= -6) return 'bg-empathy-low/70'
  return 'bg-empathy-low'
}

/**
 * Live "connection" meter that reflects how open or guarded the character
 * currently feels. Mood ranges from -10 (very closed) to +10 (very open);
 * we map it onto a 0-100% bar that animates as the character reacts.
 */
function MoodMeter({
  mood,
  characterName,
}: {
  mood: number
  characterName?: string
}) {
  const clampedMood = Math.max(-10, Math.min(10, mood))
  const percent = ((clampedMood + 10) / 20) * 100
  const moodInfo = getMoodLabel(clampedMood)
  const who = characterName || 'They'

  return (
    <div className="bg-white rounded-lg p-3.5 border border-giraffe-100 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-brown-800">
          How {who} feels
        </span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${moodInfo.color}`}
        >
          {moodInfo.label}
        </span>
      </div>

      <div className="relative h-3 bg-giraffe-100 rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 ${getMoodFill(
            clampedMood,
          )} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[10px] font-medium text-brown-600">
        <span>Guarded</span>
        <span>Open</span>
      </div>
    </div>
  )
}

function getScoreMessage(score: number): string {
  if (score < 30) return 'Keep Going'
  if (score < 60) return 'Good Progress'
  if (score < 80) return 'Great Work'
  return 'Excellent!'
}

const steps = [
  { key: 'conversationStarted', label: 'Start', Icon: Sparkles },
  { key: 'feelingExpressed', label: 'Feeling', Icon: Heart },
  { key: 'needIdentified', label: 'Need', Icon: Sprout },
  { key: 'requestMade', label: 'Request', Icon: Handshake },
  { key: 'resolutionReached', label: 'Done', Icon: Star },
] as const

function ProgressSteps({ milestones }: { milestones: Milestones }) {
  const completedCount = steps.filter((s) => milestones[s.key]).length
  const totalSteps = steps.length

  // Find current step (first incomplete one)
  let currentStepIndex = steps.findIndex((s) => !milestones[s.key])
  if (currentStepIndex === -1) currentStepIndex = steps.length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-brown-800">Progress</span>
        <span className="text-xs text-brown-500">
          {completedCount}/{totalSteps}
        </span>
      </div>

      <div className="flex items-center justify-between relative">
        {/* Background Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-giraffe-100 mx-6" />
        {/* Active Progress Line */}
        <div
          className="absolute top-5 left-6 h-0.5 bg-empathy-high transition-all duration-500"
          style={{
            width:
              currentStepIndex > 0
                ? `calc(${((currentStepIndex - 1) / (totalSteps - 1)) * 100}% - 0px)`
                : '0%',
          }}
        />

        {steps.map((step, index) => {
          const isCompleted = milestones[step.key]
          const isCurrent = index === currentStepIndex
          const StepIcon = step.Icon

          return (
            <div
              key={step.key}
              className="flex flex-col items-center gap-1.5 relative z-10"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? 'bg-empathy-high text-brown-900 shadow-sm'
                    : isCurrent
                      ? 'bg-giraffe-100 text-brown-800 border-2 border-giraffe-400'
                      : 'bg-giraffe-50 text-brown-400'
                }`}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" strokeWidth={2.5} />
                ) : (
                  <StepIcon className="h-4 w-4" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium ${
                  isCompleted
                    ? 'text-brown-700'
                    : isCurrent
                      ? 'text-brown-700'
                      : 'text-brown-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ScoreSection({ score }: { score: NVCScore }) {
  const scorePercentage = score.total

  const metrics = [
    { label: 'Observation', value: score.observation },
    { label: 'Feeling', value: score.feeling },
    { label: 'Need', value: score.need },
    { label: 'Request', value: score.request },
  ]

  return (
    <div className="bg-giraffe-50/50 rounded-lg p-3.5 space-y-3 border border-giraffe-100">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-lg font-bold text-giraffe-700">
            {getScoreMessage(score.total)}
          </p>
          <p className="text-xs text-brown-500 mt-0.5">
            How this message landed
          </p>
        </div>
        <div className="flex items-baseline gap-0.5 text-brown-500">
          <span className="text-2xl font-semibold">{score.total}</span>
          <span className="text-xs">/100</span>
        </div>
      </div>

      {/* Score Progress Bar */}
      <div className="h-2.5 bg-giraffe-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-giraffe-400 to-giraffe-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${scorePercentage}%` }}
        />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-giraffe-100"
          >
            <span className="text-xs text-brown-500">{metric.label}</span>
            <span className="font-semibold text-sm text-brown-800">
              {metric.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * The model is told to write plain text, but as a safety net we strip any stray
 * markdown so the panel never shows literal ** or backticks to the user.
 */
function cleanText(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1$2')
    .replace(/(^|[\s(])_([^_\n]+)_/g, '$1$2')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/^\s*[-*]\s+/gm, '')
    .trim()
}

function FeedbackNotes({ feedback }: { feedback: FeedbackData }) {
  const strength = cleanText(feedback.whatWentWell)
  const nextStep = cleanText(feedback.feedback)

  if (!strength && !nextStep) {
    return (
      <div className="p-3 bg-giraffe-50 rounded border border-giraffe-100">
        <p className="text-sm text-brown-600 text-center">
          Keep going. Try naming a feeling and the need underneath it.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* What they did well this turn - a light, affirming line */}
      {strength && (
        <div className="flex gap-2.5 items-start">
          <div className="shrink-0 w-5 h-5 rounded-full bg-empathy-high flex items-center justify-center mt-0.5">
            <Check className="h-3 w-3 text-brown-900" strokeWidth={2.5} />
          </div>
          <p className="text-sm text-brown-700 leading-relaxed">{strength}</p>
        </div>
      )}

      {/* The single next step - the heart of the coaching, given prominence */}
      {nextStep && (
        <div className="p-3 bg-giraffe-100/70 rounded-lg border border-giraffe-200">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-brown-600 mb-1">
            Try next
          </p>
          <p className="text-sm text-brown-800 leading-relaxed font-medium">
            {nextStep}
          </p>
        </div>
      )}
    </div>
  )
}

export function FeedbackPanel({
  feedback,
  isLoading = false,
  messageCount: _messageCount = 0,
  learningObjectives: _learningObjectives = [],
  characterMood = 0,
  characterName,
  milestones,
}: FeedbackPanelProps) {
  return (
    <div className="w-full rounded-2xl overflow-hidden bg-giraffe-50 shadow-lg border border-giraffe-100 flex flex-col max-h-full">
      {/* Header */}
      <div className="bg-giraffe-400 px-5 py-4 shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-brown-800">Feedback</h2>
        </div>
      </div>

      {/* Content - hugs its content, scrolls internally only when it would
          otherwise run past the available height */}
      <div className="min-h-0 p-4 space-y-4 overflow-y-auto">
        {/* Live connection meter - always visible so the user can watch the
            character open up or close off as the conversation unfolds */}
        <MoodMeter mood={characterMood} characterName={characterName} />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <Loader2 className="w-8 h-8 text-giraffe-500 animate-spin" />
            <p className="text-sm text-brown-600">Analyzing...</p>
          </div>
        ) : feedback ? (
          <>
            {/* Score Section */}
            <ScoreSection score={feedback.score} />

            {/* Progress Steps */}
            {milestones && <ProgressSteps milestones={milestones} />}

            {/* Feedback Notes */}
            <FeedbackNotes feedback={feedback} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-6 flex-1 ">
            <img
              src="/giraff.png"
              alt="Giraffe - Your NVC Guide"
              className="mx-auto object-contain h-48 w-auto"
            />
            <p className="text-center text-brown-600 text-sm px-2">
              Send a message and I will give you feedback!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

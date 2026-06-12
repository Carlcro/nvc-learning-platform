/**
 * FeedbackPanel Component
 *
 * Right-side panel showing NVC analysis, progress steps, and coaching feedback
 * Design inspired by v0 mockup with giraffe color scheme
 */

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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  )
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  )
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  )
}

function HelpCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function HandHelpingIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
      />
    </svg>
  )
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  )
}

function getMoodLabel(mood: number): { label: string; color: string } {
  if (mood >= 6)
    return {
      label: 'Open',
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    }
  if (mood >= 3)
    return {
      label: 'Warming',
      color: 'bg-giraffe-100 text-giraffe-700 border-giraffe-200',
    }
  if (mood >= 0)
    return {
      label: 'Neutral',
      color: 'bg-blue-100 text-blue-700 border-blue-200',
    }
  if (mood >= -6)
    return {
      label: 'Guarded',
      color: 'bg-orange-100 text-orange-700 border-orange-200',
    }
  return { label: 'Defensive', color: 'bg-red-100 text-red-700 border-red-200' }
}

function getMoodFill(mood: number): string {
  if (mood >= 6) return 'from-emerald-400 to-emerald-500'
  if (mood >= 3) return 'from-giraffe-300 to-giraffe-400'
  if (mood >= 0) return 'from-blue-300 to-blue-400'
  if (mood >= -6) return 'from-orange-300 to-orange-400'
  return 'from-red-400 to-red-500'
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
    <div className="bg-white rounded-lg p-4 border border-giraffe-100 space-y-2.5">
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

      <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getMoodFill(
            clampedMood,
          )} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[10px] font-medium text-brown-400">
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
  { key: 'conversationStarted', label: 'Start', Icon: SparklesIcon },
  { key: 'feelingExpressed', label: 'Feeling', Icon: HeartIcon },
  { key: 'needIdentified', label: 'Need', Icon: HelpCircleIcon },
  { key: 'requestMade', label: 'Request', Icon: HandHelpingIcon },
  { key: 'resolutionReached', label: 'Done', Icon: StarIcon },
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
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 mx-6" />
        {/* Active Progress Line */}
        <div
          className="absolute top-5 left-6 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500"
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
                    ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-md'
                    : isCurrent
                      ? 'bg-giraffe-100 text-giraffe-600 border-2 border-giraffe-400'
                      : 'bg-gray-100 text-gray-400'
                }`}
              >
                {isCompleted ? (
                  <CheckIcon className="h-4 w-4" />
                ) : (
                  <StepIcon className="h-4 w-4" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium ${
                  isCompleted
                    ? 'text-emerald-600'
                    : isCurrent
                      ? 'text-giraffe-600'
                      : 'text-gray-400'
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
    <div className="bg-giraffe-50/50 rounded p-4 space-y-4 border border-giraffe-100">
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
            className="flex items-center justify-between bg-white rounded-lg px-3 py-2.5 border border-giraffe-100"
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

function FeedbackNotes({ feedback }: { feedback: FeedbackData }) {
  const hasPositive = feedback.whatWentWell
  const hasImprovement =
    feedback.feedback ||
    (feedback.isJackalLanguage && feedback.giraffeAlternative)

  if (!hasPositive && !hasImprovement) {
    return (
      <div className="flex gap-3 p-3 bg-gray-50 rounded border border-gray-200">
        <p className="text-sm text-gray-600 text-center w-full">
          Keep practicing! Focus on expressing feelings and needs.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {feedback.whatWentWell && (
        <div className="flex gap-3 p-3 bg-emerald-50 rounded border border-emerald-200">
          <div className="shrink-0 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center mt-0.5">
            <span className="text-white text-xs font-bold">+</span>
          </div>
          <p className="text-sm text-brown-700 leading-relaxed">
            {feedback.whatWentWell}
          </p>
        </div>
      )}

      {feedback.feedback && (
        <div className="flex gap-3 p-3 bg-giraffe-50 rounded border border-giraffe-200">
          <div className="shrink-0 w-5 h-5 rounded-full bg-giraffe-500 flex items-center justify-center mt-0.5">
            <span className="text-white text-xs font-bold">*</span>
          </div>
          <p className="text-sm text-brown-700 leading-relaxed">
            {feedback.feedback}
          </p>
        </div>
      )}

      {feedback.isJackalLanguage && feedback.giraffeAlternative && (
        <div className="flex gap-3 p-3 bg-blue-50 rounded border border-blue-200">
          <div className="shrink-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
            <span className="text-white text-xs font-bold">~</span>
          </div>
          <p className="text-sm text-brown-700 leading-relaxed italic">
            "{feedback.giraffeAlternative}"
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
    <div className="w-full rounded overflow-hidden bg-giraffe-50 shadow-lg border border-giraffe-100 flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-giraffe-400 to-giraffe-500 px-5 py-4">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-giraffe-900">Feedback</h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 space-y-5 overflow-y-auto">
        {/* Live connection meter - always visible so the user can watch the
            character open up or close off as the conversation unfolds */}
        <MoodMeter mood={characterMood} characterName={characterName} />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <div className="animate-spin">
              <svg
                className="w-8 h-8 text-giraffe-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
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

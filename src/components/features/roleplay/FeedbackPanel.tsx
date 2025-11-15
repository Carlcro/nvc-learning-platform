/**
 * FeedbackPanel Component
 *
 * Right-side panel showing NVC analysis, empathy meter, learning objectives, character mood, and coaching tips
 * Provides real-time feedback during conversation with Giraffe mascot coaching
 */

import { EmpathyMeter } from './EmpathyMeter'
import { GiraffeCoach } from './GiraffeCoach'
import type { FeedbackData, NVCScore } from './types'

export type { FeedbackData, NVCScore }

interface FeedbackPanelProps {
  feedback: FeedbackData | null
  isLoading?: boolean
  messageCount?: number
  learningObjectives?: Array<string>
  characterMood?: number
}

function CharacterMoodIndicator({ mood }: { mood: number }) {
  const moodScore = Math.max(-10, Math.min(10, mood))
  const moodPercentage = ((moodScore + 10) / 20) * 100

  let moodLabel = 'Neutral'

  if (moodScore >= 6) {
    moodLabel = 'Open & Warm'
  } else if (moodScore >= 3) {
    moodLabel = 'Warming up'
  } else if (moodScore >= 0) {
    moodLabel = 'Neutral'
  } else if (moodScore >= -6) {
    moodLabel = 'Guarded'
  } else {
    moodLabel = 'Defensive'
  }

  return (
    <div className="bg-brown-50 border border-brown-200 rounded-lg p-4 space-y-3">
      <h3 className="font-semibold text-brown-800 text-sm">Character Mood</h3>
      <div className="space-y-2">
        <p className="text-sm font-semibold text-brown-800">{moodLabel}</p>
        <div className="h-2 bg-brown-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              moodScore >= 3
                ? 'bg-emerald-400'
                : moodScore >= 0
                  ? 'bg-giraffe-400'
                  : 'bg-orange-400'
            }`}
            style={{ width: `${moodPercentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function LearningObjectivesChecklist({
  objectives,
}: {
  objectives: Array<string>
}) {
  const objectiveLabels: Record<string, string> = {
    observation: 'Express Observation',
    feeling: 'Express Feeling',
    need: 'Identify Need',
    request: 'Make Request',
  }

  return (
    <div className="bg-giraffe-50 border border-giraffe-200 rounded-lg p-4 space-y-3">
      <h3 className="font-semibold text-giraffe-900 text-sm">
        Learning Objectives
      </h3>
      <ul className="space-y-2">
        {objectives.map((obj, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm">
            <div className="flex-shrink-0 w-5 h-5 rounded border-2 border-giraffe-400 flex items-center justify-center mt-0.5 bg-giraffe-100">
              <span className="text-giraffe-600 text-xs">•</span>
            </div>
            <span className="text-giraffe-900">
              {objectiveLabels[obj] || obj}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-giraffe-700 italic">
        Practice these in your conversation
      </p>
    </div>
  )
}

export function FeedbackPanel({
  feedback,
  isLoading = false,
  messageCount = 0,
  learningObjectives = [],
  characterMood = 0,
}: FeedbackPanelProps) {
  return (
    <div className="bg-linear-to-b from-giraffe-50 to-cream border-l border-giraffe-200 flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-giraffe-200 bg-linear-to-r from-giraffe-500 to-giraffe-400 text-white sticky top-0">
        <h2 className="font-bold text-lg">Live Feedback</h2>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-6 p-6 overflow-y-auto">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-sm text-brown-600">Analyzing your message...</p>
          </div>
        ) : feedback ? (
          <>
            {/* Empathy Meter */}
            <EmpathyMeter score={feedback.score.total} size="lg" />

            {/* Character Mood */}
            <CharacterMoodIndicator mood={characterMood} />

            {/* Learning Objectives */}
            {learningObjectives.length > 0 && (
              <LearningObjectivesChecklist objectives={learningObjectives} />
            )}

            {/* Giraffe Coach with Progressive Feedback */}
            <GiraffeCoach feedback={feedback} messageCount={messageCount} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <img
              src="/giraff.png"
              alt="Giraffe - Your NVC Guide"
              className="mx-auto object-contain h-80 w-auto"
            />{' '}
            <p className="text-center text-brown-600 text-sm">
              Send a message and I will give you feedback on your NVC
              communication!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

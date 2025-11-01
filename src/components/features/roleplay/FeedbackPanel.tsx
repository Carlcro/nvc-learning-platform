/**
 * FeedbackPanel Component
 *
 * Right-side panel showing NVC analysis, empathy meter, and coaching tips
 * Provides real-time feedback during conversation
 */

import { EmpathyMeter } from './EmpathyMeter'

export interface NVCScore {
  observation: number
  feeling: number
  need: number
  request: number
  total: number
}

export interface FeedbackData {
  score: NVCScore
  feedback: string
  whatWentWell: string
  giraffeAlternative: string
  isJackalLanguage: boolean
}

interface FeedbackPanelProps {
  feedback: FeedbackData | null
  isLoading?: boolean
}

function ScoreComponent({
  label,
  value,
  max = 25,
}: {
  label: string
  value: number
  max?: number
}) {
  const percentage = (value / max) * 100
  const isGood = value >= max * 0.8

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-brown-700">{label}</span>
        <span className={`text-sm font-bold ${isGood ? 'text-emerald-600' : 'text-orange-600'}`}>
          {value}/{max}
        </span>
      </div>
      <div className="h-2 bg-brown-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            isGood ? 'bg-emerald-400' : 'bg-giraffe-400'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  )
}

export function FeedbackPanel({ feedback, isLoading = false }: FeedbackPanelProps) {
  return (
    <div className="bg-gradient-to-b from-giraffe-50 to-cream border-l border-giraffe-200 flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-giraffe-200 bg-gradient-to-r from-giraffe-500 to-giraffe-400 text-white sticky top-0">
        <h2 className="font-bold text-lg">💬 Live Feedback</h2>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-6 p-6 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <div className="animate-spin">
              <svg className="w-8 h-8 text-giraffe-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            {/* NVC Components */}
            <div className="space-y-3">
              <h3 className="font-semibold text-brown-800 text-sm">NVC Components</h3>
              <ScoreComponent label="Observation" value={feedback.score.observation} />
              <ScoreComponent label="Feeling" value={feedback.score.feeling} />
              <ScoreComponent label="Need" value={feedback.score.need} />
              <ScoreComponent label="Request" value={feedback.score.request} />
            </div>

            {/* What Went Well */}
            {feedback.whatWentWell && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <div className="text-lg">✨</div>
                  <div>
                    <h4 className="font-semibold text-emerald-900 text-sm">What Went Well</h4>
                    <p className="text-sm text-emerald-800 mt-1">{feedback.whatWentWell}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Coaching Feedback */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
              <div className="flex items-start gap-2">
                <div className="text-lg">💡</div>
                <div>
                  <h4 className="font-semibold text-blue-900 text-sm">Coaching Tip</h4>
                  <p className="text-sm text-blue-800 mt-1">{feedback.feedback}</p>
                </div>
              </div>
            </div>

            {/* Giraffe Alternative */}
            {feedback.isJackalLanguage && feedback.giraffeAlternative && (
              <div className="bg-giraffe-50 border border-giraffe-300 rounded-lg p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <div className="text-lg">🦒</div>
                  <div>
                    <h4 className="font-semibold text-giraffe-900 text-sm">Giraffe Alternative</h4>
                    <p className="text-sm text-giraffe-800 mt-1 italic">"{feedback.giraffeAlternative}"</p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <div className="text-4xl">🦒</div>
            <p className="text-center text-brown-600 text-sm">
              Send a message to get real-time feedback on your NVC communication!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

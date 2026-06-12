import type { FeedbackData } from './types'

interface GiraffeCoachProps {
  feedback: FeedbackData
  messageCount: number
}

function getCoachingStage(
  messageCount: number,
): 'early' | 'developing' | 'advanced' {
  if (messageCount <= 1) return 'early'
  if (messageCount <= 3) return 'developing'
  return 'advanced'
}

function getEncouragementMessage(
  stage: 'early' | 'developing' | 'advanced',
): string {
  switch (stage) {
    case 'early':
      return "You're getting started! Give it another try and I'll help you refine your approach."
    case 'developing':
      return "Good effort! You're building the muscles. Check the feedback below and try again."
    case 'advanced':
      return "You're learning! Here's some coaching to help you improve further."
  }
}

export function ScoreComponent({
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
        <span
          className={`text-sm font-bold ${isGood ? 'text-brown-800' : 'text-brown-700'}`}
        >
          {value}/{max}
        </span>
      </div>
      <div className="h-2 bg-brown-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            isGood ? 'bg-empathy-high' : 'bg-giraffe-400'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  )
}

export function GiraffeCoach({ feedback, messageCount }: GiraffeCoachProps) {
  const stage = getCoachingStage(messageCount)
  const score = feedback.score.total
  const showAdvancedFeedback = stage === 'advanced' || score < 60

  return (
    <div className="space-y-6">
      {/* Giraffe Coach Header with Encouragement */}
      <div className="flex gap-4">
        <div className="flex flex-col justify-center">
          <h3 className="font-bold text-lg text-giraffe-800 mb-1">
            Giraffe's Coaching
          </h3>
          <p className="text-sm text-brown-700">
            {getEncouragementMessage(stage)}
          </p>
        </div>
        <img
          src="/giraff.png"
          alt="Giraffe Coach"
          className="w-24 h-24 object-contain flex-shrink-0"
        />
      </div>

      {/* Early Stage (High Score): Simple Grid View */}
      {stage === 'early' && score >= 60 ? (
        <div className="bg-giraffe-50 border border-giraffe-200 rounded-lg p-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-giraffe-900 text-sm">
              NVC Score
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-xs text-brown-600">Observation</span>
                <p className="text-lg font-bold text-giraffe-700">
                  {feedback.score.observation}/25
                </p>
              </div>
              <div>
                <span className="text-xs text-brown-600">Feeling</span>
                <p className="text-lg font-bold text-giraffe-700">
                  {feedback.score.feeling}/25
                </p>
              </div>
              <div>
                <span className="text-xs text-brown-600">Need</span>
                <p className="text-lg font-bold text-giraffe-700">
                  {feedback.score.need}/25
                </p>
              </div>
              <div>
                <span className="text-xs text-brown-600">Request</span>
                <p className="text-lg font-bold text-giraffe-700">
                  {feedback.score.request}/25
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Developing/Advanced OR Low Score: Detailed Bar View */
        <div className="space-y-3">
          <h4 className="font-semibold text-brown-800 text-sm">
            NVC Components
          </h4>
          <ScoreComponent
            label="Observation"
            value={feedback.score.observation}
          />
          <ScoreComponent label="Feeling" value={feedback.score.feeling} />
          <ScoreComponent label="Need" value={feedback.score.need} />
          <ScoreComponent label="Request" value={feedback.score.request} />
        </div>
      )}

      {/* Always show What Went Well if present */}
      {feedback.whatWentWell && (
        <div className="bg-empathy-high/15 border border-empathy-high/40 rounded-lg p-3 space-y-2">
          <h4 className="font-semibold text-brown-800 text-sm">
            What Went Well
          </h4>
          <p className="text-sm text-brown-700">{feedback.whatWentWell}</p>
        </div>
      )}

      {/* Show Tips & Alternatives if Advanced OR Low Score */}
      {showAdvancedFeedback && (
        <>
          {feedback.feedback && (
            <div className="bg-giraffe-50 border border-giraffe-200 rounded-lg p-3 space-y-2">
              <h4 className="font-semibold text-brown-800 text-sm">
                Coaching Tip
              </h4>
              <p className="text-sm text-brown-700">{feedback.feedback}</p>
            </div>
          )}

          {feedback.isJackalLanguage && feedback.giraffeAlternative && (
            <div className="bg-giraffe-50 border border-giraffe-300 rounded-lg p-3 space-y-2">
              <h4 className="font-semibold text-giraffe-900 text-sm">
                Giraffe Alternative
              </h4>
              <p className="text-sm text-giraffe-800 italic">
                "{feedback.giraffeAlternative}"
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

/**
 * AnnotatedMessage Component
 *
 * Displays a single message in the transcript with full annotations
 * Shows NVC scores, mood changes, and feedback for user messages
 */

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
  jackalPhrases?: string[]
  characterMood?: number
}

interface AnnotatedMessageProps {
  message: Message
  characterName: string
  messageIndex: number
  previousMood?: number
}

function getMoodLabel(mood: number): string {
  if (mood >= 6) return 'Open & Warm'
  if (mood >= 3) return 'Warming up'
  if (mood >= 0) return 'Neutral'
  if (mood >= -6) return 'Guarded'
  return 'Defensive'
}

function getMoodColor(mood: number): string {
  if (mood >= 3) return 'text-emerald-600'
  if (mood >= 0) return 'text-giraffe-600'
  return 'text-orange-600'
}

function ScoreBar({ score, maxScore = 25 }: { score: number; maxScore?: number }) {
  const percentage = (score / maxScore) * 100
  const color =
    percentage >= 60
      ? 'bg-emerald-400'
      : percentage >= 40
        ? 'bg-giraffe-400'
        : 'bg-orange-400'

  return (
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden flex-1">
      <div
        className={`h-full ${color} transition-all duration-300`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

function NVCScoreBreakdown({ score }: { score: NVCScore }) {
  const components = [
    { label: 'Observation', value: score.observation },
    { label: 'Feeling', value: score.feeling },
    { label: 'Need', value: score.need },
    { label: 'Request', value: score.request },
  ]

  return (
    <div className="bg-giraffe-50 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-giraffe-700">
          NVC Score Breakdown
        </span>
        <span
          className={`text-sm font-bold px-2 py-0.5 rounded-full ${
            score.total >= 70
              ? 'bg-emerald-100 text-emerald-700'
              : score.total >= 50
                ? 'bg-giraffe-100 text-giraffe-700'
                : 'bg-orange-100 text-orange-700'
          }`}
        >
          {score.total}/100
        </span>
      </div>
      {components.map((comp) => (
        <div key={comp.label} className="flex items-center gap-2">
          <span className="text-xs text-gray-600 w-20">{comp.label}</span>
          <ScoreBar score={comp.value} />
          <span className="text-xs font-medium text-gray-700 w-8">
            {comp.value}/25
          </span>
        </div>
      ))}
    </div>
  )
}

export function AnnotatedMessage({
  message,
  characterName,
  messageIndex,
  previousMood,
}: AnnotatedMessageProps) {
  const isUser = message.role === 'user'
  const timestamp = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      className={`p-4 rounded-xl ${
        isUser
          ? 'bg-white border-2 border-giraffe-200'
          : 'bg-gray-50 border border-gray-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              isUser
                ? 'bg-giraffe-100 text-giraffe-700'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {isUser ? 'You' : characterName}
          </span>
          <span className="text-xs text-gray-400">#{messageIndex + 1}</span>
        </div>
        <span className="text-xs text-gray-400">{timestamp}</span>
      </div>

      {/* Message Content */}
      <p className="text-brown-800 leading-relaxed mb-3">{message.content}</p>

      {/* User Message Annotations */}
      {isUser && message.nvcScore && (
        <div className="space-y-3 pt-3 border-t border-giraffe-100">
          <NVCScoreBreakdown score={message.nvcScore} />

          {/* What Went Well */}
          {message.whatWentWell && (
            <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
              <h4 className="text-xs font-semibold text-emerald-700 mb-1">
                What Went Well
              </h4>
              <p className="text-sm text-emerald-800">{message.whatWentWell}</p>
            </div>
          )}

          {/* Jackal Language Warning */}
          {message.isJackalLanguage && message.giraffeAlternative && (
            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
              <h4 className="text-xs font-semibold text-orange-700 mb-1">
                Giraffe Alternative
              </h4>
              <p className="text-sm text-orange-800 italic">
                "{message.giraffeAlternative}"
              </p>
              {message.jackalPhrases && message.jackalPhrases.length > 0 && (
                <div className="mt-2 pt-2 border-t border-orange-200">
                  <span className="text-xs text-orange-600">
                    Phrases to reconsider:{' '}
                  </span>
                  <span className="text-xs text-orange-700">
                    {message.jackalPhrases.join(', ')}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Assistant Message - Mood Indicator */}
      {!isUser && message.characterMood !== undefined && (
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Character Mood:</span>
            <div className="flex items-center gap-2">
              {previousMood !== undefined &&
                previousMood !== message.characterMood && (
                  <span
                    className={`text-xs ${
                      message.characterMood > previousMood
                        ? 'text-emerald-600'
                        : 'text-orange-600'
                    }`}
                  >
                    {message.characterMood > previousMood ? '+' : ''}
                    {message.characterMood - previousMood}
                  </span>
                )}
              <span
                className={`text-sm font-medium ${getMoodColor(message.characterMood)}`}
              >
                {getMoodLabel(message.characterMood)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

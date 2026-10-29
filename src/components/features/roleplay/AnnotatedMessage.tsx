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
  jackalPhrases?: Array<string>
  characterMood?: number
}

interface AnnotatedMessageProps {
  message: Message
  characterName: string
  messageIndex: number
  previousMood?: number
  /** This message said another way, when it is the one chosen for that. */
  reflection?: { rewrite: string; why: string }
}

function getMoodLabel(mood: number): string {
  if (mood >= 6) return 'Open & Warm'
  if (mood >= 3) return 'Warming up'
  if (mood >= 0) return 'Neutral'
  if (mood >= -6) return 'Guarded'
  return 'Defensive'
}

// Valence is carried by the label words and the +/- delta, not color alone -
// our warm greens/corals are too light to pass AA as small text on white.
function getMoodColor(mood: number): string {
  if (mood >= 3) return 'text-brown-800'
  return 'text-brown-700'
}

function ScoreBar({ score, maxScore = 25 }: { score: number; maxScore?: number }) {
  const percentage = (score / maxScore) * 100
  const color =
    percentage >= 60
      ? 'bg-empathy-high'
      : percentage >= 40
        ? 'bg-giraffe-400'
        : 'bg-empathy-low'

  return (
    <div className="h-2 bg-giraffe-100 rounded-full overflow-hidden flex-1">
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
        <span className="text-xs font-semibold text-brown-700">
          NVC Score Breakdown
        </span>
        <span
          className={`text-sm font-bold px-2 py-0.5 rounded-full ${
            score.total >= 70
              ? 'bg-empathy-high/25 text-brown-800'
              : score.total >= 50
                ? 'bg-giraffe-200 text-brown-800'
                : 'bg-empathy-low/25 text-brown-800'
          }`}
        >
          {score.total}/100
        </span>
      </div>
      {/* Only what this message attempted gets a bar. An absent component
          simply was not this turn's job, so it reads as a quiet dot, the same
          way the live panel shows it, never as an empty failing bar. */}
      {components.map((comp) => (
        <div key={comp.label} className="flex items-center gap-2">
          <span className="text-xs text-brown-600 w-20">{comp.label}</span>
          {comp.value > 0 ? (
            <>
              <ScoreBar score={comp.value} />
              <span className="text-xs font-medium text-brown-700 w-10 text-right">
                {comp.value}/25
              </span>
            </>
          ) : (
            <span
              className="text-xs text-brown-400"
              aria-label={`${comp.label}: not part of this message`}
            >
              · not this turn
            </span>
          )}
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
  reflection,
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
          : 'bg-giraffe-50/60 border border-giraffe-100'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              isUser
                ? 'bg-giraffe-100 text-brown-800'
                : 'bg-paper text-brown-700 border border-giraffe-200'
            }`}
          >
            {isUser ? 'You' : characterName}
          </span>
          <span className="text-xs text-brown-500">#{messageIndex + 1}</span>
        </div>
        <span className="text-xs text-brown-500">{timestamp}</span>
      </div>

      {/* Message Content */}
      <p className="text-brown-800 leading-relaxed mb-3">{message.content}</p>

      {/* User Message Annotations */}
      {isUser && message.nvcScore && (
        <div className="space-y-3 pt-3 border-t border-giraffe-100">
          <NVCScoreBreakdown score={message.nvcScore} />

          {/* What Went Well */}
          {message.whatWentWell && (
            <div className="bg-empathy-high/15 rounded-lg p-3 border border-empathy-high/40">
              <h4 className="text-xs font-semibold text-brown-800 mb-1">
                What Went Well
              </h4>
              <p className="text-sm text-brown-700">{message.whatWentWell}</p>
            </div>
          )}

          {/* The coaching hint given at the time: the heart of the feedback,
              and the thing most worth rereading afterwards. */}
          {message.feedback && (
            <div className="bg-giraffe-100/70 rounded-lg p-3 border border-giraffe-200">
              <h4 className="text-xs font-semibold text-brown-800 mb-1">
                The next step suggested
              </h4>
              <p className="text-sm text-brown-800">{message.feedback}</p>
            </div>
          )}

          {/* Words that may have landed as judgment or blame */}
          {message.isJackalLanguage &&
            message.jackalPhrases &&
            message.jackalPhrases.length > 0 && (
              <div className="bg-empathy-low/15 rounded-lg p-3 border border-empathy-low/30">
                <h4 className="text-xs font-semibold text-brown-800 mb-1">
                  Phrases to reconsider
                </h4>
                <p className="text-sm text-brown-700">
                  {message.jackalPhrases.map((phrase, i) => (
                    <span key={i}>
                      {i > 0 && ', '}
                      <span className="italic">"{phrase}"</span>
                    </span>
                  ))}
                </p>
                {message.giraffeAlternative && (
                  <p className="mt-2 pt-2 border-t border-empathy-low/30 text-sm text-brown-700 italic">
                    "{message.giraffeAlternative}"
                  </p>
                )}
              </div>
            )}
        </div>
      )}

      {/* This message said another way (written after the conversation) */}
      {isUser && reflection && (
        <div className="mt-3 bg-white rounded-lg p-3 border-2 border-empathy-high/40">
          <h4 className="text-xs font-semibold text-brown-800 mb-1">
            It could also sound like
          </h4>
          <p className="text-sm text-brown-800 font-medium">
            {reflection.rewrite}
          </p>
          <p className="mt-1.5 text-sm text-brown-600">{reflection.why}</p>
        </div>
      )}

      {/* Assistant Message - Mood Indicator */}
      {!isUser && message.characterMood !== undefined && (
        <div className="pt-3 border-t border-giraffe-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-brown-600">Character Mood:</span>
            <div className="flex items-center gap-2">
              {previousMood !== undefined &&
                previousMood !== message.characterMood && (
                  <span
                    className={`text-xs font-semibold ${
                      message.characterMood > previousMood
                        ? 'text-brown-800'
                        : 'text-brown-600'
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

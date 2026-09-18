import { Card, CardBody } from '~/components/ui/Card'
import { Button } from '~/components/ui/Button'
import { StarIcon } from '~/components/ui/Icons'

export interface ScenarioProgress {
  status?:
    | 'locked'
    | 'available'
    | 'in_progress'
    | 'attempted'
    | 'passed'
    | 'mastered'
  bestStars?: number
  bestScore?: number
  bestConversationId?: string
}

export interface ScenarioCardProps {
  id: string | { __id?: string }
  title: string
  description: string
  category: 'workplace' | 'family' | 'friendship' | 'self_expression'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  characterName: string
  minLevel: number
  userLevel: number
  progress: ScenarioProgress | null
  /** A conversation in this scenario is waiting to be picked up again. */
  hasActiveConversation?: boolean
  /** This is the scenario suggested as the user's next step. */
  isRecommended?: boolean
  onStart: (scenarioId: string | unknown) => void
  onViewBest?: (scenarioId: string | unknown, conversationId: string) => void
  /** When provided, a delete control appears (used for the user's own scenarios). */
  onDelete?: (scenarioId: string | unknown) => void
}

const categoryLabels: Record<string, string> = {
  workplace: 'Workplace',
  family: 'Family',
  friendship: 'Friendship',
  self_expression: 'Self-Expression',
}

// Difficulty reads as a warm ramp: calm green (easy) -> gold (mid) -> coral
// (intense). Every chip carries dark text for guaranteed legibility.
const difficultyChip: Record<string, string> = {
  beginner: 'bg-empathy-high text-brown-900',
  intermediate: 'bg-giraffe-300 text-brown-900',
  advanced: 'bg-empathy-low text-brown-900',
}

const difficultyLabels: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

function renderStars(stars: number) {
  return (
    <span
      className="inline-flex gap-0.5"
      role="img"
      aria-label={`${stars} of 3 stars`}
    >
      {[0, 1, 2].map((i) => (
        <StarIcon
          key={i}
          className={`w-4 h-4 ${i < stars ? 'text-giraffe-700' : 'text-brown-200'}`}
        />
      ))}
    </span>
  )
}

type ScenarioStatus = 'start' | 'in_progress' | 'attempted' | 'completed'

function getStatus(
  progress: ScenarioProgress | null,
  hasActiveConversation: boolean,
): {
  status: ScenarioStatus
  bestStars: number
} {
  const bestStars = progress?.bestStars || 0
  // A waiting conversation wins over any earlier result: picking it back up
  // is the most relevant thing this card can offer.
  if (hasActiveConversation) return { status: 'in_progress', bestStars }
  if (progress?.status === 'passed' || progress?.status === 'mastered') {
    return { status: 'completed', bestStars }
  }
  if (progress?.status === 'attempted') return { status: 'attempted', bestStars }
  if (progress?.status === 'in_progress') {
    return { status: 'in_progress', bestStars }
  }
  return { status: 'start', bestStars }
}

// The status strip is glanceable by color and always legible by dark text.
// Gold = active / mastered, green = passed, coral = keep practicing, brown =
// not yet begun. One meaning per color, every one on the warm palette.
const statusStrip: Record<ScenarioStatus, { label: string; className: string }> =
  {
    start: { label: 'Start', className: 'bg-brown-700 text-cream' },
    in_progress: {
      label: 'In progress',
      className: 'bg-giraffe-400 text-brown-800',
    },
    attempted: {
      label: 'Attempted',
      className: 'bg-empathy-low text-brown-900',
    },
    completed: {
      label: 'Completed',
      className: 'bg-empathy-high text-brown-900',
    },
  }

export function ScenarioCard({
  id,
  title,
  description,
  category,
  difficulty,
  characterName,
  minLevel,
  userLevel,
  progress,
  hasActiveConversation = false,
  isRecommended = false,
  onStart,
  onViewBest,
  onDelete,
}: ScenarioCardProps) {
  const { status, bestStars } = getStatus(progress, hasActiveConversation)
  const hasPassed =
    progress?.status === 'passed' || progress?.status === 'mastered'
  const isCompleted = status === 'completed'
  const isMastered = isCompleted && bestStars === 3
  // Scenarios are never blocked - we simply suggest a level so users know what
  // to expect. They can always jump in.
  const isAboveLevel = userLevel < minLevel

  // Mastery is the gold celebration; an ordinary pass stays calm green.
  const strip = isMastered
    ? { label: 'Mastered', className: 'bg-giraffe-400 text-brown-800' }
    : statusStrip[status]

  const handleViewBest = () => {
    if (progress?.bestConversationId && onViewBest) {
      onViewBest(id, progress.bestConversationId)
    }
  }

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-all duration-200">
      {/* Status strip - color is glanceable, dark text is always legible */}
      <div
        className={`${strip.className} px-6 py-2 text-sm font-bold rounded-t-md flex items-center justify-between gap-2`}
      >
        <span>{strip.label}</span>
        {isRecommended && status !== 'in_progress' && (
          <span className="rounded-full bg-cream text-brown-800 px-2.5 py-0.5 text-xs font-semibold">
            Suggested next
          </span>
        )}
      </div>

      {/* Header */}
      <div className="px-6 py-4 border-b border-giraffe-100">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-brown-600 mb-1">
              {categoryLabels[category]}
            </div>
            <h3 className="text-xl font-bold text-brown-800 text-balance break-words">
              {title}
            </h3>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${difficultyChip[difficulty]}`}
            >
              {difficultyLabels[difficulty]}
            </span>
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(id)}
                aria-label={`Delete ${title}`}
                title="Delete"
                className="grid place-items-center p-2 -mr-1 rounded-lg text-brown-400 hover:text-empathy-low hover:bg-empathy-low/10 transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-empathy-low/40 focus-visible:ring-offset-1"
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="w-4 h-4"
                >
                  <path d="M3.5 5.5h13M8 5.5V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5M6 5.5l.6 9a1.5 1.5 0 0 0 1.5 1.4h3.8a1.5 1.5 0 0 0 1.5-1.4l.6-9M8.5 8.5v5M11.5 8.5v5" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Best result for scenarios that have been passed */}
        {(isCompleted || (status === 'in_progress' && hasPassed)) && (
          <div className="flex items-center gap-2 mt-3 text-sm font-semibold text-brown-700">
            <span>Best: {progress?.bestScore}/100</span>
            {renderStars(bestStars)}
          </div>
        )}
      </div>

      {/* Body */}
      <CardBody className="flex-grow flex flex-col gap-4 justify-between">
        {/* Recommended-level note (non-blocking) */}
        {isAboveLevel && (
          <div className="bg-giraffe-50 border border-giraffe-200 rounded-lg px-3 py-2">
            <p className="text-xs text-brown-700">
              <span className="font-semibold text-brown-800">
                Recommended at Level {minLevel}.
              </span>{' '}
              You can still try it now - it may be more of a stretch.
            </p>
          </div>
        )}

        {/* Description */}
        <p className="text-brown-700 text-sm leading-relaxed break-words">
          {description}
        </p>

        {/* Character Info */}
        <div className="bg-giraffe-50 rounded-lg p-3 border border-giraffe-100">
          <div className="text-xs font-semibold text-brown-700 mb-1">
            Character
          </div>
          <div className="font-semibold text-brown-800 break-words">
            {characterName}
          </div>
        </div>
      </CardBody>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-giraffe-100 bg-giraffe-50 flex gap-2">
        {status === 'in_progress' ? (
          <Button onClick={() => onStart(id)} className="w-full" variant="primary">
            Continue
          </Button>
        ) : isCompleted ? (
          <>
            <Button
              onClick={() => onStart(id)}
              className="flex-1"
              variant="primary"
            >
              {bestStars < 3 ? 'Improve' : 'Try Again'}
            </Button>
            <Button onClick={handleViewBest} variant="outline" className="flex-1">
              View Best
            </Button>
          </>
        ) : status === 'attempted' ? (
          <Button onClick={() => onStart(id)} className="w-full" variant="primary">
            Try Again
          </Button>
        ) : (
          <Button onClick={() => onStart(id)} className="w-full" variant="primary">
            Start
          </Button>
        )}
      </div>
    </Card>
  )
}

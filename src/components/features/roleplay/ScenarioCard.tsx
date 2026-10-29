import { Card } from '~/components/ui/Card'
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

/**
 * One quiet line of status. Text carries the meaning, the small dot only
 * echoes it, so nothing here relies on color and nothing reads as a grade.
 */
const statusLine: Record<
  Exclude<ScenarioStatus, 'start'>,
  { label: string; dot: string }
> = {
  in_progress: { label: 'In progress', dot: 'bg-giraffe-500' },
  attempted: { label: 'Tried once', dot: 'bg-brown-300' },
  completed: { label: 'Completed', dot: 'bg-empathy-high' },
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
  // Scenarios are never blocked. The level only says what to expect.
  const isAboveLevel = userLevel < minLevel
  const showStars = isCompleted || (status === 'in_progress' && hasPassed)

  const action =
    status === 'in_progress'
      ? 'Continue'
      : isCompleted
        ? bestStars < 3
          ? 'Improve'
          : 'Try again'
        : status === 'attempted'
          ? 'Try again'
          : 'Start'

  const handleViewBest = () => {
    if (progress?.bestConversationId && onViewBest) {
      onViewBest(id, progress.bestConversationId)
    }
  }

  return (
    // The whole card is the start target: the action button's ::after
    // stretches over the card, and the smaller controls sit above it.
    <Card
      className={`group relative flex flex-col h-full p-6 cursor-pointer transition-colors duration-200 hover:border-giraffe-300 has-[button:focus-visible]:ring-2 has-[button:focus-visible]:ring-giraffe-400 has-[button:focus-visible]:ring-offset-2 ${
        isRecommended && status !== 'in_progress' ? 'border-giraffe-300' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="text-sm text-brown-600">
          {categoryLabels[category]}, {difficultyLabels[difficulty].toLowerCase()}
        </p>
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(id)}
            aria-label={`Delete ${title}`}
            title="Delete"
            className="relative z-10 grid place-items-center p-2 -m-2 rounded-lg text-brown-400 hover:text-brown-800 hover:bg-giraffe-50 transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-giraffe-300"
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

      <h3 className="text-xl font-bold text-brown-800 text-balance break-words">
        {title}
      </h3>
      <p className="mt-1 text-sm font-semibold text-brown-700 break-words">
        with {characterName}
      </p>

      <p className="mt-3 text-brown-700 text-sm leading-relaxed break-words line-clamp-4">
        {description}
      </p>

      {isAboveLevel && (
        <p className="mt-3 text-xs text-brown-600">
          Usually tried from level {minLevel}. Open to you now if you want a
          stretch.
        </p>
      )}

      <div className="mt-auto pt-5 flex items-center justify-between gap-3">
        <div className="min-w-0 text-sm text-brown-700">
          {status !== 'start' && (
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`h-2 w-2 rounded-full ${statusLine[status].dot}`}
              />
              {statusLine[status].label}
            </span>
          )}
          {status === 'start' && isRecommended && (
            <span className="font-semibold text-giraffe-800">
              Suggested next
            </span>
          )}
          {showStars && <span className="ml-2">{renderStars(bestStars)}</span>}
          {isCompleted && progress?.bestConversationId && onViewBest && (
            <button
              type="button"
              onClick={handleViewBest}
              className="relative z-10 block mt-1 text-sm font-semibold text-brown-700 underline decoration-giraffe-400 decoration-2 underline-offset-4 hover:text-brown-900 cursor-pointer"
            >
              View your best
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => onStart(id)}
          className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-lg px-1 py-2 font-semibold text-brown-800 cursor-pointer focus-visible:outline-none after:absolute after:inset-0 after:rounded-lg after:content-['']"
        >
          {action}
          <span className="sr-only">: {title}</span>
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            className="w-4 h-4 text-giraffe-700 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:translate-x-0"
          >
            <path
              fillRule="evenodd"
              d="M7.3 4.3a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4-1.4L11.58 10 7.3 5.7a1 1 0 0 1 0-1.4Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </Card>
  )
}

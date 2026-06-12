import { Card, CardBody } from '~/components/ui/Card'
import { Button } from '~/components/ui/Button'

export interface ScenarioCardProps {
  id: string | { __id?: string }
  title: string
  description: string
  category: 'workplace' | 'family' | 'friendship' | 'self_expression'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  characterName: string
  minLevel: number
  userLevel: number
  progress: any | null
  onStart: (scenarioId: string | unknown) => void
  onViewBest?: (scenarioId: string | unknown, conversationId: string) => void
}

const categoryLabels: Record<string, string> = {
  workplace: 'Workplace',
  family: 'Family',
  friendship: 'Friendship',
  self_expression: 'Self-Expression',
}

const difficultyColors: Record<string, string> = {
  beginner: 'bg-emerald-100 text-emerald-800',
  intermediate: 'bg-giraffe-100 text-giraffe-800',
  advanced: 'bg-empathy-low text-white',
}

const difficultyLabels: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

function renderStars(stars: number) {
  return (
    <div className="flex gap-0.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={i < stars ? 'text-yellow-400' : 'text-gray-300'}
        >
          ★
        </span>
      ))}
    </div>
  )
}

type ScenarioStatus = 'start' | 'in_progress' | 'attempted' | 'completed'

function getStatus(progress: any | null): {
  status: ScenarioStatus
  bestStars: number
} {
  const bestStars = progress?.bestStars || 0
  if (progress?.status === 'passed' || progress?.status === 'mastered') {
    return { status: 'completed', bestStars }
  }
  if (progress?.status === 'attempted') return { status: 'attempted', bestStars }
  if (progress?.status === 'in_progress') {
    return { status: 'in_progress', bestStars }
  }
  return { status: 'start', bestStars }
}

const statusBadge: Record<ScenarioStatus, { label: string; bg: string }> = {
  start: { label: 'START', bg: 'bg-giraffe-600' },
  in_progress: { label: 'IN PROGRESS', bg: 'bg-giraffe-600' },
  attempted: { label: 'ATTEMPTED', bg: 'bg-amber-600' },
  completed: { label: 'COMPLETED', bg: 'bg-emerald-600' },
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
  onStart,
  onViewBest,
}: ScenarioCardProps) {
  const { status, bestStars } = getStatus(progress)
  const isCompleted = status === 'completed'
  // Scenarios are never blocked - we simply suggest a level so users know what
  // to expect. They can always jump in.
  const isAboveLevel = userLevel < minLevel

  const badge = statusBadge[status]
  const label = isCompleted && bestStars === 3 ? 'MASTERED' : badge.label

  const handleViewBest = () => {
    if (progress?.bestConversationId && onViewBest) {
      onViewBest(id, progress.bestConversationId)
    }
  }

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-all duration-200">
      {/* Status Badge */}
      <div className={`${badge.bg} px-6 py-2 text-white`}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold">{label}</span>
          {isCompleted && (
            <div className="flex gap-0.5">{renderStars(bestStars)}</div>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="bg-linear-to-r from-giraffe-500 to-giraffe-400 px-6 py-4 text-white">
        <div className="flex items-start justify-between gap-3 mb-1">
          <div>
            <div className="text-sm font-semibold text-giraffe-50 mb-1">
              {categoryLabels[category]}
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${difficultyColors[difficulty]}`}
          >
            {difficultyLabels[difficulty]}
          </div>
        </div>

        {/* Best score display for completed scenarios */}
        {isCompleted && (
          <div className="text-sm font-semibold text-white mt-2">
            Best: {progress.bestScore}/100
          </div>
        )}
      </div>

      {/* Body */}
      <CardBody className="flex-grow flex flex-col gap-4 justify-between">
        {/* Recommended-level note (non-blocking) */}
        {isAboveLevel && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <p className="text-xs text-amber-800">
              <span className="font-semibold">Recommended at Level {minLevel}.</span>{' '}
              You can still try it now - it may be more of a stretch.
            </p>
          </div>
        )}

        {/* Description */}
        <p className="text-brown-700 text-sm leading-relaxed">{description}</p>

        {/* Character Info */}
        <div className="bg-giraffe-50 rounded-lg p-3 border border-giraffe-100">
          <div className="text-xs font-semibold text-giraffe-700 mb-1">
            Character
          </div>
          <div className="font-semibold text-brown-800">{characterName}</div>
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

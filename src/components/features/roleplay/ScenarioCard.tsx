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
  isLocked: boolean
  progress: any | null
  onStart: (scenarioId: string | unknown) => void
  onViewBest?: (scenarioId: string | unknown, conversationId: string) => void
  requiredScenarioName?: string
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

function getStatusLabel(
  isLocked: boolean,
  isCompleted: boolean,
  isAttempted: boolean,
  isInProgress: boolean,
  bestStars: number,
): string {
  if (isLocked) {
    return 'LOCKED'
  }
  if (isCompleted) {
    if (bestStars === 3) {
      return 'MASTERED'
    }
    if (bestStars === 2) {
      return 'COMPLETED'
    }
    return 'COMPLETED'
  }
  if (isAttempted) {
    return 'ATTEMPTED'
  }
  if (isInProgress) {
    return 'IN PROGRESS'
  }
  return 'START'
}

function getStatusBgColor(
  isLocked: boolean,
  isCompleted: boolean,
  isAttempted: boolean,
  bestStars: number,
): string {
  if (isLocked) {
    return 'bg-gray-400'
  }
  if (isCompleted) {
    if (bestStars === 3) {
      return 'bg-emerald-600'
    }
    return 'bg-emerald-600'
  }
  if (isAttempted) {
    return 'bg-amber-600'
  }
  return 'bg-giraffe-600'
}

export function ScenarioCard({
  id,
  title,
  description,
  category,
  difficulty,
  characterName,
  minLevel,
  isLocked,
  progress,
  onStart,
  onViewBest,
  requiredScenarioName,
}: ScenarioCardProps) {
  const isCompleted =
    progress && (progress.status === 'passed' || progress.status === 'mastered')
  const isAttempted = progress && progress.status === 'attempted'
  const isInProgress = progress && progress.status === 'in_progress'
  const bestStars = progress?.bestStars || 0

  const handleViewBest = () => {
    if (progress?.bestConversationId && onViewBest) {
      onViewBest(id, progress.bestConversationId)
    }
  }

  const statusLabel = getStatusLabel(
    isLocked,
    isCompleted,
    isAttempted,
    isInProgress,
    bestStars,
  )
  const statusBgColor = getStatusBgColor(isLocked, isCompleted, isAttempted, bestStars)

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-all duration-200">
      {/* Status Badge */}
      <div className={`${statusBgColor} px-6 py-2 text-white`}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold">{statusLabel}</span>
          {isCompleted && (
            <div className="flex gap-0.5">{renderStars(bestStars)}</div>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-giraffe-500 to-giraffe-400 px-6 py-4 text-white">
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
        {/* Description */}
        <p className="text-brown-700 text-sm leading-relaxed">{description}</p>

        {/* Character Info */}
        <div className="bg-giraffe-50 rounded-lg p-3 border border-giraffe-100">
          <div className="text-xs font-semibold text-giraffe-700 mb-1">
            Character
          </div>
          <div className="font-semibold text-brown-800">{characterName}</div>
        </div>

        {/* Unlock requirement */}
        {isLocked && (
          <div className="pt-2 border-t border-giraffe-100">
            <div className="text-xs font-semibold text-empathy-low mb-1">
              Unlock Requirements
            </div>
            <p className="text-xs text-brown-700">
              {requiredScenarioName
                ? `Complete "${requiredScenarioName}" to unlock`
                : `Reach Level ${minLevel} to unlock`}
            </p>
          </div>
        )}
      </CardBody>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-giraffe-100 bg-giraffe-50 flex gap-2">
        {isLocked ? (
          <Button disabled className="w-full" variant="outline">
            Unlock at Level {minLevel}
          </Button>
        ) : isInProgress ? (
          <Button
            onClick={() => onStart(id)}
            className="w-full"
            variant="primary"
          >
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
            <Button
              onClick={handleViewBest}
              variant="outline"
              className="flex-1"
            >
              View Best
            </Button>
          </>
        ) : isAttempted ? (
          <Button
            onClick={() => onStart(id)}
            className="w-full"
            variant="primary"
          >
            Try Again
          </Button>
        ) : (
          <Button
            onClick={() => onStart(id)}
            className="w-full"
            variant="primary"
          >
            Start
          </Button>
        )}
      </div>
    </Card>
  )
}

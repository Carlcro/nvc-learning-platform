import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'

interface DailyChallengeCardProps {
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  characterName: string
  learningObjectives: string[]
  completed?: boolean
  completedScore?: number
  scenarioId: string
  challengeId: string
}

const difficultyConfig = {
  easy: {
    label: 'Beginner',
    color: 'bg-green-50 border-green-200',
    badge: 'text-green-700 bg-green-100',
  },
  medium: {
    label: 'Intermediate',
    color: 'bg-amber-50 border-amber-200',
    badge: 'text-amber-700 bg-amber-100',
  },
  hard: {
    label: 'Advanced',
    color: 'bg-red-50 border-red-200',
    badge: 'text-red-700 bg-red-100',
  },
}

const componentEmojis: Record<string, string> = {
  observation: 'O',
  feeling: 'F',
  need: 'N',
  request: 'R',
}

export function DailyChallengeCard({
  title,
  description,
  difficulty,
  characterName,
  learningObjectives,
  completed,
  completedScore,
  scenarioId,
  challengeId,
}: DailyChallengeCardProps) {
  const [hoursRemaining, setHoursRemaining] = useState(0)

  useEffect(() => {
    // Calculate hours remaining until midnight UTC
    const now = new Date()
    const midnight = new Date(now)
    midnight.setUTCHours(24, 0, 0, 0)

    const updateHours = () => {
      const currentTime = new Date()
      const msUntilMidnight = midnight.getTime() - currentTime.getTime()
      const hours = Math.ceil(msUntilMidnight / (1000 * 60 * 60))
      setHoursRemaining(Math.max(0, hours))
    }

    updateHours()
    const interval = setInterval(updateHours, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const config = difficultyConfig[difficulty]
  const scorePercentage =
    completedScore !== undefined ? Math.round((completedScore / 100) * 100) : 0

  return (
    <div
      className={`${config.color} border rounded-lg p-6 transition-all hover:shadow-md`}
    >
      {/* Header with title and difficulty */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-brown-900 mb-1">{title}</h2>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
        <span className={`${config.badge} px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ml-4`}>
          {config.label}
        </span>
      </div>

      {/* Character and objectives */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-brown-700">Character:</span>
          <span className="text-sm text-slate-600">{characterName}</span>
        </div>

        {/* Learning objectives */}
        {learningObjectives.length > 0 && (
          <div className="flex items-start gap-2">
            <span className="text-sm font-medium text-brown-700 pt-0.5">
              Practice:
            </span>
            <div className="flex flex-wrap gap-2">
              {learningObjectives.map((obj) => (
                <span
                  key={obj}
                  className="inline-block px-2 py-1 bg-white/60 text-brown-700 text-xs font-medium rounded capitalize border border-brown-200"
                >
                  {componentEmojis[obj as keyof typeof componentEmojis] ||
                    obj.charAt(0).toUpperCase()}{' '}
                  {obj}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bonus indicator */}
      <div className="flex items-center gap-2 mb-4 p-2 bg-white/70 rounded">
        <span className="text-sm font-semibold text-giraffe-600">2x Bonus</span>
        <span className="text-xs text-slate-600">Double points for daily challenges!</span>
      </div>

      {/* Completion status and action */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          {completed ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-green-700">
                  Completed
                </span>
                {completedScore !== undefined && (
                  <span className="text-sm text-green-600 font-semibold">
                    {scorePercentage}%
                  </span>
                )}
              </div>
              {completedScore !== undefined && (
                <div className="w-full bg-white rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${scorePercentage}%` }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {hoursRemaining} hours remaining
              </span>
              <span className="text-xs text-slate-500">Expires at midnight UTC</span>
            </div>
          )}
        </div>

        {/* Action button */}
        {completed ? (
          <Link
            to="/practice/$scenarioId/brief"
            params={{ scenarioId }}
            search={{ dailyChallengeId: challengeId }}
            className="px-4 py-2 bg-giraffe-400 hover:bg-giraffe-500 text-brown-800 font-semibold rounded-lg transition-colors whitespace-nowrap text-sm"
          >
            Try Again
          </Link>
        ) : (
          <Link
            to="/practice/$scenarioId/brief"
            params={{ scenarioId }}
            search={{ dailyChallengeId: challengeId }}
            className="px-4 py-2 bg-giraffe-400 hover:bg-giraffe-500 text-brown-800 font-semibold rounded-lg transition-colors whitespace-nowrap text-sm"
          >
            Start
          </Link>
        )}
      </div>
    </div>
  )
}

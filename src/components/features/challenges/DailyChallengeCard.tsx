import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { Card, CardBody } from '~/components/ui/Card'
import { Button } from '~/components/ui/Button'

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
    badge: 'bg-emerald-100 text-emerald-800',
  },
  medium: {
    label: 'Intermediate',
    badge: 'bg-giraffe-100 text-giraffe-800',
  },
  hard: {
    label: 'Advanced',
    badge: 'bg-empathy-low text-white',
  },
}

const objectiveLabels: Record<string, string> = {
  observation: 'Observation',
  feeling: 'Feeling',
  need: 'Need',
  request: 'Request',
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
    const interval = setInterval(updateHours, 60000)

    return () => clearInterval(interval)
  }, [])

  const config = difficultyConfig[difficulty]

  return (
    <Card className="flex flex-col hover:shadow-lg transition-all duration-200">
      {/* Status Badge */}
      <div
        className={`${completed ? 'bg-emerald-600' : 'bg-giraffe-600'} px-6 py-2 text-white`}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold">
            {completed ? 'COMPLETED' : 'DAILY CHALLENGE'}
          </span>
          <span className="text-sm font-semibold">2x Points</span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-linear-to-r from-giraffe-500 to-giraffe-400 px-6 py-4 text-white">
        <div className="flex items-start justify-between gap-3 mb-1">
          <div>
            <div className="text-sm font-semibold text-giraffe-50 mb-1">
              Today's Focus
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${config.badge}`}
          >
            {config.label}
          </div>
        </div>

        {completed && completedScore !== undefined && (
          <div className="text-sm font-semibold text-white mt-2">
            Score: {completedScore}/100
          </div>
        )}
      </div>

      {/* Body */}
      <CardBody className="flex-grow flex flex-col gap-4">
        <p className="text-brown-700 text-sm leading-relaxed">{description}</p>

        {/* Character Info */}
        <div className="bg-giraffe-50 rounded-lg p-3 border border-giraffe-100">
          <div className="text-xs font-semibold text-giraffe-700 mb-1">
            Character
          </div>
          <div className="font-semibold text-brown-800">{characterName}</div>
        </div>

        {/* Learning Objectives */}
        {learningObjectives.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-giraffe-700 mb-2">
              Practice Areas
            </div>
            <div className="flex flex-wrap gap-2">
              {learningObjectives.map((obj) => (
                <span
                  key={obj}
                  className="inline-block px-2 py-1 bg-giraffe-50 text-giraffe-800 text-xs font-medium rounded border border-giraffe-200"
                >
                  {objectiveLabels[obj] || obj}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Time remaining */}
        {!completed && (
          <div className="text-xs text-brown-500 mt-auto">
            {hoursRemaining} hours remaining - Expires at midnight UTC
          </div>
        )}
      </CardBody>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-giraffe-100 bg-giraffe-50">
        <Link
          to="/practice/$scenarioId/brief"
          params={{ scenarioId }}
          search={{ dailyChallengeId: challengeId }}
        >
          <Button variant="primary" className="w-full">
            {completed ? 'Try Again' : 'Start Challenge'}
          </Button>
        </Link>
      </div>
    </Card>
  )
}

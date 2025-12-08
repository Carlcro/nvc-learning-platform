import type { UserStats } from './types'
import { Card, CardBody } from '~/components/ui/Card'

interface LevelCardProps {
  stats: UserStats
}

export function LevelCard({ stats }: LevelCardProps) {
  let range = 800
  if (stats.level === 1) range = 300
  else if (stats.level === 2) range = 400
  else if (stats.level === 3) range = 500
  else if (stats.level === 4) range = 600
  else if (stats.level === 5) range = 700

  const currentLevelProgress = Math.max(0, range - stats.pointsToNextLevel)
  const percentage = (currentLevelProgress / range) * 100

  return (
    <Card className="overflow-hidden h-full">
      {/* Header */}
      <div className="bg-linear-to-r from-giraffe-500 to-giraffe-400 px-6 py-4 text-white">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm font-semibold text-giraffe-50 mb-1">
              Current Level
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-white">
                {stats.level}
              </span>
              <span className="text-giraffe-100 font-medium">
                {getLevelTitle(stats.level)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {stats.totalPoints}
            </div>
            <div className="text-xs text-giraffe-100 font-medium uppercase">
              Total Points
            </div>
          </div>
        </div>
      </div>

      <CardBody>
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-brown-700">
            <span className="font-medium">Progress to Level {stats.level + 1}</span>
            <span className="font-semibold">{stats.pointsToNextLevel} points to go</span>
          </div>
          <div className="h-4 bg-giraffe-100 rounded-full overflow-hidden border border-giraffe-200">
            <div
              className="h-full bg-linear-to-r from-giraffe-400 to-giraffe-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="text-xs text-brown-500 text-right">
            {Math.round(percentage)}% complete
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

function getLevelTitle(level: number): string {
  if (level === 1) return 'Aspiring Giraffe'
  if (level === 2) return 'Empathetic Listener'
  if (level === 3) return 'Compassionate Communicator'
  if (level === 4) return 'Connection Builder'
  if (level === 5) return 'Harmony Weaver'
  return 'NVC Master'
}

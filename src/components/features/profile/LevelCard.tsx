import type { UserStats } from './types'
import { Card, CardBody } from '~/components/ui/Card'

interface LevelCardProps {
  stats: UserStats
}

export function LevelCard({ stats }: LevelCardProps) {
  // Calculate progress based on the backend logic:
  // Level 1: 0-300 (300 range)
  // Level 2: 300-700 (400 range)
  // Level 3: 700-1200 (500 range)
  // Level 4: 1200-1800 (600 range)
  // Level 5: 1800-2500 (700 range)
  // Level 6+: 800 range

  let range = 800
  if (stats.level === 1) range = 300
  else if (stats.level === 2) range = 400
  else if (stats.level === 3) range = 500
  else if (stats.level === 4) range = 600
  else if (stats.level === 5) range = 700

  const currentLevelProgress = Math.max(0, range - stats.pointsToNextLevel)
  const percentage = (currentLevelProgress / range) * 100

  return (
    <Card className="bg-white border-2 border-giraffe-200 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <img
          src="/giraff.png"
          alt="Giraffe"
          className="w-32 h-32 object-contain"
        />
      </div>

      <CardBody className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-sm font-bold text-giraffe-600 uppercase tracking-wider">
              Current Level
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-brown-800">
                {stats.level}
              </span>
              <span className="text-brown-600 font-medium">
                {getLevelTitle(stats.level)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-giraffe-600">
              {stats.totalPoints}
            </div>
            <div className="text-xs text-brown-500 font-medium uppercase">
              Total Points
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-brown-600">
            <span>Progress to Level {stats.level + 1}</span>
            <span>{stats.pointsToNextLevel} points to go</span>
          </div>
          <div className="h-4 bg-giraffe-100 rounded-full overflow-hidden border border-giraffe-200">
            <div
              className="h-full bg-linear-to-r from-giraffe-400 to-giraffe-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            />
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

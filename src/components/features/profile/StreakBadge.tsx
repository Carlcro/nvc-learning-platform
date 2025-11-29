import type { UserStats } from './types'
import { Card, CardBody } from '~/components/ui/Card'

interface StreakBadgeProps {
  stats: UserStats
}

export function StreakBadge({ stats }: StreakBadgeProps) {
  return (
    <Card className="bg-linear-to-br from-orange-50 to-white border-2 border-orange-200">
      <CardBody className="flex items-center gap-4">
        <div className="flex-shrink-0 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center border-2 border-orange-200">
          <span className="text-3xl">🔥</span>
        </div>

        <div>
          <h3 className="text-sm font-bold text-orange-800 uppercase tracking-wider mb-1">
            Daily Streak
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-brown-800">
              {stats.currentStreak}
            </span>
            <span className="text-brown-600">days</span>
          </div>
          <p className="text-xs text-brown-500 mt-1">
            Best: {stats.longestStreak} days
          </p>
        </div>
      </CardBody>
    </Card>
  )
}

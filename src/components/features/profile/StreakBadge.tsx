import type { UserStats } from './types'
import { Card, CardBody } from '~/components/ui/Card'

interface StreakBadgeProps {
  stats: UserStats
}

export function StreakBadge({ stats }: StreakBadgeProps) {
  return (
    <Card className="overflow-hidden h-full">
      {/* Header */}
      <div className="bg-giraffe-50 px-6 py-3 border-b border-giraffe-100">
        <h2 className="text-sm font-semibold text-brown-700">
          Daily streak
        </h2>
      </div>

      <CardBody className="flex flex-col justify-center">
        <div className="text-center">
          <div className="flex items-baseline justify-center gap-2 mb-2">
            <span className="text-5xl font-bold text-brown-800">
              {stats.currentStreak}
            </span>
            <span className="text-lg text-brown-600 font-medium">days</span>
          </div>
          <div className="bg-giraffe-50 rounded-lg p-3 border border-giraffe-100">
            <div className="text-xs font-semibold text-brown-700 mb-1">
              Best streak
            </div>
            <div className="font-bold text-brown-800">
              {stats.longestStreak} days
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

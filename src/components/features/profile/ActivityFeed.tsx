import { Card, CardBody } from '~/components/ui/Card'
import { Link } from '@tanstack/react-router'
import { Button } from '~/components/ui/Button'

interface ActivityFeedProps {
  completedScenarios: number
  masteredScenarios: number
  totalStars: number
}

function renderStars(count: number) {
  return (
    <div className="flex gap-0.5 justify-center">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={i < Math.min(count, 3) ? 'text-yellow-400' : 'text-gray-300'}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export function ActivityFeed({
  completedScenarios,
  masteredScenarios,
  totalStars,
}: ActivityFeedProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="bg-linear-to-r from-emerald-500 to-emerald-400 px-6 py-3 text-white">
        <div className="text-sm font-semibold uppercase tracking-wider">
          Your Journey
        </div>
      </div>

      <CardBody className="flex-grow flex flex-col">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-giraffe-50 p-4 rounded-lg text-center border border-giraffe-100">
            <div className="text-2xl font-bold text-brown-800">
              {completedScenarios}
            </div>
            <div className="text-xs text-brown-600 uppercase font-medium">
              Completed
            </div>
          </div>
          <div className="bg-giraffe-50 p-4 rounded-lg text-center border border-giraffe-100">
            <div className="text-2xl font-bold text-brown-800">
              {masteredScenarios}
            </div>
            <div className="text-xs text-brown-600 uppercase font-medium">
              Mastered
            </div>
          </div>
          <div className="bg-giraffe-50 p-4 rounded-lg text-center col-span-2 border border-giraffe-100">
            <div className="text-3xl font-bold text-brown-800 mb-1">
              {totalStars}
            </div>
            {renderStars(totalStars)}
            <div className="text-xs text-brown-600 uppercase font-medium mt-1">
              Total Stars Earned
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <Link to="/practice">
            <Button variant="primary" className="w-full">
              Continue Practicing
            </Button>
          </Link>
        </div>
      </CardBody>
    </Card>
  )
}

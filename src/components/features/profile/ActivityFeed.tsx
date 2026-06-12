import { Link } from '@tanstack/react-router'
import { Card, CardBody } from '~/components/ui/Card'
import { Button } from '~/components/ui/Button'

interface ActivityFeedProps {
  completedScenarios: number
  masteredScenarios: number
  totalStars: number
}

function renderStars(count: number) {
  const filled = Math.min(count, 3)
  return (
    <div
      className="flex gap-0.5 justify-center"
      role="img"
      aria-label={`${filled} of 3 stars`}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          aria-hidden="true"
          className={i < filled ? 'text-giraffe-400' : 'text-brown-200'}
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
      <div className="bg-giraffe-50 px-6 py-3 border-b border-giraffe-100">
        <h2 className="text-sm font-semibold text-brown-700">
          Your journey
        </h2>
      </div>

      <CardBody className="flex-grow flex flex-col">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-giraffe-50 p-4 rounded-lg text-center border border-giraffe-100">
            <div className="text-2xl font-bold text-brown-800">
              {completedScenarios}
            </div>
            <div className="text-xs text-brown-600 font-medium">
              Completed
            </div>
          </div>
          <div className="bg-giraffe-50 p-4 rounded-lg text-center border border-giraffe-100">
            <div className="text-2xl font-bold text-brown-800">
              {masteredScenarios}
            </div>
            <div className="text-xs text-brown-600 font-medium">
              Mastered
            </div>
          </div>
          <div className="bg-giraffe-50 p-4 rounded-lg text-center col-span-2 border border-giraffe-100">
            <div className="text-3xl font-bold text-brown-800 mb-1">
              {totalStars}
            </div>
            {renderStars(totalStars)}
            <div className="text-xs text-brown-600 font-medium mt-1">
              Total stars earned
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

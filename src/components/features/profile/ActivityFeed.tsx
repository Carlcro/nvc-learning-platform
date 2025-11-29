import { Card, CardBody } from '~/components/ui/Card'
import { Link } from '@tanstack/react-router'
import { Button } from '~/components/ui/Button'

interface ActivityFeedProps {
  completedScenarios: number
  masteredScenarios: number
  totalStars: number
}

export function ActivityFeed({
  completedScenarios,
  masteredScenarios,
  totalStars,
}: ActivityFeedProps) {
  return (
    <Card className="border-2 border-giraffe-200 h-full">
      <CardBody>
        <h3 className="text-lg font-bold text-brown-800 mb-6">Your Journey</h3>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-giraffe-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-giraffe-700">
              {completedScenarios}
            </div>
            <div className="text-xs text-brown-600 uppercase font-medium">
              Scenarios Completed
            </div>
          </div>
          <div className="bg-giraffe-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-giraffe-700">
              {masteredScenarios}
            </div>
            <div className="text-xs text-brown-600 uppercase font-medium">
              Mastered
            </div>
          </div>
          <div className="bg-giraffe-50 p-4 rounded-lg text-center col-span-2">
            <div className="text-3xl font-bold text-yellow-500 flex justify-center items-center gap-2">
              {totalStars} <span>⭐</span>
            </div>
            <div className="text-xs text-brown-600 uppercase font-medium">
              Total Stars Earned
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/practice">
            <Button variant="secondary" className="w-full">
              Continue Practicing
            </Button>
          </Link>
        </div>
      </CardBody>
    </Card>
  )
}

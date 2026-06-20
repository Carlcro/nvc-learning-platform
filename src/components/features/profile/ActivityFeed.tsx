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
    <span
      className="inline-flex gap-0.5 align-middle"
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
    </span>
  )
}

/**
 * A closing "your journey so far" strip — the milestones earned through
 * practice, paired with the one clear next step. Deliberately a horizontal
 * call-to-action band, not another stat card, so the page ends on momentum.
 */
export function ActivityFeed({
  completedScenarios,
  masteredScenarios,
  totalStars,
}: ActivityFeedProps) {
  return (
    <Card>
      <CardBody className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <dl className="grid grid-cols-3 gap-4 sm:gap-10 text-center sm:text-left">
          <JourneyStat value={completedScenarios} label="Completed" />
          <JourneyStat value={masteredScenarios} label="Mastered" />
          <div>
            <dd className="text-2xl font-bold text-brown-800">
              {totalStars} {renderStars(totalStars)}
            </dd>
            <dt className="text-xs text-brown-600 font-medium mt-0.5">
              Stars earned
            </dt>
          </div>
        </dl>

        <Link to="/practice" className="shrink-0">
          <Button variant="primary" size="lg" className="w-full sm:w-auto">
            Continue practicing
          </Button>
        </Link>
      </CardBody>
    </Card>
  )
}

function JourneyStat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <dd className="text-2xl font-bold text-brown-800">{value}</dd>
      <dt className="text-xs text-brown-600 font-medium mt-0.5">{label}</dt>
    </div>
  )
}

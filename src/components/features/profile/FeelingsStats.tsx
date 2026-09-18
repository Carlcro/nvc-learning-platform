import { Link } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from 'convex/_generated/api'
import { Card, CardBody } from '~/components/ui/Card'
import { Button } from '~/components/ui/Button'

/**
 * The feelings work, on the profile.
 *
 * Vocabulary practice used to live entirely in its own record, so someone could
 * check in every day for a month and see nothing for it here. This is the band
 * that shows that half of the practice.
 */
export function FeelingsStats() {
  const stats = useQuery(api.feelingsProgress.getStats)

  // undefined while loading, null when signed out. Neither has anything to say.
  if (!stats) return null

  const hasStarted =
    stats.totalCheckIns > 0 ||
    stats.totalFeelingsExplored > 0 ||
    stats.quizScore > 0

  return (
    <Card>
      <CardBody className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-brown-800 mb-1">
            Naming feelings
          </h2>
          <p className="text-sm text-brown-600 mb-4">
            {hasStarted
              ? 'The vocabulary underneath every honest conversation.'
              : 'Nothing here yet. Naming what you feel is where the rest gets easier.'}
          </p>

          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 text-center sm:text-left">
            <FeelingStat value={stats.totalFeelingsExplored} label="Explored" />
            <FeelingStat value={stats.totalCheckIns} label="Check-ins" />
            <FeelingStat
              value={stats.checkInStreak}
              label="Check-in streak"
            />
            <FeelingStat value={stats.quizLevel} label="Quiz level" />
          </dl>
        </div>

        <Link to="/feelings" className="shrink-0">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            {hasStarted ? 'Keep exploring' : 'Start exploring'}
          </Button>
        </Link>
      </CardBody>
    </Card>
  )
}

function FeelingStat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <dd className="text-2xl font-bold text-brown-800">{value}</dd>
      <dt className="text-xs text-brown-600 font-medium mt-0.5">{label}</dt>
    </div>
  )
}

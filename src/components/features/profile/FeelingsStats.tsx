import { Link } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from 'convex/_generated/api'
import { TEXT_LINK } from './linkStyles'

/**
 * The feelings work, on the profile.
 *
 * Vocabulary practice used to live entirely in its own record, so someone could
 * check in every day for a month and see nothing for it here. This short
 * section names that half of the practice in a sentence, counts only.
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
    <section aria-labelledby="feelings-heading">
      <h2
        id="feelings-heading"
        className="text-xl font-bold text-brown-800 text-balance"
      >
        Naming feelings
      </h2>
      <p className="mt-3 text-brown-700 max-w-prose text-pretty">
        {hasStarted
          ? describeFeelingsWork(stats)
          : 'Nothing here yet. Naming what you feel is where the rest of the conversation gets easier.'}
      </p>
      <p className="mt-4">
        <Link to="/feelings" className={TEXT_LINK}>
          {hasStarted ? 'Keep exploring feelings' : 'Open the feelings library'}
        </Link>
      </p>
    </section>
  )
}

function plural(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`
}

function describeFeelingsWork(stats: {
  totalFeelingsExplored: number
  totalCheckIns: number
  checkInStreak: number
  quizScore: number
  quizLevel: number
}): string {
  const parts: Array<string> = []
  if (stats.totalFeelingsExplored > 0) {
    parts.push(
      `explored ${plural(stats.totalFeelingsExplored, 'feeling', 'feelings')}`,
    )
  }
  if (stats.totalCheckIns > 0) {
    parts.push(
      `checked in with yourself ${plural(stats.totalCheckIns, 'time', 'times')}`,
    )
  }
  if (stats.quizScore > 0) {
    parts.push(`reached level ${stats.quizLevel} in the feelings quiz`)
  }

  let sentence = 'You have '
  if (parts.length === 1) sentence += parts[0]
  else {
    sentence += `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`
  }
  sentence += '.'

  if (stats.checkInStreak > 1) {
    sentence += ` That is ${stats.checkInStreak} days of check-ins in a row.`
  }
  return `${sentence} This is the vocabulary underneath every honest conversation.`
}

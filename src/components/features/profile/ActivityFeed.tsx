import { Link } from '@tanstack/react-router'
import { TEXT_LINK } from './linkStyles'

interface ActivityFeedProps {
  completedScenarios: number
  threeStarScenarios: number
  totalStars: number
}

function plural(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`
}

/**
 * The conversations so far, in one sentence, with a quiet invitation to
 * rehearse something from the person's own life next.
 */
export function ActivityFeed({
  completedScenarios,
  threeStarScenarios,
  totalStars,
}: ActivityFeedProps) {
  return (
    <section aria-labelledby="conversations-heading">
      <h2
        id="conversations-heading"
        className="text-xl font-bold text-brown-800 text-balance"
      >
        Your conversations
      </h2>
      <p className="mt-3 text-brown-700 max-w-prose text-pretty">
        {completedScenarios === 0
          ? 'You have not finished a conversation yet. The first one is often the hardest, and a beginner scenario is a gentle place to begin.'
          : describeConversations(
              completedScenarios,
              threeStarScenarios,
              totalStars,
            )}
      </p>
      <p className="mt-4">
        <Link to="/practice/create" className={TEXT_LINK}>
          Rehearse a real conversation of your own
        </Link>
      </p>
    </section>
  )
}

function describeConversations(
  completed: number,
  threeStars: number,
  stars: number,
): string {
  let sentence = `You have finished ${plural(completed, 'scenario', 'different scenarios')}`
  if (threeStars > 0) {
    sentence +=
      completed === 1
        ? ', with three stars'
        : `, ${threeStars} of them with three stars`
  }
  if (stars > 0) {
    sentence += `, gathering ${plural(stars, 'star', 'stars')} along the way`
  }
  return `${sentence}.`
}

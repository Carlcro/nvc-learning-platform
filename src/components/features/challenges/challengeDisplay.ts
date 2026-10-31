import { useEffect, useState } from 'react'

export type ChallengeDifficulty = 'easy' | 'medium' | 'hard'

/**
 * The one vocabulary for daily challenge difficulty, matching the scenario
 * library. The data says easy, medium, hard; people always read these words.
 */
export const CHALLENGE_DIFFICULTY_LABELS: Record<ChallengeDifficulty, string> =
  {
    easy: 'Beginner',
    medium: 'Intermediate',
    hard: 'Advanced',
  }

export function challengeDifficultyLabel(difficulty: string): string {
  const labels: Partial<Record<string, string>> = CHALLENGE_DIFFICULTY_LABELS
  return labels[difficulty] ?? CHALLENGE_DIFFICULTY_LABELS.medium
}

const OBJECTIVE_WORDS: Record<string, string> = {
  observation: 'observations',
  feeling: 'feelings',
  need: 'needs',
  request: 'requests',
}

/** "observations and feelings", "observations, feelings and needs". */
export function practiceAreasPhrase(objectives: Array<string>): string {
  const words = objectives.map((o) => OBJECTIVE_WORDS[o] ?? o)
  if (words.length <= 1) return words.join('')
  return `${words.slice(0, -1).join(', ')} and ${words[words.length - 1]}`
}

/**
 * The gold primary action, applied to a router Link so there is a single
 * tab stop (never a Button nested inside a Link).
 */
export const PRIMARY_LINK_CLASS =
  'inline-flex items-center justify-center rounded-lg bg-giraffe-400 px-6 py-3 text-lg font-semibold text-brown-800 shadow-sm transition-colors duration-200 hover:bg-giraffe-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-giraffe-300 focus-visible:ring-offset-2'

/** A quiet secondary action, written as an underlined text link. */
export const QUIET_LINK_CLASS =
  'font-semibold text-brown-800 underline decoration-giraffe-400 decoration-2 underline-offset-4 transition-colors hover:decoration-brown-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-giraffe-300 focus-visible:ring-offset-2 rounded-sm'

/**
 * When the next daily challenge arrives, in the viewer's own local time
 * (challenges are generated at midnight UTC). Computed after mount so the
 * server render and the browser never disagree about the time zone; it is
 * null until then.
 */
export function useNextChallengeTime(): string | null {
  const [label, setLabel] = useState<string | null>(null)

  useEffect(() => {
    const update = () => {
      const next = new Date()
      next.setUTCHours(24, 0, 0, 0)
      setLabel(
        next.toLocaleTimeString(undefined, {
          hour: 'numeric',
          minute: '2-digit',
        }),
      )
    }
    update()
    // The time only changes if the viewer's clock or zone shifts, so an
    // hourly check is plenty.
    const interval = setInterval(update, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return label
}

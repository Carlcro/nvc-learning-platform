import { useEffect, useState } from 'react'
import type { Messages } from '~/i18n/messages'
import { useFormat } from '~/i18n/useT'

export type ChallengeDifficulty = 'easy' | 'medium' | 'hard'

/**
 * The on-screen word for a challenge difficulty, from
 * `t.challenges.difficulty`. Pass that slice so the word follows the
 * reader's language; it defaults to English for callers not yet converted.
 * An unknown value reads as the middle level.
 */
export function challengeDifficultyLabel(
  difficulty: string,
  labels: Messages['challenges']['difficulty'],
): string {
  const byValue: Partial<Record<string, string>> = labels
  return byValue[difficulty] ?? labels.medium
}

/**
 * The learning objectives as words for running text, from
 * `t.challenges.objectiveWords`. An objective without a word is shown as is.
 * The dictionary joins them into a sentence.
 */
export function practiceAreaWords(
  objectives: ReadonlyArray<string>,
  words: Messages['challenges']['objectiveWords'],
): Array<string> {
  const byValue: Partial<Record<string, string>> = words
  return objectives.map((o) => byValue[o] ?? o)
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
  const format = useFormat()
  const [label, setLabel] = useState<string | null>(null)

  useEffect(() => {
    const update = () => {
      const next = new Date()
      next.setUTCHours(24, 0, 0, 0)
      setLabel(
        format.time(next, {
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
  }, [format])

  return label
}

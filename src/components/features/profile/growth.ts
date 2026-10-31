import type { NVCComponent } from '~/lib/conversationInsights'
import type { UserStats } from './types'
import { NVC_COMPONENTS } from '~/lib/conversationInsights'

/**
 * Pure helpers that turn the lifetime running averages (0 to 25 per
 * component, from api.userProgress.getStats) into words. The conversation
 * helpers in conversationInsights work on one conversation's messages; these
 * work on the averages, but use the same bars so the two never disagree.
 */

// Mirrors STRENGTH_AT and FOCUS_BELOW in src/lib/conversationInsights.ts.
const LANDED_AT = 15
const FOCUS_BELOW = 20

export const COMPONENT_NAMES: Record<NVCComponent, string> = {
  observation: 'Observation',
  feeling: 'Feeling',
  need: 'Need',
  request: 'Request',
}

export interface GrowthInsights {
  /** The piece with the highest average, when any has been tried. */
  strongest: NVCComponent | null
  /** The piece most worth exploring next, when one stands out. */
  focus: NVCComponent | null
  /** True when the focus piece has not been tried in any conversation yet. */
  focusUntried: boolean
}

export function summarizeGrowth(
  averages: UserStats['averageScores'],
): GrowthInsights {
  const tried = NVC_COMPONENTS.filter((c) => averages[c] > 0)
  if (tried.length === 0) {
    return { strongest: null, focus: null, focusUntried: false }
  }

  const strongest = [...tried].sort((a, b) => averages[b] - averages[a])[0]

  // The earliest piece of the arc never tried is the clearest next step.
  // Failing that, the tried piece with the most room to grow.
  const untried = NVC_COMPONENTS.find((c) => averages[c] === 0)
  if (untried) {
    return { strongest, focus: untried, focusUntried: true }
  }
  const weakest = [...tried].sort((a, b) => averages[a] - averages[b])[0]
  const focus =
    weakest !== strongest && averages[weakest] < FOCUS_BELOW ? weakest : null
  return { strongest, focus, focusUntried: false }
}

/**
 * A plain word for where one piece is, never a grade. Coloured the same
 * whatever the word, so no band reads as a warning.
 */
export function growthWord(average: number): string {
  if (average <= 0) return 'not tried yet'
  if (average < 10) return 'just starting'
  if (average < LANDED_AT) return 'growing'
  if (average < FOCUS_BELOW) return 'steady'
  return 'strong'
}

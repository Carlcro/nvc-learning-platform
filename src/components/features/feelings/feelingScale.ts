/**
 * Shared vocabulary for describing a feeling, so every feelings page uses
 * the same five intensity words and the same two neutral tones.
 */

export type FeelingCategory = 'pleasant' | 'unpleasant'

/** The five-step intensity scale, from 1 (softest) to 5 (strongest). */
export const INTENSITY_WORDS = [
  'Faint',
  'Mild',
  'Moderate',
  'Strong',
  'Intense',
] as const

/** The word for an intensity from 1 to 5, clamped to the scale. */
export function intensityWord(intensity: number): string {
  const index = Math.min(
    INTENSITY_WORDS.length - 1,
    Math.max(0, Math.round(intensity) - 1),
  )
  return INTENSITY_WORDS[index]
}

export function categoryWord(category: FeelingCategory): string {
  return category === 'pleasant' ? 'Pleasant' : 'Unpleasant'
}

/**
 * A small swatch per category. Both tones are neutral and warm: an
 * unpleasant feeling is not a bad result, so it never borrows the coral
 * used for low scores. The swatch always sits beside a text label.
 */
export const CATEGORY_SWATCH: Record<FeelingCategory, string> = {
  pleasant: 'bg-giraffe-200 border border-giraffe-600',
  unpleasant: 'bg-brown-200 border border-brown-500',
}

/** The fill used for each category in the weekly balance bar. */
export const CATEGORY_FILL: Record<FeelingCategory, string> = {
  pleasant: 'bg-giraffe-300',
  unpleasant: 'bg-brown-300',
}

/** One short description, for example "Moderate, unpleasant". */
export function describeFeeling(feeling: {
  intensity: number
  category: FeelingCategory
}): string {
  return `${intensityWord(feeling.intensity)}, ${categoryWord(feeling.category).toLowerCase()}`
}

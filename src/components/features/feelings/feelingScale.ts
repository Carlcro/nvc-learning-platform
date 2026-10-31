import type { Messages } from '~/i18n/messages'

/**
 * Shared vocabulary for describing a feeling, so every feelings page uses
 * the same five intensity words and the same two neutral tones. The words
 * themselves live in the dictionary under `feelings.scale`.
 */

export type FeelingCategory = 'pleasant' | 'unpleasant'

type Scale = Messages['feelings']['scale']

/** The five-step intensity scale, from 1 (softest) to 5 (strongest). */
export const INTENSITY_LEVELS = [
  'faint',
  'mild',
  'moderate',
  'strong',
  'intense',
] as const

export type IntensityLevel = (typeof INTENSITY_LEVELS)[number]

/** The level for an intensity from 1 to 5, clamped to the scale. */
export function intensityLevel(intensity: number): IntensityLevel {
  const index = Math.min(
    INTENSITY_LEVELS.length - 1,
    Math.max(0, Math.round(intensity) - 1),
  )
  return INTENSITY_LEVELS[index]
}

/** The word for an intensity from 1 to 5, clamped to the scale. */
export function intensityWord(intensity: number, scale: Scale): string {
  return scale.intensity[intensityLevel(intensity)]
}

export function categoryWord(category: FeelingCategory, scale: Scale): string {
  return scale.category[category]
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
export function describeFeeling(
  feeling: {
    intensity: number
    category: FeelingCategory
  },
  scale: Scale,
): string {
  return scale.describe(
    intensityWord(feeling.intensity, scale),
    categoryWord(feeling.category, scale),
  )
}

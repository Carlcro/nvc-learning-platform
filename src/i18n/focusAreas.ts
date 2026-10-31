import type { Locale } from '../../convex/lib/locale'

/**
 * A scenario's focus area in words. The labels live in each dictionary under
 * `practice.focusAreas`. A custom scenario can carry any code: one without a
 * label reads as its own words in English and is left out elsewhere.
 */
export function focusAreaLabel(
  code: string,
  labels: Partial<Record<string, string>>,
  locale: Locale,
): string | null {
  const label = Object.hasOwn(labels, code) ? labels[code] : undefined
  if (label) return label
  return locale === 'en' ? code.replace(/_/g, ' ') : null
}

/** A learning objective code ("feeling") as the component's name, if it is one. */
export function objectiveLabel(
  code: string,
  components: Record<'observation' | 'feeling' | 'need' | 'request', string>,
): string {
  return Object.hasOwn(components, code)
    ? components[code as keyof typeof components]
    : code
}

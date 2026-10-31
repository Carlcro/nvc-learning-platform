import { v } from 'convex/values'

/**
 * The languages the app can speak. Shared by the frontend and the backend, so
 * a conversation, a user's preference and the UI always agree on the codes.
 */
export const LOCALES = ['en', 'fr', 'es', 'sv'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

export const localeValidator = v.union(
  v.literal('en'),
  v.literal('fr'),
  v.literal('es'),
  v.literal('sv'),
)

/** Each language's name for itself, as shown in the language picker. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  sv: 'Svenska',
}

/** The English name, for model prompts ("Reply in Swedish"). */
export const LOCALE_ENGLISH_NAMES: Record<Locale, string> = {
  en: 'English',
  fr: 'French',
  es: 'Spanish',
  sv: 'Swedish',
}

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === 'string' && (LOCALES as ReadonlyArray<string>).includes(value)
  )
}

/**
 * Pick the best of `allowed` for a list of language tags in order of
 * preference (navigator.languages, or a parsed Accept-Language header).
 * Matches on the primary subtag, so "fr-CH" and "sv-SE" count.
 */
export function matchLocale(
  preferred: ReadonlyArray<string>,
  allowed: ReadonlyArray<Locale>,
): Locale {
  for (const tag of preferred) {
    const primary = tag.trim().toLowerCase().split('-')[0]
    const match = allowed.find((locale) => locale === primary)
    if (match) return match
  }
  return allowed.includes(DEFAULT_LOCALE) ? DEFAULT_LOCALE : allowed[0]
}

/** Language tags from an Accept-Language header, most preferred first. */
export function parseAcceptLanguage(header: string | undefined): Array<string> {
  if (!header) return []
  return header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';')
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith('q='))
      const weight = q ? Number(q.slice(2)) : 1
      return { tag, weight: Number.isFinite(weight) ? weight : 0 }
    })
    .filter((entry) => entry.tag && entry.tag !== '*' && entry.weight > 0)
    .sort((a, b) => b.weight - a.weight)
    .map((entry) => entry.tag)
}

import type { Locale } from '../../convex/lib/locale'

/**
 * The languages people can choose. A language belongs here only once its
 * interface, lessons, feelings and roleplay are all translated. The picker
 * only shows when there is more than one choice.
 */
export const SELECTABLE_LOCALES: ReadonlyArray<Locale> = ['en', 'fr', 'es', 'sv']

/** Cookie that carries the chosen language, so the server renders in it. */
export const LOCALE_COOKIE = 'locale'

export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export function isSelectable(locale: Locale): boolean {
  return SELECTABLE_LOCALES.includes(locale)
}

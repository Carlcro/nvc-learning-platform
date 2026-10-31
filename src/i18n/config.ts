import type { Locale } from '../../convex/lib/locale'

/**
 * The languages people can choose today. A language joins this list once its
 * roleplay is ready; until then the picker stays hidden (it only shows when
 * there is more than one choice) and everyone reads English.
 */
export const SELECTABLE_LOCALES: ReadonlyArray<Locale> = ['en']

/** Cookie that carries the chosen language, so the server renders in it. */
export const LOCALE_COOKIE = 'locale'

export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export function isSelectable(locale: Locale): boolean {
  return SELECTABLE_LOCALES.includes(locale)
}

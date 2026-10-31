import { en } from './en'
import { es } from './es'
import { fr } from './fr'
import { sv } from './sv'
import type { Locale } from '../../../convex/lib/locale'

/** The full dictionary shape, taken from English. */
export type Messages = typeof en

/**
 * What a translation provides: any subset of the English shape, with the
 * same types at every leaf. Missing strings fall back to English, and a key
 * English does not have is a type error.
 */
export type PartialMessages = DeepPartial<Messages>

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends (...args: never) => unknown
    ? T[K]
    : T[K] extends ReadonlyArray<unknown>
      ? T[K]
      : T[K] extends object
        ? DeepPartial<T[K]>
        : T[K]
}

/**
 * Translations by language. Each is a complete dictionary, checked against
 * the English shape; a language missing here would read entirely in English.
 */
export const TRANSLATIONS: Partial<Record<Locale, PartialMessages>> = {
  fr,
  es,
  sv,
}

const cache = new Map<Locale, Messages>()

export function getMessages(locale: Locale): Messages {
  const cached = cache.get(locale)
  if (cached) return cached

  const translation = TRANSLATIONS[locale]
  const messages = translation ? mergeOver(en, translation) : en
  cache.set(locale, messages)
  return messages
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  )
}

/** Overlay a partial translation on the English dictionary, key by key. */
export function mergeOver<T>(base: T, override: DeepPartial<T> | undefined): T {
  if (override === undefined) return base
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return override as T
  }
  const result: Record<string, unknown> = { ...base }
  for (const [key, value] of Object.entries(override)) {
    if (value === undefined) continue
    result[key] = mergeOver(base[key], value as DeepPartial<unknown>)
  }
  return result as T
}

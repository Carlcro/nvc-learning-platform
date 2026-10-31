import { v } from 'convex/values'
import { BUILTIN_SCENARIO_TRANSLATIONS } from '../scenarioTranslations'
import { DEFAULT_LOCALE } from './locale'
import type { Locale } from './locale'

/**
 * The words of a scenario that change with the language: everything a person
 * reads or the character says. Category, difficulty, mood, objectives and the
 * rest stay the same in every language.
 */
export interface ScenarioText {
  title: string
  description: string
  situation: string
  characterName: string
  characterPersonality: string
  characterBackground?: string
  characterHiddenNeeds: Array<string>
  aiOpeningMessage: string
}

export const scenarioTextValidator = v.object({
  title: v.string(),
  description: v.string(),
  situation: v.string(),
  characterName: v.string(),
  characterPersonality: v.string(),
  characterBackground: v.optional(v.string()),
  characterHiddenNeeds: v.array(v.string()),
  aiOpeningMessage: v.string(),
})

/** Stored on a scenario row: its words in languages other than its own. */
export const scenarioTranslationsValidator = v.object({
  en: v.optional(scenarioTextValidator),
  fr: v.optional(scenarioTextValidator),
  es: v.optional(scenarioTextValidator),
  sv: v.optional(scenarioTextValidator),
})

export type ScenarioTranslations = Partial<Record<Locale, ScenarioText>>

/** The fields of a scenario row this module reads. */
interface LocalizableScenario extends ScenarioText {
  locale?: Locale
  translations?: ScenarioTranslations
  source?: 'builtin' | 'user_created' | 'daily'
  orderIndex: number
}

/** The language a scenario was written in. Rows from before languages are English. */
export function scenarioBaseLocale(scenario: { locale?: Locale }): Locale {
  return scenario.locale ?? DEFAULT_LOCALE
}

function translationFor(
  scenario: LocalizableScenario,
  locale: Locale,
): ScenarioText | undefined {
  const stored = scenario.translations?.[locale]
  if (stored) return stored

  // Built-in library rows were seeded before languages existed, so their
  // translations live in code, keyed by the English title.
  const isBuiltIn =
    (scenario.source === undefined || scenario.source === 'builtin') &&
    scenario.orderIndex >= 0 &&
    scenarioBaseLocale(scenario) === DEFAULT_LOCALE
  if (!isBuiltIn || locale === 'en') return undefined
  return BUILTIN_SCENARIO_TRANSLATIONS[locale][scenario.title]
}

/**
 * The scenario as it reads in `locale`, plus `contentLocale`: the language its
 * words are actually in. That is `locale` when a translation exists, and the
 * scenario's own language otherwise (a custom scenario written in Swedish
 * stays Swedish for a reader of the English interface).
 *
 * `translations` is dropped from the result: the client only ever needs one
 * language, and the others would only make every query heavier.
 */
export function localizeScenario<T extends LocalizableScenario>(
  scenario: T,
  locale: Locale,
): Omit<T, 'translations'> & { contentLocale: Locale } {
  const { translations: _translations, ...rest } = scenario
  const base = scenarioBaseLocale(scenario)
  if (locale === base) return { ...rest, contentLocale: base }

  const text = translationFor(scenario, locale)
  if (!text) return { ...rest, contentLocale: base }

  return {
    ...rest,
    ...text,
    // A translation without a background keeps the original's absence, not
    // the other language's words.
    characterBackground: text.characterBackground,
    contentLocale: locale,
  }
}

/** The language a new conversation in this scenario will be held in. */
export function conversationLocaleFor(
  scenario: LocalizableScenario,
  requested: Locale,
): Locale {
  return localizeScenario(scenario, requested).contentLocale
}

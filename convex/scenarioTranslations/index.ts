import { es } from './es'
import { fr } from './fr'
import { sv } from './sv'
import type { Locale } from '../lib/locale'
import type { ScenarioText } from '../lib/scenarioText'

/**
 * The built-in scenarios in each language, keyed by the scenario's English
 * title (the rows were seeded before languages existed, and the title is the
 * one stable, readable handle they have). A test checks every built-in title
 * has an entry in every language.
 *
 * These are adaptations rather than word-for-word translations: characters
 * get a first name that is natural in the language, and the speech sounds
 * like everyday talk there.
 */
export type ScenarioTranslationTable = Record<string, ScenarioText>

export const BUILTIN_SCENARIO_TRANSLATIONS: Record<
  Exclude<Locale, 'en'>,
  Partial<ScenarioTranslationTable>
> = { fr, es, sv }

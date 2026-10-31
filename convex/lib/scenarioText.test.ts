import { describe, expect, it } from 'vitest'
import {
  ADVANCED_SCENARIOS,
  BEGINNER_SCENARIOS,
  INTERMEDIATE_SCENARIOS,
} from '../scenarios'
import { BUILTIN_SCENARIO_TRANSLATIONS } from '../scenarioTranslations'
import {
  characterLanguageNotes,
  coachLanguageNotes,
  scenarioLanguageNotes,
  writingRules,
} from './promptLanguage'
import { LOCALES } from './locale'
import { conversationLocaleFor, localizeScenario } from './scenarioText'
import type { Locale } from './locale'

const BUILT_IN = [
  ...BEGINNER_SCENARIOS,
  ...INTERMEDIATE_SCENARIOS,
  ...ADVANCED_SCENARIOS,
]

const DASHES = /[–—]/

describe('built-in scenario translations', () => {
  const others = LOCALES.filter((l): l is Exclude<Locale, 'en'> => l !== 'en')

  for (const locale of others) {
    describe(locale, () => {
      const table = BUILTIN_SCENARIO_TRANSLATIONS[locale]

      it('covers every built-in scenario, and nothing else', () => {
        expect(Object.keys(table).sort()).toEqual(
          BUILT_IN.map((s) => s.title).sort(),
        )
      })

      it('fills every field, without dashes', () => {
        for (const text of Object.values(table)) {
          if (!text) continue
          expect(text.title.trim()).not.toBe('')
          expect(text.situation.trim()).not.toBe('')
          expect(text.aiOpeningMessage.trim()).not.toBe('')
          expect(text.characterName.trim()).not.toBe('')
          expect(text.characterHiddenNeeds.length).toBeGreaterThan(0)
          expect(JSON.stringify(text)).not.toMatch(DASHES)
        }
      })

      it('uses the character name in the situation it introduces', () => {
        for (const [title, text] of Object.entries(table)) {
          const english = BUILT_IN.find((s) => s.title === title)
          if (!text || !english?.situation.includes(english.characterName)) {
            continue
          }
          expect(text.situation).toContain(text.characterName)
        }
      })
    })
  }
})

describe('localizeScenario', () => {
  const builtIn = { ...BUILT_IN[0], orderIndex: 0 }

  it('returns a built-in scenario in another language', () => {
    const fr = localizeScenario(builtIn, 'fr')
    expect(fr.contentLocale).toBe('fr')
    expect(fr.title).not.toBe(builtIn.title)
    // Everything that is not words stays as it was.
    expect(fr.characterInitialMood).toBe(builtIn.characterInitialMood)
    expect(fr.learningObjectives).toEqual(builtIn.learningObjectives)
  })

  it('leaves English as it is', () => {
    const en = localizeScenario(builtIn, 'en')
    expect(en.contentLocale).toBe('en')
    expect(en.title).toBe(builtIn.title)
  })

  it('keeps a custom scenario in the language it was written in', () => {
    const custom = {
      ...builtIn,
      orderIndex: -1,
      source: 'user_created' as const,
      locale: 'sv' as const,
      title: 'Samtalet med Erik',
    }
    const read = localizeScenario(custom, 'en')
    expect(read.contentLocale).toBe('sv')
    expect(read.title).toBe('Samtalet med Erik')
    expect(conversationLocaleFor(custom, 'fr')).toBe('sv')
  })

  it('uses stored translations, and drops them from the result', () => {
    const daily = {
      ...builtIn,
      orderIndex: -1,
      source: 'daily' as const,
      translations: {
        es: { ...builtIn, title: 'Hola', characterName: 'Lucía' },
      },
    }
    const es = localizeScenario(daily, 'es')
    expect(es.title).toBe('Hola')
    expect(es.contentLocale).toBe('es')
    expect('translations' in es).toBe(false)
    // No Swedish was stored, so a Swedish reader gets English.
    expect(conversationLocaleFor(daily, 'sv')).toBe('en')
  })
})

describe('prompt language notes', () => {
  it('names the language and stays free of dashes', () => {
    for (const locale of LOCALES) {
      const notes = [
        writingRules(locale),
        coachLanguageNotes(locale),
        characterLanguageNotes(locale),
        scenarioLanguageNotes(locale),
      ].join('\n')
      expect(notes).not.toMatch(DASHES)
    }
    expect(characterLanguageNotes('sv')).toContain('Swedish')
    expect(writingRules('fr')).toContain('French')
  })
})

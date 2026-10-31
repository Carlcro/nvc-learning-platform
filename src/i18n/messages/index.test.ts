import { describe, expect, it } from 'vitest'
import { ACHIEVEMENTS } from '../../../convex/lib/progress'
import { en } from './en'
import { TRANSLATIONS, getMessages, mergeOver } from './index'

describe('mergeOver', () => {
  it('keeps English for anything a translation leaves out', () => {
    const base = { a: 'one', nested: { b: 'two', c: 'three' } }
    expect(mergeOver(base, { nested: { b: 'deux' } })).toEqual({
      a: 'one',
      nested: { b: 'deux', c: 'three' },
    })
  })

  it('replaces functions and arrays whole', () => {
    const base = { list: ['a', 'b'], fn: (n: number) => `${n} items` }
    const merged = mergeOver(base, { list: ['x'], fn: (n: number) => `${n} saker` })
    expect(merged.list).toEqual(['x'])
    expect(merged.fn(2)).toBe('2 saker')
  })
})

describe('dictionaries', () => {
  it('serves each language its own words', () => {
    expect(getMessages('sv').nav.links.home).not.toBe(en.nav.links.home)
    expect(getMessages('fr').common.components.feeling).toBe('Sentiment')
  })

  it('names every achievement the server can award', () => {
    for (const achievement of ACHIEVEMENTS) {
      expect(en.achievements[achievement.id]?.title).toBeTruthy()
    }
  })
})

const DASHES = /[\u2013\u2014]/

/** Every leaf of a dictionary, as [path, value]. */
function leaves(value: unknown, path = ''): Array<[string, unknown]> {
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    return Object.entries(value).flatMap(([key, child]) =>
      leaves(child, path ? `${path}.${key}` : key),
    )
  }
  return [[path, value]]
}

/** Call a dictionary function with a few plausible argument sets. */
function sampleOutputs(fn: (...args: Array<never>) => unknown): Array<string> {
  const argSets: Array<Array<unknown>> = [
    [2, 3, 4],
    [1, 1, 1],
    ['Sam', 2, 3],
    ['Sam', 'Sam', 'Sam'],
    [['a', 'b'], 2],
  ]
  const outputs: Array<string> = []
  for (const args of argSets) {
    try {
      const result = (fn as (...a: Array<unknown>) => unknown)(...args)
      outputs.push(...leaves(result).map(([, v]) => String(v)))
    } catch {
      // Not the argument shape this function takes; another set will be.
    }
  }
  return outputs
}

describe.each(['fr', 'es', 'sv'] as const)('the %s dictionary', (locale) => {
  const translation = TRANSLATIONS[locale]
  const merged = getMessages(locale)

  it('translates every string English has', () => {
    const own = new Map(leaves(translation))
    for (const [path] of leaves(en)) {
      expect(own.has(path), path).toBe(true)
    }
  })

  it('names every achievement the server can award', () => {
    for (const achievement of ACHIEVEMENTS) {
      expect(merged.achievements[achievement.id]?.title).toBeTruthy()
    }
  })

  it('is free of dashes, in plain strings and in what functions write', () => {
    const english = new Map(leaves(en))
    for (const [path, value] of leaves(merged)) {
      const texts =
        typeof value === 'function'
          ? sampleOutputs(value as (...args: Array<never>) => unknown)
          : [String(value)]
      // A sample argument the function does not expect can print
      // "undefined" in English too; only a translation that adds it is wrong.
      const englishValue = english.get(path)
      const englishSaysUndefined =
        typeof englishValue === 'function' &&
        sampleOutputs(
          englishValue as (...args: Array<never>) => unknown,
        ).some((t) => t.includes('undefined'))
      for (const text of texts) {
        expect(text, path).not.toMatch(DASHES)
        if (!englishSaysUndefined) {
          expect(text, path).not.toContain('undefined')
        }
      }
    }
  })
})

import { describe, expect, it } from 'vitest'
import { isLocale, matchLocale, parseAcceptLanguage } from './locale'

describe('parseAcceptLanguage', () => {
  it('orders tags by weight', () => {
    expect(parseAcceptLanguage('en;q=0.5, sv-SE, fr;q=0.8')).toEqual([
      'sv-SE',
      'fr',
      'en',
    ])
  })

  it('drops wildcards and zero weights', () => {
    expect(parseAcceptLanguage('*, de;q=0, es')).toEqual(['es'])
  })

  it('handles a missing header', () => {
    expect(parseAcceptLanguage(undefined)).toEqual([])
  })
})

describe('matchLocale', () => {
  const all = ['en', 'fr', 'es', 'sv'] as const

  it('matches on the primary subtag', () => {
    expect(matchLocale(['fr-CH', 'en'], all)).toBe('fr')
  })

  it('skips languages the app does not offer', () => {
    expect(matchLocale(['de-DE', 'es-MX'], all)).toBe('es')
  })

  it('falls back to English', () => {
    expect(matchLocale(['de'], all)).toBe('en')
    expect(matchLocale([], all)).toBe('en')
  })

  it('only picks allowed locales', () => {
    expect(matchLocale(['sv'], ['en'])).toBe('en')
  })
})

describe('isLocale', () => {
  it('accepts known codes only', () => {
    expect(isLocale('sv')).toBe(true)
    expect(isLocale('de')).toBe(false)
    expect(isLocale(undefined)).toBe(false)
  })
})

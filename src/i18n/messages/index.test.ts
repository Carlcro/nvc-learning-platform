import { describe, expect, it } from 'vitest'
import { ACHIEVEMENTS } from '../../../convex/lib/progress'
import { en } from './en'
import { getMessages, mergeOver } from './index'

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
  it('serves English for a language without a translation yet', () => {
    expect(getMessages('sv')).toBe(getMessages('en'))
  })

  it('names every achievement the server can award', () => {
    for (const achievement of ACHIEVEMENTS) {
      expect(en.achievements[achievement.id]?.title).toBeTruthy()
    }
  })
})

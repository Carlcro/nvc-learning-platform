import { describe, expect, it } from 'vitest'
import { safeReturnPath, skipsOnboardingRedirect } from './onboarding'

describe('safeReturnPath', () => {
  it('keeps internal paths', () => {
    expect(safeReturnPath('/practice')).toBe('/practice')
    expect(safeReturnPath('/learn/feeling')).toBe('/learn/feeling')
  })

  it('refuses anything that could leave the site or loop', () => {
    expect(safeReturnPath('https://example.com')).toBeUndefined()
    expect(safeReturnPath('//example.com')).toBeUndefined()
    expect(safeReturnPath('/welcome')).toBeUndefined()
    expect(safeReturnPath('/auth')).toBeUndefined()
    expect(safeReturnPath(42)).toBeUndefined()
    expect(safeReturnPath(undefined)).toBeUndefined()
  })
})

describe('skipsOnboardingRedirect', () => {
  it('leaves the tour and sign-in alone', () => {
    expect(skipsOnboardingRedirect('/welcome')).toBe(true)
    expect(skipsOnboardingRedirect('/auth')).toBe(true)
    expect(skipsOnboardingRedirect('/practice')).toBe(false)
    expect(skipsOnboardingRedirect('/')).toBe(false)
  })
})

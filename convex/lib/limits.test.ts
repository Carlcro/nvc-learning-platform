import { describe, expect, it } from 'vitest'
import {
  MAX_HISTORY_MESSAGES,
  MAX_SCENARIO_GENERATIONS_PER_DAY,
  MAX_TURNS_PER_DAY,
  MAX_USER_TURNS,
  MIN_TURNS_TO_WRAP_UP,
  TURNS_REMAINING_WARNING,
} from './limits'

// These are plain constants, but the relationships between them are load
// bearing: get one wrong and a learner is either stranded in a conversation
// they cannot finish or cut off before they can start.
describe('practice limits', () => {
  it('lets a conversation reach the point where it can be wrapped up', () => {
    expect(MIN_TURNS_TO_WRAP_UP).toBeLessThan(MAX_USER_TURNS)
  })

  it('warns before the turn limit rather than after it', () => {
    expect(TURNS_REMAINING_WARNING).toBeLessThan(MAX_USER_TURNS)
    expect(TURNS_REMAINING_WARNING).toBeGreaterThan(0)
  })

  it('allows at least one full conversation within the daily budget', () => {
    expect(MAX_TURNS_PER_DAY).toBeGreaterThanOrEqual(MAX_USER_TURNS)
  })

  it('sends the model enough history to hold a conversation', () => {
    // Each turn adds a user message and a reply, so the window needs to span
    // several exchanges to be worth anything.
    expect(MAX_HISTORY_MESSAGES).toBeGreaterThanOrEqual(6)
  })

  it('keeps every limit a positive whole number', () => {
    for (const limit of [
      MAX_USER_TURNS,
      MIN_TURNS_TO_WRAP_UP,
      TURNS_REMAINING_WARNING,
      MAX_HISTORY_MESSAGES,
      MAX_TURNS_PER_DAY,
      MAX_SCENARIO_GENERATIONS_PER_DAY,
    ]) {
      expect(Number.isInteger(limit)).toBe(true)
      expect(limit).toBeGreaterThan(0)
    }
  })
})

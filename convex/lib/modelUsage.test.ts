import { describe, expect, it } from 'vitest'
import {
  MODEL,
  MODEL_PRICING,
  callRecord,
  costMicros,
  isPricedModel,
  microsToDollars,
} from './modelUsage'

const none = {
  inputTokens: 0,
  outputTokens: 0,
  cacheReadTokens: 0,
  cacheWriteTokens: 0,
}

describe('model pricing', () => {
  it('knows the price of the model the app actually calls', () => {
    // If MODEL changes and the table is not updated, every cost in the admin
    // panel would silently be an estimate.
    expect(isPricedModel(MODEL)).toBe(true)
  })

  it('charges list price for plain input and output', () => {
    // Sonnet 4.6: $3 per million in, $15 per million out.
    const micros = costMicros('claude-sonnet-4-6', {
      ...none,
      inputTokens: 1_000_000,
      outputTokens: 1_000_000,
    })
    expect(microsToDollars(micros)).toBe(18)
  })

  it('prices a typical practice turn at a few cents', () => {
    const analysis = costMicros(MODEL, {
      ...none,
      inputTokens: 2500,
      outputTokens: 350,
    })
    const reply = costMicros(MODEL, {
      ...none,
      inputTokens: 1800,
      outputTokens: 80,
    })
    const dollars = microsToDollars(analysis + reply)
    expect(dollars).toBeGreaterThan(0.01)
    expect(dollars).toBeLessThan(0.05)
  })

  it('bills cache reads at a tenth and cache writes at a quarter more', () => {
    const price = MODEL_PRICING[MODEL].input
    expect(costMicros(MODEL, { ...none, cacheReadTokens: 1000 })).toBe(
      Math.round(1000 * price * 0.1),
    )
    expect(costMicros(MODEL, { ...none, cacheWriteTokens: 1000 })).toBe(
      Math.round(1000 * price * 1.25),
    )
  })

  it('prices an unknown model as the current one rather than as free', () => {
    const usage = { ...none, inputTokens: 1000, outputTokens: 1000 }
    expect(costMicros('some-future-model', usage)).toBe(
      costMicros(MODEL, usage),
    )
  })

  it('never lets a bad token count produce a negative or NaN cost', () => {
    expect(
      costMicros(MODEL, {
        inputTokens: -5,
        outputTokens: Number.NaN,
        cacheReadTokens: 0,
        cacheWriteTokens: 0,
      }),
    ).toBe(0)
  })
})

describe('callRecord', () => {
  it('reads null cache fields as zero', () => {
    expect(
      callRecord('analysis', MODEL, {
        input_tokens: 10,
        output_tokens: 20,
        cache_read_input_tokens: null,
        cache_creation_input_tokens: null,
      }),
    ).toEqual({
      kind: 'analysis',
      model: MODEL,
      inputTokens: 10,
      outputTokens: 20,
      cacheReadTokens: 0,
      cacheWriteTokens: 0,
    })
  })
})

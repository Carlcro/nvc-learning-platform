import { v } from 'convex/values'

/**
 * What the model costs us, measured rather than guessed.
 *
 * Every Claude call reports the tokens it used. We turn those into money here,
 * at write time, so a later price change never rewrites what a past call cost.
 * Everything is a pure function so it can be tested without a deployment.
 */

/**
 * The model behind everything except the roleplay character. Shared so pricing
 * can never drift from it.
 */
export const MODEL = 'claude-sonnet-4-6'

/**
 * The model that plays the roleplay character. Kept apart from MODEL so the
 * character can move ahead without changing how messages are scored: a
 * different scorer would shift stars and points for everyone.
 */
export const CHARACTER_MODEL = 'claude-sonnet-5-5'

/** What a call was for. Lets the admin panel say which feature costs what. */
export const MODEL_CALL_KINDS = [
  'analysis', // scoring and coaching for one practice turn
  'character_reply', // the roleplay character's answer for one practice turn
  'reflection', // the worked example written after a conversation
  'scenario_readiness', // clarifying questions while shaping a custom scenario
  'scenario_generation', // building the custom scenario itself
  'daily_challenges', // the nightly cron, which belongs to no user
] as const

export type ModelCallKind = (typeof MODEL_CALL_KINDS)[number]

export const modelCallKindValidator = v.union(
  v.literal('analysis'),
  v.literal('character_reply'),
  v.literal('reflection'),
  v.literal('scenario_readiness'),
  v.literal('scenario_generation'),
  v.literal('daily_challenges'),
)

/** Token counts as the Claude API reports them. */
export interface TokenUsage {
  inputTokens: number
  outputTokens: number
  cacheReadTokens: number
  cacheWriteTokens: number
}

interface ModelPrice {
  /** US dollars per million input tokens. */
  input: number
  /** US dollars per million output tokens. */
  output: number
}

/**
 * List prices in US dollars per million tokens. A dollar per million tokens is
 * exactly one micro-dollar per token, which is why costs are kept in
 * micro-dollars: the arithmetic stays in whole-ish numbers and never loses a
 * fraction of a cent to rounding.
 */
export const MODEL_PRICING: Record<string, ModelPrice> = {
  'claude-fable-5-1': { input: 10, output: 50 },
  'claude-opus-5': { input: 5, output: 25 },
  'claude-opus-4-8': { input: 5, output: 25 },
  'claude-sonnet-5-5': { input: 2, output: 10 },
  'claude-sonnet-5': { input: 2, output: 10 },
  'claude-sonnet-4-6': { input: 3, output: 15 },
  'claude-haiku-4-5': { input: 1, output: 5 },
}

// Cached input is billed relative to the normal input rate.
const CACHE_READ_MULTIPLIER = 0.1
const CACHE_WRITE_MULTIPLIER = 1.25

/** Whether we know what this model costs. Unknown models price as MODEL. */
export function isPricedModel(model: string): boolean {
  return model in MODEL_PRICING
}

/**
 * Cost of one call in micro-dollars (millionths of a US dollar).
 *
 * A model missing from the table is priced as the app's current model rather
 * than as free: an estimate that is slightly off is more useful than a zero
 * that hides real spend.
 */
export function costMicros(model: string, usage: TokenUsage): number {
  const price = isPricedModel(model)
    ? MODEL_PRICING[model]
    : MODEL_PRICING[MODEL]

  const cost =
    clean(usage.inputTokens) * price.input +
    clean(usage.outputTokens) * price.output +
    clean(usage.cacheReadTokens) * price.input * CACHE_READ_MULTIPLIER +
    clean(usage.cacheWriteTokens) * price.input * CACHE_WRITE_MULTIPLIER

  return Math.round(cost)
}

function clean(tokens: number): number {
  return Number.isFinite(tokens) && tokens > 0 ? tokens : 0
}

/** One call's usage, ready to hand to usage.recordModelCalls. */
export interface ModelCallRecord extends TokenUsage {
  kind: ModelCallKind
  model: string
}

/**
 * Read the token counts off a Claude response. The cache fields are null when
 * caching is not in play, and absent on older SDK shapes.
 */
export function callRecord(
  kind: ModelCallKind,
  model: string,
  usage: {
    input_tokens: number
    output_tokens: number
    cache_read_input_tokens?: number | null
    cache_creation_input_tokens?: number | null
  },
): ModelCallRecord {
  return {
    kind,
    model,
    inputTokens: usage.input_tokens,
    outputTokens: usage.output_tokens,
    cacheReadTokens: usage.cache_read_input_tokens ?? 0,
    cacheWriteTokens: usage.cache_creation_input_tokens ?? 0,
  }
}

/** Micro-dollars to US dollars. */
export function microsToDollars(micros: number): number {
  return micros / 1_000_000
}

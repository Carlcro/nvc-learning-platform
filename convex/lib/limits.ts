/**
 * Limits on how much model work one person can ask for.
 *
 * Every practice turn costs two Claude calls, so without a ceiling a single
 * account can run the API bill up without limit, and a conversation that never
 * reaches its milestones can go on forever. These are shared with the frontend
 * so the UI can show the same numbers it is held to.
 */

/**
 * User messages allowed in one conversation. Generous enough for a full arc
 * with room to recover from rough turns, bounded enough that a stuck
 * conversation cannot bill indefinitely.
 */
export const MAX_USER_TURNS = 15

/**
 * User turns before wrapping up becomes available. Below this there is not
 * enough of a conversation to reflect on; at or above it, someone who cannot
 * reach the milestones can still bank what they managed.
 */
export const MIN_TURNS_TO_WRAP_UP = 3

/** When to start telling the user how many turns are left. */
export const TURNS_REMAINING_WARNING = 5

/**
 * Messages of prior conversation sent to the model with each turn. Both calls
 * resend the history, so an uncapped window makes cost grow quadratically with
 * conversation length. The character and the scoring both only need the recent
 * exchanges; milestones carry the longer arc.
 */
export const MAX_HISTORY_MESSAGES = 16

/**
 * Practice turns one account can take per day, across all conversations, and
 * custom scenarios it can generate. These bound total spend rather than
 * shaping a single conversation.
 */
export const MAX_TURNS_PER_DAY = 100
export const MAX_SCENARIO_GENERATIONS_PER_DAY = 10

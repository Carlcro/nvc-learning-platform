import { cronJobs } from 'convex/server'
import { internal } from './_generated/api'

/**
 * Scheduled jobs for the NVC Learning Platform
 *
 * This module sets up cron jobs for recurring tasks like generating daily challenges
 */

const crons = cronJobs()

/**
 * Generate new daily challenge scenarios at midnight UTC
 * Runs every day at 00:00 UTC
 */
crons.daily(
  'generate-daily-challenges',
  {
    hourUTC: 0,
    minuteUTC: 0,
  },
  internal.dailyChallenges.generateDailyChallenge,
)

/**
 * Clear out daily challenges past the retention window, an hour after the new
 * ones are generated. Without this the scenarios table grows by three rows a
 * night forever.
 */
crons.daily(
  'prune-old-daily-challenges',
  {
    hourUTC: 1,
    minuteUTC: 0,
  },
  internal.dailyChallenges.pruneOldChallenges,
)

/**
 * Trim the raw model call log. The daily and lifetime rollups keep the totals,
 * so only the detail ages out.
 */
crons.daily(
  'prune-old-model-calls',
  {
    hourUTC: 2,
    minuteUTC: 0,
  },
  internal.usage.pruneOldModelCalls,
)

export default crons

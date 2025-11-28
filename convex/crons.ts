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

export default crons

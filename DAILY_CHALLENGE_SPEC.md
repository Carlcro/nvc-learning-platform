# Daily Challenge System

Status: shipped. This document describes the system as built. The code is the source of truth: `convex/dailyChallenges.ts`, `convex/dailyChallengesGeneration.ts`, `convex/crons.ts`, and `convex/conversations.ts`.

## Overview

Every day, three fresh practice scenarios are generated (easy, medium, hard) and offered as daily challenges. Each user sees the challenge matching their recommended difficulty, with the other two available as alternatives. Completing any of today's challenges earns that challenge's advertised bonus points on top of the normal scenario rewards.

Challenge days follow UTC (the cron runs at midnight UTC); practice streaks follow the user's local calendar day.

## Generation

- A cron in `convex/crons.ts` runs daily at 00:00 UTC and calls `internal.dailyChallenges.generateDailyChallenge`.
- Generation uses the Claude API (model `claude-sonnet-4-6`) via a Convex Node action; the prompt and validation live in `convex/dailyChallengesGeneration.ts` (`generateThreeScenarios`).
- Each generated scenario is persisted as a real row in the `scenarios` table with `source: 'daily'` and `orderIndex: -1`, which keeps it out of the linear practice ladder while making it fully playable through the normal conversation flow.
- One `dailyChallenges` row is created per difficulty for the day, with fixed bonus points:
  - easy: 50
  - medium: 75
  - hard: 100
- To generate manually (for a new deployment or testing):

```bash
npx convex run dailyChallenges:generateDailyChallenge
```

## Serving challenges to users

- `api.dailyChallenges.getMyChallenge` loads today's challenges, determines the user's recommended difficulty from their level and average score, and returns:
  - the recommended challenge (falling back to the nearest easier difficulty if a day has fewer than three)
  - the other difficulties as `alternatives`
  - the user's completion state for today (completing ANY of today's challenges counts as done for the day)
- `api.dailyChallenges.getDailyChallenge` is a lighter query for the signed-in home dashboard card.
- `api.dailyChallenges.getUserChallengeStats` powers challenge stats.

## Completion and rewards

There is no separate challenge completion endpoint. Completion is credited inside `api.conversations.complete` (server-side and idempotent):

- When a conversation for a daily challenge scenario completes, a `challengeCompletions` row is written.
- The bonus awarded is exactly the challenge's advertised `bonusPoints` (no multipliers), added on top of the normal completion points.
- Streaks, levels, averages, and achievements update through the same pipeline as any other completion (see `convex/lib/progress.ts`).

## Data model

```typescript
// dailyChallenges
{
  date: string // "2026-07-09" (UTC day)
  scenarioId: Id<'scenarios'>
  difficulty: 'easy' | 'medium' | 'hard'
  description: string
  bonusPoints: number // 50 / 75 / 100
}

// challengeCompletions
{
  userId: Id<'users'>
  challengeId: Id<'dailyChallenges'>
  conversationId: Id<'conversations'>
  completed: boolean
  score: number
  completedAt: number
}
```

## Security notes

- Generation functions are internal (`internalAction` / `internalMutation`); they can only run via the cron, `npx convex run`, or the dashboard.
- All user-facing queries derive the user via `getAuthUserId`.
- Completion crediting and bonus awards happen server-side from server-held data; the client can never claim a bonus directly.

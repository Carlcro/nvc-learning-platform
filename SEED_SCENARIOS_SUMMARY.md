# Seed Scenarios Summary

Location: the scenario arrays live directly in `convex/scenarios.ts` (`BEGINNER_SCENARIOS`, `INTERMEDIATE_SCENARIOS`, `ADVANCED_SCENARIOS`).

## How to seed

Seeding is an internal mutation, runnable only from the CLI or the Convex dashboard:

```bash
npx convex run scenarios:seedAll
```

`seedAll` inserts all three arrays, but only when the `scenarios` table is empty. If any scenarios already exist it does nothing and reports the existing count, so it is safe to run repeatedly.

## The seeded scenarios (9 total)

### Beginner (3)

| Order | Title | Category | Character |
|-------|-------|----------|-----------|
| 0 | Colleague Feedback | workplace | Jordan |
| 1 | Family Responsibility Conflict | family | Alex |
| 2 | Friend Canceled Plans | friendship | Sam |

Beginner scenarios focus on single NVC components with forgiving character responses (initial moods close to neutral).

### Intermediate (4)

| Order | Title | Category | Character |
|-------|-------|----------|-----------|
| 3 | Romantic Partner Emotional Distance | self_expression | Casey |
| 4 | Workplace Boundary with Boss | workplace | Morgan |
| 5 | Friend's Hurtful Comment About Your Appearance | friendship | Taylor |
| 6 | Parent Critical of Your Life Choices | family | Pat |

### Advanced (2)

| Order | Title | Category | Character |
|-------|-------|----------|-----------|
| 7 | Team Member Undermining You at Work | workplace | Riley |
| 8 | Navigating Different Parenting Styles with Co-Parent | family | Jordan |

## Schema notes

- All scenarios use the current schema in `convex/schema.ts`: `learningObjectives`, `characterInitialMood`, `characterBackground`, `characterHiddenNeeds`, `aiOpeningMessage`, `focusArea`, `orderIndex`, `unlockRequirements`, `estimatedDuration`, `tags`, `isActive`.
- `orderIndex` (0-8) sorts the practice hub into a learning path. Daily challenge scenarios and user-created custom scenarios use `orderIndex: -1` to stay out of this ladder.
- `unlockRequirements` is present on every scenario for schema compatibility but is **not enforced**: scenarios are open access by design. The user's level only drives a "recommended" hint in the practice hub.

## Related scenario sources

Besides the seeded set, scenario rows are also created by:

- The daily challenge cron (`source: 'daily'`), three fresh scenarios per day
- The custom scenario builder at `/practice/create` (private, owned by their creator)

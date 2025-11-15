# Beginner Scenarios Seed Data

Created: November 8, 2025
Location: `convex/scenarios/seed.ts`

## Overview

Created 5 beginner-level scenarios for users to practice NVC. These scenarios follow the **SCENARIO_PROGRESSION_SPEC.md** schema and are designed for progressive learning.

---

## Scenarios Created

### 1. First Steps (orderIndex: 0)
- **Category**: Workplace
- **Character**: Jamie (friendly coworker)
- **Initial Mood**: +5 (very positive and open)
- **Focus**: Foundational practice with empathetic support
- **Learning Objectives**: observation, feeling
- **Duration**: 8 minutes
- **Key Feature**: Safe, low-stakes environment for beginners

**Opening Message**: 
> "Hey! I'm so glad we're doing this. No pressure at all - this is just about practicing. What's something on your mind that you'd like to talk about?"

---

### 2. Missed Deadline (orderIndex: 1)
- **Category**: Workplace
- **Character**: Alex (stressed colleague)
- **Initial Mood**: -3 (slightly defensive)
- **Focus**: Conflict resolution
- **Learning Objectives**: observation, feeling, need, request
- **Duration**: 10 minutes
- **Key Feature**: User's colleague missed deadline; practice expressing frustration without blame

**Opening Message**: 
> "Look, I know the report is late. I've been completely swamped this week. Can we talk about this later?"

---

### 3. Forgotten Plans (orderIndex: 2)
- **Category**: Friendship
- **Character**: Casey (apologetic but defensive friend)
- **Initial Mood**: -2 (slightly guilty and defensive)
- **Focus**: Boundary setting
- **Learning Objectives**: observation, feeling, need
- **Duration**: 9 minutes
- **Key Feature**: Friend cancelled last minute; practice expressing hurt while understanding perspective

**Opening Message**: 
> "I'm so sorry about cancelling. Work just threw this at me and I couldn't say no. I know it sucks, but hopefully you understand?"

---

### 4. Household Chores (orderIndex: 3)
- **Category**: Family
- **Character**: Jordan (forgetful teenager)
- **Initial Mood**: -1 (neutral leaning defensive)
- **Focus**: Family communication
- **Learning Objectives**: observation, feeling, request
- **Duration**: 9 minutes
- **Key Feature**: Teenager forgot chores; practice making clear requests while understanding their perspective

**Opening Message**: 
> "I know, I know... I forgot again. But honestly, I don't see why it's such a big deal. Everyone does it eventually."

---

### 5. Team Meeting Criticism (orderIndex: 4)
- **Category**: Workplace
- **Character**: Morgan (direct boss)
- **Initial Mood**: 0 (neutral)
- **Focus**: Feedback reception
- **Learning Objectives**: observation, feeling, need
- **Duration**: 10 minutes
- **Key Feature**: Boss gave public critical feedback; practice receiving feedback with empathy

**Opening Message**: 
> "I know that feedback stung, but I need the team to step up. Your project has had some real issues, and we need to talk about how to fix it."

---

## Schema Alignment

All scenarios follow the **SCENARIO_PROGRESSION_SPEC.md** schema with these fields:

✅ **Basic Info**
- title, description, category, difficulty

✅ **Character Info**
- characterName, characterPersonality, characterInitialMood
- characterBackground, characterHiddenNeeds
- situation, aiOpeningMessage

✅ **Learning**
- learningObjectives (array of NVC components)
- focusArea (specific learning area)

✅ **Progression**
- orderIndex (0-4 for linear progression)
- unlockRequirements (minLevel, requiredScenarios, minStarsTotal)

✅ **Metadata**
- estimatedDuration, tags, isActive, createdAt

---

## How to Use

### Option 1: Run Seed Mutation (Recommended)

From Convex dashboard or your app:

```typescript
// In your React component
import { useMutation } from 'convex/react'
import { api } from './_generated/api'

function SeedScenarios() {
  const seedScenarios = useMutation(api.scenarios.seed.seedBeginnersScenarios)
  
  return (
    <button onClick={() => seedScenarios()}>
      Seed Beginner Scenarios
    </button>
  )
}
```

Or via CLI:
```bash
npx convex run scenarios.seed:seedBeginnersScenarios
```

### Option 2: Import Data Directly

Use the `BEGINNER_SCENARIOS` constant in your seed functions:

```typescript
import { BEGINNER_SCENARIOS } from './scenarios/seed'

// Use in your own seeding logic
```

---

## Notes

### Schema Compatibility

⚠️ **Important**: The existing `convex/scenarios.ts` file uses the **old schema** (learningGoals, characterEmotionalState, unlockLevel).

The new `convex/scenarios/seed.ts` uses the **updated schema** from SCENARIO_PROGRESSION_SPEC.md (learningObjectives, characterInitialMood, orderIndex, unlockRequirements).

**Action Items**:
1. Migrate existing scenarios.ts to new schema OR
2. Keep both and manage separately OR
3. Replace scenarios.ts with new schema version

Recommend: Update scenarios.ts to use the new schema for consistency.

### Progression System

- **Unlock Requirements**: All beginner scenarios have `minLevel: 1` and no required prerequisite scenarios
- **Linear Progression**: orderIndex 0-4 ensures proper sequencing
- **Character Mood Range**: Ranges from -3 to +5 (all relatively accessible for beginners)
- **Duration**: 8-10 minutes each (ideal for learning sessions)

---

## Next Steps

1. ✅ Review scenarios for accuracy and tone
2. ⏳ Run seed mutation to populate database
3. ⏳ Create scenario unlock logic (check orderIndex)
4. ⏳ Build scenario selection UI
5. ⏳ Test conversation flows with AI

---

**File**: convex/scenarios/seed.ts (9.5 KB)
**Total Scenarios**: 5 beginner-level
**Status**: Ready to seed

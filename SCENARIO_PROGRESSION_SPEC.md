# Scenario Progression System - Implementation Specification

## Overview

This document defines the complete scenario progression system for the NVC Learning Platform. Users practice Non-Violent Communication through AI-powered conversations, receive real-time feedback, and progress through scenarios like a learning game.

**Core Philosophy**: Make learning NVC feel like a rewarding journey, not a test. Celebrate growth, provide specific feedback, and make it safe to fail and try again.

---

## Design Decision: Open Access (read this first)

**Scenarios are never locked.** This is the shipped, intended design, not an oversight.

- Every scenario is playable by every user at any time. The user's level only drives a "recommended" hint in the practice hub so newcomers know where to start.
- The `unlockRequirements` field still exists in the schema (`convex/schema.ts`) but is **not enforced** anywhere. It is a schema leftover from an earlier plan, kept for compatibility.
- The `locked` status value in `scenarioProgress` is likewise unused in practice.
- Any text in this document that describes unlock gates, lock icons, or "complete X to unlock Y" reflects the original plan and should be read as superseded by open access. It is kept for historical context on the rest of the design (scoring, stars, feedback), which did ship.

Rationale: the app should embody NVC values. Gating practice behind performance felt like a test; an open library with a warm recommendation felt like an invitation.

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Data Models](#data-models)
3. [Success Criteria & Scoring](#success-criteria--scoring)
4. [Progression Rules](#progression-rules)
5. [Feedback System](#feedback-system)
6. [UI Components](#ui-components)
7. [AI Integration](#ai-integration)
8. [User Journey](#user-journey)
9. [Implementation Phases](#implementation-phases)

---

## System Architecture

### High-Level Flow

```
User selects any scenario (all scenarios are open; the hub highlights a recommendation)
    ↓
Start conversation (create conversation record)
    ↓
User sends message → AI analyzes (NVC scoring)
    ↓
Track conversation state (scores, character mood, objectives)
    ↓
AI generates character response (adapts to user's NVC quality)
    ↓
Display both score and response
    ↓
Repeat conversation loop
    ↓
User ends conversation OR meets completion criteria
    ↓
Calculate final results
    ↓
Update scenarioProgress (award stars, update bests)
    ↓
Show results screen with detailed feedback
    ↓
User can: retry, view transcript, or continue to next
```

### Key Components

1. **Scenario Management** - Define and organize scenarios
2. **Progress Tracking** - Track user completion status per scenario
3. **Conversation Engine** - Handle active conversations
4. **Scoring System** - Evaluate NVC quality in real-time
5. **Feedback Generator** - Provide personalized coaching
6. **Recommendation System** - Suggest a fitting scenario for the user's level (nothing is ever locked)
7. **Results Display** - Show comprehensive feedback after completion

---

## Data Models

### Convex Schema Updates

```typescript
// convex/schema.ts

import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  // ... existing tables (users, authTables, etc.)

  /**
   * Scenarios - The practice conversations available
   */
  scenarios: defineTable({
    // Basic Info
    title: v.string(),
    description: v.string(),
    category: v.union(
      v.literal("workplace"),
      v.literal("family"),
      v.literal("friendship"),
      v.literal("self_expression")
    ),
    difficulty: v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced")
    ),
    
    // Character Info
    characterName: v.string(),
    characterPersonality: v.string(), // AI system prompt
    characterInitialMood: v.number(), // -10 to +10
    situation: v.string(), // Context/backstory
    aiOpeningMessage: v.string(), // First message from character
    
    // Learning Goals
    learningObjectives: v.array(v.string()), // ["observation", "feeling", "need", "request"]
    focusArea: v.string(), // e.g., "conflict resolution", "boundary setting"
    
    // Progression
    orderIndex: v.number(), // Sorts the practice hub into a learning path
    // NOTE: kept in the schema for compatibility but NOT enforced.
    // Scenarios are open access by design; see the note at the top.
    unlockRequirements: v.object({
      minLevel: v.number(),
      requiredScenarios: v.array(v.string()),
      minStarsTotal: v.optional(v.number()),
    }),
    
    // Metadata
    estimatedDuration: v.number(), // minutes
    tags: v.array(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_category", ["category"])
    .index("by_difficulty", ["difficulty"])
    .index("by_order", ["orderIndex"]),

  /**
   * Scenario Progress - User's status for each scenario
   */
  scenarioProgress: defineTable({
    userId: v.id("users"),
    scenarioId: v.id("scenarios"),

    // Status
    status: v.union(
      v.literal("locked"),      // Unused in practice (open access design)
      v.literal("available"),   // Can start
      v.literal("in_progress"), // Started but not completed
      v.literal("attempted"),   // Attempted but scored <60 (no stars earned)
      v.literal("passed"),      // Completed with 60-84 score (1-2 stars)
      v.literal("mastered")     // Completed with 85+ score (3 stars)
    ),
    
    // Performance
    attempts: v.number(),
    bestScore: v.number(),          // 0-100
    bestStars: v.number(),          // 0-3
    lastScore: v.optional(v.number()),
    
    // First completion
    firstCompletedAt: v.optional(v.number()),
    firstCompletionScore: v.optional(v.number()),
    firstCompletionStars: v.optional(v.number()),
    
    // Most recent attempt
    lastAttemptAt: v.number(),
    currentConversationId: v.optional(v.id("conversations")),
    
    // Learning objectives completion
    objectivesCompleted: v.array(v.string()), // Which objectives user has demonstrated
    objectiveScores: v.optional(
      v.object({
        observation: v.number(),
        feeling: v.number(),
        need: v.number(),
        request: v.number(),
      })
    ),
    
    // All conversation attempts
    conversationIds: v.array(v.id("conversations")),
    
    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_scenario", ["scenarioId"])
    .index("by_user_and_scenario", ["userId", "scenarioId"])
    .index("by_status", ["userId", "status"]),

  /**
   * Conversations - Active and completed scenario conversations
   */
  conversations: defineTable({
    userId: v.id("users"),
    scenarioId: v.id("scenarios"),
    
    // Messages
    messages: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
        timestamp: v.number(),
        
        // NVC Analysis (for user messages)
        nvcScore: v.optional(
          v.object({
            observation: v.number(),
            feeling: v.number(),
            need: v.number(),
            request: v.number(),
            total: v.number(),
          })
        ),
        feedback: v.optional(v.string()),
        isJackalLanguage: v.optional(v.boolean()),
        jackalPhrases: v.optional(v.array(v.string())),
        giraffeAlternative: v.optional(v.string()),
        
        // Character state (for assistant messages)
        characterMood: v.optional(v.number()), // -10 to +10
      })
    ),
    
    // Conversation State
    status: v.union(
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("abandoned")
    ),
    
    // Real-time tracking
    messageCount: v.number(),
    averageNVCScore: v.number(),
    currentCharacterMood: v.number(), // -10 to +10
    giraffeStreakCount: v.number(), // Consecutive good NVC messages
    jackalLanguageCount: v.number(),
    
    // Objectives tracking
    objectivesMetInConversation: v.array(v.string()),
    
    // Final Results (when completed)
    finalScore: v.optional(v.number()),
    finalStars: v.optional(v.number()),
    completionStatus: v.optional(
      v.union(
        v.literal("excellent"),  // 85+
        v.literal("success"),    // 70-84
        v.literal("pass"),       // 60-69
        v.literal("incomplete")  // < 60
      )
    ),
    
    // Feedback
    whatWentWell: v.optional(v.array(v.string())),
    roomToGrow: v.optional(v.array(v.string())),
    personalizedSuggestions: v.optional(v.array(
      v.object({
        component: v.string(),
        issue: v.string(),
        example: v.object({
          whatYouSaid: v.string(),
          betterApproach: v.string(),
          why: v.string(),
        }),
        practiceTip: v.string(),
      })
    )),
    
    // Timestamps
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
    lastMessageAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_scenario", ["scenarioId"])
    .index("by_user_and_scenario", ["userId", "scenarioId"])
    .index("by_status", ["userId", "status"]),

  /**
   * User Progress - Overall user statistics
   */
  userProgress: defineTable({
    userId: v.id("users"),
    
    // Level & Points
    level: v.number(),
    totalPoints: v.number(),
    pointsToNextLevel: v.number(),
    
    // Scenarios
    scenariosCompleted: v.number(),
    scenariosPassed: v.number(),     // 60+ score
    scenariosMastered: v.number(),   // 85+ score
    totalStars: v.number(),          // Sum of all stars earned
    
    // Streaks
    currentStreak: v.number(),       // Days in a row
    longestStreak: v.number(),
    lastPracticeDate: v.string(),    // "2025-01-15"
    
    // NVC Component Averages (across all conversations)
    averageScores: v.object({
      observation: v.number(),
      feeling: v.number(),
      need: v.number(),
      request: v.number(),
      overall: v.number(),
    }),
    
    // Achievements
    achievements: v.array(v.string()), // Achievement IDs
    badges: v.array(v.string()),       // Badge IDs
    
    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),
})
```

---

## Success Criteria & Scoring

### Completion Criteria

A scenario is considered **completed** (with at least 1 star) when all of the following are met:

1. **Minimum Messages**: At least 5 user messages sent
2. **Minimum Score**: Average NVC score ≥ 60 (REQUIRED to earn a star)
3. **Character De-escalation**: Character mood improved by at least +3 from start

**Important**: If a scenario is attempted but scores below 60, the scenario is marked as **"Attempted"** (no stars earned). The user is warmly encouraged to try again for a star, but nothing is blocked; all other scenarios remain open.

### Star Rating System

Stars are awarded based on final average NVC score:

| Stars | Score Range | Status | Description |
|---------|-------------|--------|-------------|
| 1 star | 60-69 | Passed | Basic NVC demonstrated |
| 2 stars | 70-84 | Success | Good NVC with minor improvements |
| 3 stars | 85-100 | Excellent | Mastery of NVC principles |
| none | 0-59 | Attempted | More practice needed, worth another try |

### Points System

Points are awarded for completing scenarios:

- **First time completing**: 100 points × star rating
- **Improving score**: 50 points per additional star
- **Perfect score (100)**: Bonus 200 points
- **Daily practice bonus**: +50 points

### Level System

Users level up based on total points:

```typescript
function calculateLevel(totalPoints: number): number {
  // Level 1: 0-299 points
  // Level 2: 300-699 points
  // Level 3: 700-1199 points
  // Level 4: 1200-1799 points
  // Level 5: 1800-2499 points
  // Etc.
  
  if (totalPoints < 300) return 1
  if (totalPoints < 700) return 2
  if (totalPoints < 1200) return 3
  if (totalPoints < 1800) return 4
  if (totalPoints < 2500) return 5
  
  // After level 5, each level requires 800 more points
  return 5 + Math.floor((totalPoints - 2500) / 800)
}
```

---

## Progression Rules

### Scenario Access: Open by Design (shipped behavior)

**Rule**: Every scenario is available to every user, always. See the "Design Decision: Open Access" section at the top of this document.

- `orderIndex` is used only to sort the practice hub into a sensible learning path.
- The user's level drives a "recommended" highlight, never a gate.
- `unlockRequirements` is present in the schema but unenforced; no code checks it.
- An earlier draft of this spec defined an `isScenarioUnlocked` gate that required completing the previous scenario with at least 1 star. That gate was deliberately not built.

### Attempt Limits

**Rule**: Users get unlimited attempts, but UI encourages moving forward after 3 tries

```typescript
interface AttemptGuidance {
  attemptNumber: number
  shouldShowSkipOption: boolean  // Show after 3 attempts
  shouldShowHints: boolean        // Show after 2 attempts
  shouldShowEasierVersion: boolean // Show after 4 attempts
}

function getAttemptGuidance(attempts: number): AttemptGuidance {
  return {
    attemptNumber: attempts,
    shouldShowSkipOption: attempts >= 3,
    shouldShowHints: attempts >= 2,
    shouldShowEasierVersion: attempts >= 4,
  }
}
```

### Re-attempting for Better Score

**Rule**: Users can always retry scenarios to improve their score/stars

```typescript
function canRetryScenario(progress: ScenarioProgress): boolean {
  // Can always retry
  return true
}

function shouldEncourageRetry(progress: ScenarioProgress): boolean {
  // Encourage if they passed but didn't master
  return progress.bestStars < 3
}
```

---

## Feedback System

### Real-Time Feedback (During Conversation)

**Triggers for real-time feedback:**

1. **After user message with score < 50**:
   ```
   That response included some judgmental language. 
   Try focusing on your own feelings and needs.
   ```

2. **After 3 consecutive low scores**:
   ```
   Tip: Remember the 4 components of NVC:
   1. Observation (what you see/hear)
   2. Feeling (your emotion)
   3. Need (what's important to you)
   4. Request (specific, doable action)
   ```

3. **After excellent message (score > 85)**:
   ```
   Great NVC! You made a clear observation without judgment 
   and connected it to your feelings.
   ```

4. **Character mood improving**:
   ```
   Alex is becoming more open to the conversation.
   Your empathetic approach is working!
   ```

5. **Objective completed**:
   ```
   Learning Objective Complete: You expressed a feeling 
   without blaming the other person!
   ```

### Post-Conversation Feedback Structure

```typescript
interface FeedbackReport {
  // Overall
  completionStatus: "excellent" | "success" | "pass" | "incomplete"
  stars: 0 | 1 | 2 | 3
  finalScore: number
  
  // Component Breakdown
  componentScores: {
    observation: number
    feeling: number
    need: number
    request: number
  }
  
  // Positives
  whatWentWell: string[] // 2-4 specific things
  strongestComponent: "observation" | "feeling" | "need" | "request"
  
  // Areas for Growth
  roomToGrow: string[] // 1-3 specific suggestions
  weakestComponent: "observation" | "feeling" | "need" | "request"
  
  // Specific Examples
  personalizedSuggestions: Array<{
    component: string
    issue: string
    example: {
      whatYouSaid: string        // Actual quote from conversation
      betterApproach: string      // Suggested rephrase
      why: string                 // Explanation
    }
    practiceTip: string
  }>
  
  // Character Journey
  characterMoodChange: {
    initial: number  // -10 to +10
    final: number
    description: string // "Alex went from defensive to open"
  }
  
  // Next Steps
  canProgress: boolean
  recommendations: {
    shouldRetry: boolean
    shouldMoveOn: boolean
    shouldReviewLessons: boolean
    suggestedNextScenario?: string
  }
}
```

### Feedback Generation Algorithm

```typescript
// AI-generated feedback based on conversation analysis
async function generateFeedback(
  conversation: Conversation,
  scenario: Scenario
): Promise<FeedbackReport> {
  
  // Calculate component averages
  const componentScores = calculateComponentAverages(conversation.messages)
  
  // Identify strengths
  const strongestComponent = Object.entries(componentScores)
    .sort(([, a], [, b]) => b - a)[0][0]
  
  // Identify weaknesses
  const weakestComponent = Object.entries(componentScores)
    .sort(([, a], [, b]) => a - b)[0][0]
  
  // Generate what went well (AI prompt)
  const whatWentWell = await generatePositiveFeedback({
    messages: conversation.messages,
    strongestComponent,
    learningObjectives: scenario.learningObjectives,
  })
  
  // Generate improvement suggestions (AI prompt)
  const roomToGrow = await generateImprovementSuggestions({
    messages: conversation.messages,
    weakestComponent,
    jackalPhrases: extractJackalPhrases(conversation.messages),
  })
  
  // Generate personalized examples from actual conversation
  const personalizedSuggestions = await generatePersonalizedExamples({
    messages: conversation.messages,
    weakestComponent,
  })
  
  return {
    completionStatus: determineStatus(conversation.averageNVCScore),
    stars: calculateStars(conversation.averageNVCScore),
    finalScore: conversation.averageNVCScore,
    componentScores,
    whatWentWell,
    strongestComponent,
    roomToGrow,
    weakestComponent,
    personalizedSuggestions,
    characterMoodChange: {
      initial: scenario.characterInitialMood,
      final: conversation.currentCharacterMood,
      description: generateMoodDescription(
        scenario.characterInitialMood,
        conversation.currentCharacterMood
      ),
    },
    canProgress: conversation.averageNVCScore >= 60,
    recommendations: generateRecommendations(conversation, scenario),
  }
}
```

---

## UI Components

### 1. Scenario Selection Card

**Location**: `/practice` route

```tsx
interface ScenarioCardProps {
  scenario: Scenario
  progress: ScenarioProgress | null
  isRecommended: boolean
}

// States (all scenarios are always open):
// - Available: Show "Start" button; the recommended scenario is highlighted
// - In Progress: Show "Continue" button, show partial progress
// - Completed: Show stars, best score, "Replay" or "Improve" button
```

**Visual Design**:
```
┌─────────────────────────────────────┐
│                                     │
│ Missed Deadline                     │
│ Workplace • Intermediate            │
│                                     │
│ Your colleague didn't deliver       │
│ the report on time...               │
│                                     │
│ 10 minutes                        │
│                                     │
│ [Start Practice →]                  │
└─────────────────────────────────────┘

OR (if completed):

┌─────────────────────────────────────┐
│ 3 stars - Mastered!                 │
│ Best Score: 88/100                  │
├─────────────────────────────────────┤
│ Missed Deadline                     │
│ Workplace • Intermediate            │
│                                     │
│ Attempts: 2                         │
│ First: 72  Best: 88                 │
│                                     │
│ [Improve Score] [View Best]         │
└─────────────────────────────────────┘
```

### 2. Pre-Scenario Brief

**Location**: `/practice/:scenarioId/brief` route

```tsx
interface ScenarioBriefProps {
  scenario: Scenario
  progress: ScenarioProgress | null
}

// Shows before starting conversation:
// - Scenario context
// - Character background
// - Learning objectives
// - Tips for success
// - Start button
```

**Visual Design**:
```
┌─────────────────────────────────────────┐
│  Missed Deadline                         │
│  Workplace • Intermediate • 10 min    │
├─────────────────────────────────────────┤
│                                          │
│  Situation:                           │
│  Your colleague Alex was responsible...  │
│                                          │
│  About Alex:                          │
│  Personality: Stressed, overworked...    │
│  Current mood: Defensive and anxious     │
│                                          │
│  What You'll Practice:                │
│  • Express frustration without blame    │
│  • Make clear requests (not demands)    │
│  • Show empathy while addressing issue  │
│                                          │
│  Tip:                                 │
│  Focus on your own needs rather than     │
│  Alex's behavior. Remember, you're both  │
│  on the same team.                       │
│                                          │
│  [← Back]          [Start Conversation] │
└─────────────────────────────────────────┘
```

### 3. Conversation Interface (Main Practice Screen)

**Location**: `/practice/:scenarioId/conversation/:conversationId`

**Layout**: Split screen on desktop, tabbed on mobile

```
Desktop:
┌────────────────────┬─────────────────┐
│  Conversation      │  Live Feedback  │
│                    │                 │
│  Alex:             │  Empathy Meter: │
│  "Look, I know..." │  [██████░░] 70% │
│                    │                 │
│  You:              │  Objectives:    │
│  "When you didn't" │  (x) Observation│
│  [Score: 75/100]   │  (x) Feeling    │
│                    │  ( ) Need       │
│  Alex:             │  ( ) Request    │
│  "I'm really..."   │                 │
│                    │  Hint:       │
│  ┌───────────────┐ │  Try connecting │
│  │ Type here...  │ │  your feeling   │
│  └───────────────┘ │  to a need      │
│  [Send]            │                 │
└────────────────────┴─────────────────┘

Mobile:
┌──────────────────────────────────────┐
│  [Conversation] [Feedback]  (Tabs)   │
├──────────────────────────────────────┤
│  (Active tab content)                │
└──────────────────────────────────────┘
```

**Key Features**:
- Real-time NVC scoring display
- Empathy meter (visual progress bar)
- Character mood indicator (defensive / neutral / open)
- Learning objectives checklist
- Inline feedback after each message
- Rewind button (optional: undo last 1-2 messages)
- End conversation button

### 4. Results Screen

**Location**: `/practice/:scenarioId/results/:conversationId`

```tsx
interface ResultsScreenProps {
  conversation: Conversation
  feedback: FeedbackReport
  scenario: Scenario
}
```

**Visual Design**:
```
┌───────────────────────────────────────────┐
│         Scenario Complete!             │
│                                           │
│           3 stars - Excellent!            │
│                                           │
│         Your NVC Score: 84/100            │
│                                           │
│  Component Breakdown:                     │
│  Observation:  88/100  ████████░░         │
│  Feeling:      75/100  ███████░░░         │
│  Need:         82/100  ████████░░         │
│  Request:      91/100  █████████░         │
│                                           │
│  What Went Well:                       │
│  • You made clear, specific requests      │
│  • Your observations were judgment-free   │
│  • You showed empathy for Alex's stress   │
│                                           │
│  Room to Grow:                         │
│  • Try connecting feelings to needs       │
│    more explicitly                        │
│  • In message #3, "you always..." is      │
│    a generalization. Try "this time"      │
│                                           │
│  Character Journey:                    │
│  Alex's mood: Defensive → Open            │
│                                           │
│  Rewards:                              │
│  + 300 points                             │
│  + 1 star (new best!)                     │
│  Recommended: Next scenario               │
│                                           │
│  [View Transcript] [Try Again] [Next →]  │
└───────────────────────────────────────────┘
```

### 5. Progress Dashboard

**Location**: `/progress` route

Shows overall statistics and progress:
- Current level and points
- Scenarios completed / total
- Average scores by component
- Recent activity
- Achievements/badges
- Streak counter

---

## AI Integration

**Note (shipped architecture)**: the code sketches below predate implementation. As built, a single action (`api.ai.submitTurn` in `convex/ai.ts`) runs the NVC analysis and the character reply in parallel, loads all state server-side, and persists both atomically via `internal.conversations.recordTurn`. The character never receives the user's score; it judges the message itself. Scores are never accepted from the client.

### AI Character System

**Goal**: AI character adapts its responses based on user's NVC quality

**Character Mood Tracking**:

```typescript
interface CharacterState {
  openness: number           // -10 (closed) to +10 (very open)
  defensiveness: number      // 0 (calm) to 10 (very defensive)
  trust: number              // 0 (no trust) to 10 (full trust)
  emotionalIntensity: number // 0 (calm) to 10 (intense)
}

// Update after each user message
function updateCharacterMood(
  currentState: CharacterState,
  userNVCScore: number,
  messageNumber: number
): CharacterState {
  let newState = { ...currentState }
  
  // Good NVC improves character state
  if (userNVCScore >= 80) {
    newState.openness += 2
    newState.defensiveness = Math.max(0, newState.defensiveness - 2)
    newState.trust += 1
    newState.emotionalIntensity = Math.max(0, newState.emotionalIntensity - 1)
  }
  // Mediocre NVC maintains state
  else if (userNVCScore >= 60) {
    newState.openness += 0.5
    newState.defensiveness = Math.max(0, newState.defensiveness - 0.5)
  }
  // Poor NVC worsens state
  else {
    newState.openness = Math.max(-10, newState.openness - 1)
    newState.defensiveness = Math.min(10, newState.defensiveness + 1)
    newState.emotionalIntensity = Math.min(10, newState.emotionalIntensity + 0.5)
  }
  
  // Natural de-escalation over time (people calm down)
  if (messageNumber > 5) {
    newState.emotionalIntensity = Math.max(0, newState.emotionalIntensity - 0.3)
  }
  
  // Clamp values
  newState.openness = Math.max(-10, Math.min(10, newState.openness))
  newState.trust = Math.max(0, Math.min(10, newState.trust))
  
  return newState
}
```

**AI Response Generation**:

```typescript
// Convex Action
export const generateCharacterResponse = action({
  args: {
    conversationId: v.id("conversations"),
    userMessage: v.string(),
    userNVCScore: v.number(),
  },
  handler: async (ctx, args) => {
    // Get conversation and scenario
    const conversation = await ctx.runQuery(api.conversations.get, {
      id: args.conversationId
    })
    const scenario = await ctx.runQuery(api.scenarios.get, {
      id: conversation.scenarioId
    })
    
    // Update character mood based on user's NVC quality
    const newMood = updateCharacterMood(
      conversation.currentCharacterMood,
      args.userNVCScore,
      conversation.messageCount
    )
    
    // Build AI system prompt
    const systemPrompt = `You are ${scenario.characterName}.

Personality: ${scenario.characterPersonality}
Situation: ${scenario.situation}

Your current emotional state:
- Openness: ${newMood.openness}/10 (${newMood.openness > 0 ? 'open' : 'closed'})
- Defensiveness: ${newMood.defensiveness}/10
- Trust: ${newMood.trust}/10

CRITICAL INSTRUCTIONS:
1. Stay in character at ALL times
2. Your responses must reflect your current emotional state
3. If openness > 5: Become collaborative, acknowledge their perspective
4. If defensiveness > 7: Push back, become more resistant
5. If trust > 7: Share vulnerabilities, express willingness to find solutions
6. React authentically to how they're communicating with you
7. Keep responses 2-4 sentences (conversational length)
8. Show emotional progression - gradually open up OR escalate based on their approach
9. NEVER break character or teach NVC explicitly
10. Show human emotions - frustration, relief, confusion, hope

Remember: You're a real person dealing with real emotions, not an NVC teacher.`

    // Call Claude API
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      system: systemPrompt,
      messages: [
        ...buildConversationHistory(conversation.messages),
        { role: "user", content: args.userMessage }
      ],
    })
    
    return {
      response: response.content[0].text,
      newCharacterMood: newMood,
    }
  }
})
```

### AI Scoring System

**Goal**: Analyze user messages for NVC components

```typescript
// Convex Action
export const analyzeNVCMessage = action({
  args: {
    message: v.string(),
    conversationContext: v.array(v.object({
      role: v.string(),
      content: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const analysisPrompt = `You are an expert NVC coach analyzing a user's response.

Conversation context:
${args.conversationContext.map(m => `${m.role}: ${m.content}`).join('\n')}

User's latest message: "${args.message}"

Analyze this message for the 4 NVC components. Be strict but fair.

OBSERVATION (0-25 points):
- Are there specific, concrete facts? (+8-10)
- Free from judgments/evaluations? (+8-10)
- No labels or interpretations? (+5-7)
Deductions: -5 per evaluative word, -10 for generalizations ("always", "never")

FEELING (0-25 points):
- Actual feeling words used? (+10-12)
- Feelings are owned ("I feel" not "you make me feel")? (+8-10)
- Not pseudo-feelings ("I feel like you...")? (+5-8)
Deductions: -10 for pseudo-feelings, -15 for blaming

NEED (0-25 points):
- Universal human need identified? (+10-12)
- Need vs strategy distinction clear? (+8-10)
- Feeling-need connection explicit? (+5-8)
Deductions: -10 for strategies disguised as needs, -15 for no need

REQUEST (0-25 points):
- Concrete and specific? (+8-10)
- Positive language (what TO do)? (+8-10)
- Request not demand (open to "no")? (+7-10)
Deductions: -10 for vague, -10 for negative, -15 for demands

Return JSON:
{
  "observation": <score>,
  "feeling": <score>,
  "need": <score>,
  "request": <score>,
  "total": <sum>,
  "feedback": "<1 sentence of encouraging, specific feedback>",
  "isJackalLanguage": <boolean>,
  "jackalPhrases": ["<phrase1>", "<phrase2>"],
  "giraffeAlternative": "<suggested rephrasing>",
  "whatWorked": "<what was good about this message>"
}`

    const analysis = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 600,
      messages: [{ role: "user", content: analysisPrompt }],
    })
    
    return JSON.parse(analysis.content[0].text)
  }
})
```

### AI Feedback Generation

```typescript
// Generate personalized improvement suggestions
export const generatePersonalizedFeedback = action({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.runQuery(api.conversations.get, {
      id: args.conversationId
    })
    
    // Extract user messages with low scores
    const weakMessages = conversation.messages
      .filter(m => m.role === "user" && m.nvcScore && m.nvcScore.total < 70)
      .slice(0, 3) // Focus on worst 3
    
    // Generate specific examples
    const feedbackPrompt = `As an NVC coach, provide specific, actionable feedback.

Weak messages from the conversation:
${weakMessages.map((m, i) => `${i + 1}. "${m.content}" (Score: ${m.nvcScore.total})`).join('\n')}

For each message, provide:
1. What the issue is (be specific)
2. The exact phrase that was problematic
3. A better way to say it using NVC
4. Why this approach is better
5. A practice tip they can use next time

Be encouraging and specific. Focus on growth, not criticism.

Return JSON array of suggestions.`

    const feedback = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [{ role: "user", content: feedbackPrompt }],
    })
    
    return JSON.parse(feedback.content[0].text)
  }
})
```

---

## User Journey

### First-Time User Experience

```
1. Complete foundational lessons (optional but recommended)
   ↓
2. Navigate to /practice
   ↓
3. See the full scenario list, with the first one highlighted as recommended
   ↓
4. Click "Start" → See scenario brief
   ↓
5. Click "Start Conversation" → Enter practice mode
   ↓
6. Tutorial overlay explains UI (first time only)
   ↓
7. AI character sends opening message
   ↓
8. User responds → See real-time NVC score
   ↓
9. Get feedback and tips as they practice
   ↓
10. Continue conversation (5-12 messages)
   ↓
11. Click "End Conversation" OR meet auto-complete criteria
   ↓
12. See results screen with detailed feedback
   ↓
13. If passed: Celebrate + recommend the next scenario
   ↓
14. If not passed: Encourage retry with specific tips
```

### Returning User Experience

```
1. Navigate to /practice
   ↓
2. See progress overview:
   - Current level
   - Scenarios completed
   - Next recommended scenario (highlighted)
   ↓
3. Choose to:
   - Continue where they left off
   - Retry previous scenario for better score
   - Jump to any scenario (all are open)
   ↓
4. Practice and receive feedback
   ↓
5. See progress updates (level up, new achievements, etc.)
```

### Completion Scenarios

**Scenario A: Mastered (85+ score)**
```
Results Screen:
- "Excellent!" message with 3 stars
- Detailed score breakdown
- What went well (2-3 points)
- Character mood progression shown
- Suggestion: "Ready for the next scenario?"
- Options: [Next Scenario] [View Transcript]
```

**Scenario B: Passed (60-84 score)**
```
Results Screen:
- 1 or 2 star message (Passed or Success)
- Score breakdown
- Encouraging feedback
- Specific suggestions for improvement
- Suggestion: "Ready for the next scenario?"
- Options: [Next Scenario] [Try for 3 stars] [View Transcript]
```

**Scenario C: Attempted (< 60 score - NO STARS)**
```
Results Screen:
- "Keep Practicing!" message
- Clear explanation of what needs improvement
- Show specific examples from their conversation
- Personalized practice tips
- IMPORTANT NOTE: "You need at least 1 star (60+ score) to move forward."
- Options: [Try Again] [Review Lessons] [Get Hints]

After 3 attempts:
- Show progress tracking: "Attempts: 1, 2, 3..."
- Provide more detailed guidance and examples
- Encourage: "You're getting closer! Try focusing on [specific component]"
```

---

## Implementation Phases

### Phase 1: MVP (Week 1-2)

**Goal**: Basic scenario progression working

**Tasks**:
1. [done] Implement Convex schema (scenarios, scenarioProgress, enhanced conversations)
2. [done] Create scenario seed data (5 beginner scenarios)
3. [done] Build scenario selection UI
4. [done] Build pre-scenario brief screen
5. [done] Implement basic conversation interface (left/right split)
6. [done] Integrate AI scoring (NVC analysis)
7. [done] Implement basic character mood tracking
8. [done] Build results screen with component breakdown
9. [done] Implement open scenario list with recommendation highlighting (unlock gates were cut; see the open access note)
10. [done] Create basic feedback generation

**Deliverables**:
- Users can practice 5 scenarios
- Real-time NVC scoring works
- Results screen shows scores
- Scenarios are ordered into a learning path (all open)
- Basic feedback provided

### Phase 2: Enhanced Feedback (Week 3)

**Goal**: Provide personalized, helpful feedback

**Tasks**:
1. [done] Implement AI-generated feedback
2. [done] Add "what went well" and "room to grow"
3. [done] Generate specific examples from conversation
4. [done] Add giraffe alternatives for jackal language
5. [done] Implement real-time coaching hints
6. [done] Add learning objectives tracking
7. [done] Create feedback summary display
8. [done] Add transcript view with annotations

**Deliverables**:
- Detailed post-conversation feedback
- Personalized suggestions based on actual messages
- Real-time hints during conversation
- Annotated transcript review

### Phase 3: Gamification (Week 4)

**Goal**: Make progression rewarding and motivating

**Tasks**:
1. [done] Implement star rating system
2. [done] Add points and level calculation
3. [done] Create progress dashboard
4. [done] Add achievements/badges
5. [done] Implement streak tracking
6. [done] Add visual progress indicators
7. [done] Create celebration animations
8. [done] Add "improve score" encouragement

**Deliverables**:
- Star ratings on scenarios
- User level system
- Progress tracking dashboard
- Achievements and badges
- Streak counter

### Phase 4: Polish & Optimization (Week 5)

**Goal**: Improve UX and performance

**Tasks**:
1. [done] Optimize AI response times (caching, streaming)
2. [done] Add loading states and animations
3. [done] Implement error handling
4. [done] Add mobile responsiveness
5. [done] Create tutorial/onboarding flow
6. [done] Add keyboard shortcuts
7. [done] Implement retry/rewind features
8. [done] Add scenario categories/filters
9. [done] Optimize database queries
10. [done] Add analytics tracking

**Deliverables**:
- Fast, responsive UI
- Smooth animations
- Great mobile experience
- Helpful onboarding
- Performance optimizations

### Phase 5: Advanced Features (Week 6+)

**Goal**: Add depth and variety

**Tasks**:
1. Skill tree / branching paths
2. Custom scenarios (user-submitted)
3. Difficulty adjustment (adaptive AI)
4. Voice input/output
5. Multiplayer practice
6. Advanced analytics
7. Export/share transcripts
8. Coach mode (extra hints)
9. Time-based challenges
10. Community features

---

## Technical Considerations

### Performance Optimization

**AI Response Caching**:
- Cache common scenarios and responses
- Use streaming for real-time feel
- Preload next likely messages

**Database Optimization**:
- Index on userId + scenarioId
- Limit conversation message arrays
- Use pagination for history

**Real-time Updates**:
- Optimistic UI updates
- Convex reactive queries
- Minimal re-renders

### Error Handling

**AI Failures**:
- Graceful degradation (show generic feedback)
- Retry logic with exponential backoff
- Fallback to simpler scoring if API fails

**Network Issues**:
- Save conversation state frequently
- Allow offline message composition
- Sync when connection restored

### Security

**API Key Protection**:
- All AI calls in Convex Actions
- Never expose keys to client
- Rate limiting on AI calls

**User Data**:
- Conversations are private per user
- No sharing without explicit consent
- GDPR compliance (data export/delete)

---

## Success Metrics

### User Engagement

- **Daily Active Users**: % of users practicing daily
- **Scenario Completion Rate**: % who finish scenarios they start
- **Average Scenarios per Session**: How many they complete
- **Return Rate**: % who come back next day/week
- **Streak Length**: Average practice streak

### Learning Outcomes

- **Score Improvement**: Average score increase over time
- **Component Progress**: Improvement in each NVC component
- **Time to Competency**: How long to reach 70+ average
- **Mastery Rate**: % achieving 85+ scores
- **Objective Completion**: % meeting learning objectives

### System Performance

- **AI Response Time**: p50, p95, p99
- **Error Rate**: % of failed requests
- **User Satisfaction**: Feedback ratings
- **Completion Time**: Average time per scenario

---

## Appendix: Example Scenario Data

```typescript
// Example scenario for testing
const exampleScenario = {
  title: "Missed Deadline",
  description: "Your colleague didn't deliver a report on time, putting your work at risk.",
  category: "workplace",
  difficulty: "intermediate",
  
  characterName: "Alex",
  characterPersonality: "Stressed, overworked, defensive when criticized, values being seen as competent",
  characterInitialMood: -3, // Slightly defensive
  situation: `Alex was responsible for completing a report that you needed for your presentation. 
             The deadline was yesterday, but Alex still hasn't delivered it. You're frustrated because 
             this puts your own work at risk. Alex has been under a lot of pressure lately with multiple projects.`,
  aiOpeningMessage: "Look, I know the report is late. I've been completely swamped this week. Can we talk about this later?",
  
  learningObjectives: [
    "observation",  // Make observation without judgment
    "feeling",      // Express frustration as a feeling
    "request",      // Make clear request for collaboration
  ],
  focusArea: "conflict_resolution",
  
  orderIndex: 5,
  // Present for schema compatibility; not enforced (open access design)
  unlockRequirements: {
    minLevel: 2,
    requiredScenarios: ["scenario_4_id"],
    minStarsTotal: 8,
  },
  
  estimatedDuration: 10,
  tags: ["workplace", "deadline", "conflict", "empathy"],
  isActive: true,
  createdAt: Date.now(),
}
```

---

## Questions for Stakeholders

Before implementation, confirm:

1. **Scoring Strictness**: Should we be lenient (encourage) or strict (challenge)?
2. **Unlock Policy**: DECIDED, open access. Scenarios are never locked; the level only drives a recommendation.
3. **Retry Incentives**: Should improving score give additional rewards?
4. **Feedback Tone**: How directive vs. exploratory should feedback be?
5. **AI Budget**: What's acceptable cost per conversation?
6. **Mobile Priority**: Desktop-first or mobile-first?

---

## Glossary

- **Giraffe Language**: NVC / compassionate communication (empathy)
- **Jackal Language**: Judgmental / violent communication (reactive)
- **NVC Score**: 0-100 score across 4 components (observation, feeling, need, request)
- **Character Mood**: -10 to +10 emotional state of AI character
- **Scenario**: A practice conversation with specific learning goals
- **Completion**: Meeting minimum criteria to pass a scenario (60+ score)
- **Mastery**: Achieving excellence in a scenario (85+ score)
- **Progress**: User's overall advancement through scenarios

---

**Last Updated**: November 8, 2025
**Version**: 1.0
**Status**: Ready for Implementation
**Owner**: NVC Learning Platform Team
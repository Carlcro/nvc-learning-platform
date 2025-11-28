# Feelings Learning System - Specification

## Overview

The Feelings Learning System teaches users to identify, express, and distinguish between authentic feelings and pseudo-feelings. This is a foundational NVC skill - most people have limited emotional vocabulary and confuse thoughts with feelings.

**Core Goal**: Expand users' emotional vocabulary from ~10 words to 100+ words, and teach them to distinguish real feelings from thoughts disguised as feelings.

---

## Table of Contents

1. [The Problem We're Solving](#the-problem-were-solving)
2. [Learning Objectives](#learning-objectives)
3. [System Architecture](#system-architecture)
4. [Data Models](#data-models)
5. [Features](#features)
6. [UI Components](#ui-components)
7. [User Journeys](#user-journeys)
8. [Implementation Phases](#implementation-phases)

---

## The Problem We're Solving

### Common Issues People Face:

1. **Limited Vocabulary**
   - Most people use only 5-10 feeling words
   - Default to "good" or "bad"
   - Can't express emotional nuance

2. **Pseudo-Feelings (Thoughts Disguised as Feelings)**
   - "I feel like you don't care" ❌ (thought)
   - "I feel ignored" ❌ (evaluation)
   - "I feel that you're wrong" ❌ (opinion)
   - Should be: "I feel hurt" ✅ (actual feeling)

3. **Confusion Between Similar Emotions**
   - Can't distinguish between frustrated, angry, and annoyed
   - Don't understand intensity levels
   - Mix up feelings and needs

4. **Disconnection from Emotions**
   - Intellectualize feelings
   - Avoid emotional language
   - Can't identify what they're feeling in the moment

### Why This Matters for NVC:

Marshall Rosenberg emphasized: **"The more specific you can be about your feelings, the easier it is for others to respond compassionately."**

Without emotional literacy:

- Can't complete the "Feeling" component of NVC (Observation → **Feeling** → Need → Request)
- Communication remains vague and ineffective
- Others can't understand or empathize
- Conflicts escalate unnecessarily

---

## Learning Objectives

### By completing this module, users will be able to:

1. **Identify** 100+ distinct feeling words
2. **Distinguish** between real feelings and pseudo-feelings
3. **Express** feelings with appropriate intensity
4. **Recognize** their own emotions in real-time
5. **Articulate** feelings clearly in conversation
6. **Understand** the relationship between feelings and needs

### Success Metrics:

- User can correctly identify pseudo-feelings 80%+ of the time
- User's feeling vocabulary expands by 50+ words
- User maintains 7+ day check-in streak
- User successfully uses learned feelings in practice scenarios
- User reports increased emotional self-awareness

---

## System Architecture

### High-Level Structure

```
Feelings Learning Hub (/learn/feelings)
    ├── Feelings Wheel (exploration & discovery)
    ├── Quiz Game (testing & reinforcement)
    ├── Daily Check-In (practice & habit building)
    ├── Personal Library (reference & favorites)
    └── Progress Dashboard (stats & achievements)
```

### Integration Points

1. **Connects to Practice Scenarios**
   - After learning feelings, prompt to practice in conversation
   - Scenarios track if user is using expanded vocabulary
   - Feedback references feeling words learned

2. **Connects to Lessons**
   - Feelings module is part of foundational NVC lessons
   - Prerequisites: None (can start here)
   - Unlocks: Better performance in practice scenarios

3. **Connects to Progress System**
   - Tracks feelings learned
   - Awards achievements
   - Contributes to overall level

---

## Data Models

### Core Tables

```typescript
// convex/schema.ts

/**
 * Master database of all feeling words
 */
feelings: defineTable({
  // Basic Info
  word: v.string(), // "grateful", "frustrated", "joyful"

  // Categorization
  category: v.union(
    v.literal("pleasant"),    // Feelings when needs ARE met
    v.literal("unpleasant")   // Feelings when needs are NOT met
  ),
  family: v.string(), // "joyful", "angry", "sad", "scared", "peaceful", "excited", "confused"

  // Intensity (1 = mild, 5 = intense)
  intensity: v.number(), // 1-5
  // Example: annoyed(2) → frustrated(3) → angry(4) → furious(5)

  // Details
  definition: v.string(), // Clear, simple definition
  examples: v.array(v.string()), // 2-3 example sentences showing usage

  // Relationships
  synonyms: v.array(v.string()), // Words with similar meaning
  relatedFeelings: v.array(v.string()), // Other feelings in same family
  antonyms: v.optional(v.array(v.string())), // Opposite feelings

  // For learners
  commonMistakes: v.optional(v.array(v.string())), // Common confusions
  tags: v.optional(v.array(v.string())), // searchable tags

  // Metadata
  difficulty: v.optional(v.union(
    v.literal("basic"),      // Everyone knows these
    v.literal("intermediate"), // Less common but still familiar
    v.literal("advanced")     // Nuanced, sophisticated vocabulary
  )),

  isCommon: v.boolean(), // Show in "quick pick" lists

  createdAt: v.number(),
  updatedAt: v.optional(v.number()),
})
  .index("by_category", ["category"])
  .index("by_family", ["family"])
  .index("by_intensity", ["family", "intensity"])
  .index("by_difficulty", ["difficulty"])
  .index("by_word", ["word"]),

/**
 * User's feelings learning progress
 */
userFeelingsProgress: defineTable({
  userId: v.id("users"),

  // Exploration Progress
  feelingsExplored: v.array(v.string()), // Feeling words they've clicked on
  feelingsSaved: v.array(v.string()), // Their personal library
  totalFeelingsLearned: v.number(), // Count of unique feelings explored

  // Learning by Category
  pleasantFeelingsLearned: v.number(),
  unpleasantFeelingsLearned: v.number(),

  // Learning by Family
  familiesExplored: v.array(v.string()), // Which families they've explored

  // Quiz Progress
  quizQuestionsAnswered: v.number(),
  quizQuestionsCorrect: v.number(),
  quizScore: v.number(), // Percentage (0-100)
  quizLevel: v.number(), // 1 (beginner), 2 (intermediate), 3 (advanced)
  quizStreak: v.number(), // Consecutive correct answers
  lastQuizDate: v.optional(v.string()), // "2025-11-08"

  // Daily Check-Ins
  dailyCheckIns: v.array(
    v.object({
      date: v.string(), // "2025-11-08"
      feelings: v.array(v.string()), // Feelings selected
      note: v.optional(v.string()), // Optional reflection
      timestamp: v.number(),
    })
  ),
  totalCheckIns: v.number(),
  currentCheckInStreak: v.number(), // Days in a row
  longestCheckInStreak: v.number(),
  lastCheckInDate: v.optional(v.string()),

  // Emotional Patterns (Analytics)
  mostCommonFeelings: v.optional(v.array(v.string())), // Top 5 they feel most
  feelingsThisWeek: v.optional(v.array(v.string())), // All feelings this week
  feelingsThisMonth: v.optional(v.array(v.string())), // All feelings this month

  // Achievements
  achievements: v.array(v.string()), // Achievement IDs earned

  // Metadata
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_quiz_level", ["userId", "quizLevel"])
  .index("by_streak", ["userId", "currentCheckInStreak"]),

/**
 * Quiz questions for testing pseudo-feeling detection
 */
feelingsQuizQuestions: defineTable({
  // Difficulty
  level: v.number(), // 1 (easy), 2 (medium), 3 (hard)

  // Question
  sentence: v.string(), // The sentence to evaluate
  isRealFeeling: v.boolean(), // True if it's a real feeling, false if pseudo

  // Explanation
  explanation: v.string(), // Why it is/isn't a real feeling
  correctFeelings: v.optional(v.array(v.string())), // What to say instead

  // Categorization
  category: v.string(), // Type of pseudo-feeling
  // Categories: "feel_like", "feel_that", "evaluative", "interpretive", "tricky"

  // Examples
  betterAlternative: v.optional(v.string()), // How to rephrase it

  // Metadata
  difficulty: v.union(
    v.literal("easy"),
    v.literal("medium"),
    v.literal("hard")
  ),
  tags: v.optional(v.array(v.string())),

  createdAt: v.number(),
})
  .index("by_level", ["level"])
  .index("by_category", ["category"])
  .index("by_difficulty", ["difficulty"]),

/**
 * User's quiz attempts (for analytics)
 */
quizAttempts: defineTable({
  userId: v.id("users"),
  questionId: v.id("feelingsQuizQuestions"),

  // Attempt
  userAnswer: v.boolean(), // What they selected
  wasCorrect: v.boolean(),
  timeSpent: v.number(), // Milliseconds

  // Context
  quizLevel: v.number(),
  attemptNumber: v.number(), // If they retry same question

  timestamp: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_question", ["questionId"])
  .index("by_correctness", ["userId", "wasCorrect"]),
```

---

## Features

### 1. Feelings Wheel (Exploration & Discovery)

**Purpose**: Visual, interactive way to explore 100+ feeling words organized by category and intensity.

**Structure**:

```
Main View (6 Families)
├── PLEASANT
│   ├── Joyful (cheerful, delighted, glad, grateful, happy, etc.)
│   ├── Peaceful (calm, content, relaxed, satisfied, etc.)
│   └── Excited (eager, energetic, enthusiastic, etc.)
└── UNPLEASANT
    ├── Angry (frustrated, irritated, resentful, etc.)
    ├── Sad (disappointed, discouraged, lonely, etc.)
    └── Scared (anxious, fearful, nervous, worried, etc.)
```

**User Flow**:

1. User sees 6 main families displayed as cards or wheel segments
2. Click on a family → See all feelings in that family
3. Click on a feeling → See detailed definition, examples, synonyms
4. Option to save feeling to personal library
5. Option to practice using this feeling in a scenario

**Key Features**:

- Toggle between pleasant/unpleasant categories
- Search/filter feelings by keyword
- Sort by intensity (mild → intense)
- Visual indicators for feelings already learned
- "Related feelings" suggestions
- Intensity slider to see spectrum (annoyed → angry → furious)

**Visual Design**:

- Circular wheel layout (desktop) or card grid (mobile)
- Color-coded by category (warm colors = pleasant, cool = unpleasant)
- Intensity shown by color saturation (light = mild, dark = intense)
- Giraffe mascot provides tips and encouragement

---

### 2. Quiz Game: "Real Feeling or Pseudo-Feeling?"

**Purpose**: Train users to distinguish between authentic feelings and thoughts disguised as feelings.

**How It Works**:

User sees a sentence and must decide:

- Is this a real feeling? ✅
- Is this a pseudo-feeling (thought)? ❌

**Example Questions**:

**Level 1 (Easy) - Obvious Pseudo-Feelings:**

```
"I feel like you don't respect me."
Answer: ❌ Pseudo-feeling
Explanation: "I feel like..." introduces a thought, not a feeling.
Better: "I feel hurt and angry."
```

**Level 2 (Medium) - Evaluative Language:**

```
"I feel ignored."
Answer: ❌ Pseudo-feeling
Explanation: "Ignored" is how you interpret someone's behavior, not a feeling.
Better: "I feel lonely and frustrated."
```

**Level 3 (Hard) - Subtle Cases:**

```
"I feel abandoned."
Answer: ❌ Pseudo-feeling (tricky!)
Explanation: "Abandoned" describes an action done to you, not your internal state.
Better: "I feel scared, lonely, and hurt."
```

**Progression System**:

- Start at Level 1 (10 questions)
- Need 8/10 correct to advance to Level 2
- Track overall accuracy score
- Show streak of consecutive correct answers
- Celebrate milestones (10, 25, 50 correct)

**Feedback After Each Question**:

- ✅ Correct: "Great job! You recognized the [category]."
- ❌ Incorrect: Show explanation, better alternatives, and encourage retry
- Always explain WHY and show better alternatives

**Gamification**:

- Points for correct answers
- Streak bonuses
- Level-up celebrations
- Quiz master badge at 90%+ accuracy

---

### 3. Daily Feelings Check-In

**Purpose**: Build the habit of emotional self-awareness through daily reflection.

**How It Works**:

1. User sees grid of 10-12 common feelings
2. Tap/click all that apply to how they're feeling today
3. Option to add more feelings from full list
4. Optional: Add a brief note about what's happening
5. Save check-in
6. See streak counter and this week's history

**Features**:

- Quick-pick grid with most common feelings
- Search to find specific feelings
- Multi-select (can choose multiple feelings)
- Optional notes field
- Calendar view of past check-ins
- Streak tracking (days in a row)
- Pattern recognition ("You've felt anxious 4 times this week")

**Analytics Provided**:

- Most common feelings over time
- Patterns by day of week
- Pleasant vs unpleasant ratio
- Emotional diversity score (how many unique feelings)
- Insights: "Your most common feelings are: anxious, hopeful, grateful"

**Streak System**:

- Track consecutive days of check-ins
- Show current streak prominently
- Celebrate milestones (7, 30, 100 days)
- Send gentle reminders if streak at risk
- Show longest streak achieved

**Pattern Detection**:

```
"You've felt anxious 5 times this week.

This feeling often connects to needs for:
• Safety
• Clarity
• Predictability

Would you like to explore what needs might be unmet?
[Explore Needs →]"
```

---

### 4. Personal Feelings Library

**Purpose**: Quick-reference collection of feelings the user wants to remember and use.

**Features**:

- Save feelings from the wheel
- Organize by frequency of use
- Add personal notes to feelings
- Quick access during practice scenarios
- "Feelings I'm working on using more"
- "Feelings I experience most often"

**Use Cases**:

- Reference during practice scenarios
- Study before important conversations
- Track personal emotional patterns
- Share with therapist/coach (export option)

---

### 5. Intensity Explorer

**Purpose**: Understand that feelings exist on a spectrum from mild to intense.

**How It Works**:

User selects a base emotion family (e.g., Angry), then slides through intensity levels:

```
ANGRY Family Spectrum:

Mild                                    Intense
  ↓         ↓         ↓         ↓         ↓
Annoyed → Frustrated → Angry → Furious → Enraged

[Slider: Currently showing "Frustrated"]

Definition: Feeling blocked or hindered in achieving something
Example: "I feel frustrated when the wifi keeps dropping during calls."

← Milder: Annoyed
→ Stronger: Angry
```

**Emotion Families with Intensity Scales**:

1. **Angry**: annoyed → frustrated → angry → furious → enraged
2. **Sad**: down → sad → unhappy → heartbroken → despairing
3. **Happy**: content → pleased → happy → joyful → ecstatic
4. **Scared**: uneasy → worried → afraid → terrified → panicked
5. **Lonely**: distant → lonely → isolated → abandoned → rejected
6. **Confused**: uncertain → confused → bewildered → lost → disoriented

**Learning Value**:

- Precision in emotional expression
- Understanding that intensity matters
- Not everything is "very angry" or "a little sad"
- Context determines appropriate intensity level

---

### 6. Situation-to-Feeling Matcher (Optional/Phase 2)

**Purpose**: Help users apply their learning to real situations.

**How It Works**:

User sees a scenario and selects which feelings they might experience:

```
Scenario:
"Your friend remembered your birthday and surprised you
with your favorite dessert."

How might you feel?
[😊 Happy] [🤗 Touched] [🙏 Grateful] [😄 Delighted]
[😢 Sad] [😡 Angry] [😰 Anxious] [😐 Neutral]
```

**Feedback**:

- Multiple correct answers (different people feel different things)
- Explains why certain feelings make sense
- Introduces new related feelings they might not have considered
- Validates their emotional responses

---

## UI Components

### Component Hierarchy

```
FeelingsHub (Main Page)
├── FeelingsWheelCard (Link to wheel)
├── QuizGameCard (Link to quiz)
├── DailyCheckInCard (Link to check-in)
├── PersonalLibraryCard (Link to library)
└── ProgressStats (Overview of learning)

FeelingsWheel
├── CategoryToggle (Pleasant/Unpleasant)
├── FamilyGrid (6 main families)
├── FamilyView (All feelings in a family)
│   └── FeelingCard (Individual feeling)
└── FeelingDetail (Full details for one feeling)

QuizGame
├── QuizQuestion (One question display)
├── QuizFeedback (Explanation after answer)
├── QuizProgress (Score, level, streak)
└── QuizResults (End of level summary)

DailyCheckIn
├── CheckInGrid (Quick-pick feelings)
├── CheckInSearch (Find more feelings)
├── CheckInNote (Optional reflection)
├── CheckInHistory (Past check-ins)
└── StreakDisplay (Current streak)

PersonalLibrary
├── SavedFeelingsList (User's collection)
├── FeelingQuickView (Feeling card)
└── LibrarySearch (Find in library)
```

### Key Component Specs

#### FeelingCard

```tsx
interface FeelingCardProps {
  feeling: {
    word: string
    family: string
    intensity: number
    definition: string
    isExplored: boolean
    isSaved: boolean
  }
  onExplore: () => void
  onSave: () => void
  size?: 'small' | 'medium' | 'large'
}

// Visual:
// - Word in large text
// - Intensity indicator (dots or bar)
// - Family badge
// - Checkmark if explored
// - Star if saved
// - Hover shows definition preview
```

#### QuizQuestion

```tsx
interface QuizQuestionProps {
  question: {
    sentence: string
    isRealFeeling: boolean
    explanation: string
    correctFeelings?: string[]
  }
  onAnswer: (answer: boolean) => void
  showFeedback: boolean
}

// Visual:
// - Sentence in large, readable text
// - Two large buttons: "Real Feeling" / "Pseudo-Feeling"
// - Feedback panel (collapsible)
// - Progress indicator at top
```

#### CheckInGrid

```tsx
interface CheckInGridProps {
  commonFeelings: string[]
  selectedFeelings: string[]
  onToggleFeeling: (feeling: string) => void
  onAddMore: () => void
}

// Visual:
// - Grid of feeling pills/buttons
// - Toggle on/off (visual indication when selected)
// - "+" button to add more
// - Selected count indicator
```

---

## User Journeys

### Journey 1: First-Time User Exploring Feelings

**Starting Point**: User completed basic lessons, now exploring feelings

**Steps**:

1. Navigate to `/learn/feelings`
2. See welcome message and overview of tools
3. Click "Feelings Wheel"
4. See 6 main families displayed
5. Click "Joyful" family
6. See 15 feelings in that family
7. Click "Grateful"
8. Read definition: "Feeling thankful and appreciative"
9. Read examples: "I feel grateful when you remember my birthday"
10. Click "Save to My Library"
11. See confirmation + giraffe mascot encouragement
12. Browse a few more feelings
13. Click "Try Quiz"
14. Answer 3-4 quiz questions
15. Get immediate feedback
16. Return to hub, see progress stats updated

**Time**: 10-15 minutes

**Outcome**:

- Learned 5-10 new feeling words
- Saved 2-3 to library
- Completed first quiz questions
- Feels motivated to continue

---

### Journey 2: Daily Check-In User (Returning)

**Starting Point**: User has been practicing for a week

**Steps**:

1. Receives notification: "Time for your daily check-in! 🦒"
2. Opens app, navigates to `/learn/feelings/check-in`
3. Sees current 6-day streak
4. Quickly taps feelings: "Grateful", "Tired", "Hopeful"
5. Types optional note: "Long day but good progress on project"
6. Clicks "Save Check-In"
7. Sees streak updated to 7 days 🔥
8. Sees achievement unlocked: "Week Warrior" badge
9. Views this week's pattern: Most common = Grateful (4x)
10. Sees prompt: "You often feel grateful! That connects to needs for appreciation and contribution."
11. Closes app feeling more self-aware

**Time**: 2-3 minutes

**Outcome**:

- Maintained streak
- Built emotional awareness habit
- Learned about patterns
- Felt positive reinforcement

---

### Journey 3: Quiz Master (Skill Building)

**Starting Point**: User wants to master pseudo-feeling detection

**Steps**:

1. Navigates to `/learn/feelings/quiz`
2. Sees they're on Level 2 (Intermediate)
3. Current score: 72% (7/10 last session)
4. Starts quiz session
5. Question 1: "I feel like you're ignoring me"
   - Answers: "Pseudo-Feeling" ✅
   - Reads explanation
   - Learns better phrase: "I feel lonely and frustrated"
6. Question 2: "I feel worried about the deadline"
   - Answers: "Real Feeling" ✅
   - Gets encouragement
7. Question 3: "I feel manipulated"
   - Answers: "Real Feeling" ❌
   - Reads explanation: "Manipulated describes what someone did, not your feeling"
   - Learns: Better = "I feel angry and mistrustful"
8. Continues through 10 questions
9. Final score: 8/10 (80%)
10. Levels up to Level 3! 🎉
11. Sees stats: Overall 78% accuracy, 25 questions answered
12. Gets achievement: "Pseudo-Feeling Detective"

**Time**: 8-10 minutes

**Outcome**:

- Improved from 72% to 80%
- Leveled up
- Learned 3-4 new distinctions
- Ready for harder questions

---

### Journey 4: Preparing for Real Conversation

**Starting Point**: User has difficult conversation coming up

**Steps**:

1. User thinks: "I need to talk to my roommate about the dishes"
2. Opens app to prepare
3. Goes to `/learn/feelings/library` to review saved feelings
4. Reviews: frustrated, overwhelmed, resentful, hopeful
5. Practices sentences:
   - "I feel frustrated when dishes pile up"
   - "I feel overwhelmed by the mess"
   - "I feel hopeful we can find a solution"
6. Goes to practice scenario: "Household Chores"
7. Uses learned feeling words in conversation
8. Gets high NVC scores (85+)
9. Completes scenario successfully
10. Feels prepared for real conversation

**Time**: 15-20 minutes

**Outcome**:

- Applied learning to practice
- Built confidence
- Ready for real-world application

---

## Implementation Phases

### Phase 1: Foundation (Week 1)

**Goal**: Core structure and basic functionality

**Deliverables**:

- [x] Database schema (feelings, userFeelingsProgress, quizQuestions)
- [x] Seed data (60 feelings, 30 quiz questions)
- [x] Convex functions (queries/mutations)
- [x] Main hub page (`/learn/feelings`)
- [x] Basic feelings wheel (grid view, clickable cards)
- [x] Feeling detail view (definition, examples)
- [x] Save to library functionality

**Success Criteria**:

- User can browse feelings by family
- User can click to see details
- User can save feelings to library
- Data persists in Convex

---

### Phase 2: Interactive Learning (Week 2)

**Goal**: Quiz game and check-in system

**Deliverables**:

- [x] Quiz game (full implementation)
  - Question display
  - Answer feedback
  - Score tracking
  - Level progression
- [x] Daily check-in
  - Quick-pick grid
  - Save check-in
  - History view
  - Streak tracking
- [x] Personal library page
- [x] Progress stats on hub

**Success Criteria**:

- User can take quiz and see feedback
- User can level up in quiz
- User can do daily check-in
- User can maintain streak
- User can view library

---

### Phase 3: Enhanced Features (Week 3)

**Goal**: Polish and additional tools

**Deliverables**:

- [x] Intensity explorer
- [x] Search functionality
- [x] Pattern detection in check-ins
- [x] Achievements system
- [x] Integration with practice scenarios
- [x] Mobile responsive design
- [x] Animations and transitions

**Success Criteria**:

- User can explore intensity levels
- User can search for feelings
- User sees pattern insights
- User earns achievements
- Works well on mobile

---

### Phase 4: Advanced Features (Week 4+)

**Goal**: Deepen learning and engagement

**Deliverables**:

- [ ] Situation-to-feeling matcher
- [ ] Feelings journal (extended check-in notes)
- [ ] Export functionality (PDF of library)
- [ ] Guided lessons on specific families
- [ ] Voice input for check-ins
- [ ] Remind me notifications
- [ ] Social features (optional sharing)

---

## Design Specifications

### Color Palette

**By Category**:

- **Pleasant Feelings**: Warm colors
  - Joyful: `#FFD700` (gold)
  - Peaceful: `#98D8C8` (mint green)
  - Excited: `#FF9F50` (orange)

- **Unpleasant Feelings**: Cool colors
  - Angry: `#E74C3C` (red)
  - Sad: `#5DADE2` (blue)
  - Scared: `#9B59B6` (purple)
  - Confused: `#95A5A6` (gray)

**By Intensity**:

- Level 1 (mild): 20% opacity
- Level 2: 40% opacity
- Level 3: 60% opacity
- Level 4: 80% opacity
- Level 5 (intense): 100% opacity

**App Colors**:

- Primary: `#F5B841` (giraffe yellow)
- Background: `#F5F3E8` (cream)
- Text: `#3D2817` (dark brown)
- Success: `#7FB069` (soft green)
- Accent: `#6B4423` (warm brown)

### Typography

- **Feeling Words**: 24px, bold, family color
- **Definitions**: 16px, regular, dark gray
- **Examples**: 14px, italic, medium gray
- **Button Text**: 16px, semibold

### Spacing

- Card padding: 24px
- Grid gap: 16px
- Section spacing: 48px
- Component margin: 32px

### Animations

- Card hover: Scale 1.02, 200ms ease
- Selection: Background color fade, 150ms
- Page transitions: Fade + slide, 300ms
- Celebration: Confetti burst, bounce, 500ms

---

## Integration Points

### With Practice Scenarios

**After Learning Feelings**:

```
"Great job learning feeling words! 🎉

Ready to practice using them in conversation?

Try this scenario:
"Expressing Disappointment"
→ Practice using your expanded vocabulary

[Start Practice →]"
```

**During Scenarios**:

- Suggest feeling words from user's library
- Track if they're using learned vocabulary
- Give bonus points for using nuanced feelings
- Reference intensity levels in feedback

### With Needs Module (Future)

**Connect Feelings to Needs**:

```
You feel: Frustrated
Common needs: Ease, Efficiency, Progress

You feel: Grateful
Common needs: Appreciation, Connection, Contribution
```

### With Progress System

**Contributions to Overall Progress**:

- Points for exploring feelings
- Points for quiz accuracy
- Points for check-in streaks
- Achievements count toward level
- Stats visible in user dashboard

---

## Success Metrics

### Engagement Metrics

- **Daily Active Users** using feelings features
- **Average session length** in feelings module
- **Feelings explored per session**
- **Quiz completion rate**
- **Check-in streak average**
- **Return rate** (% who come back)

### Learning Metrics

- **Vocabulary expansion**: Average # of feelings learned
- **Quiz accuracy improvement** over time
- **Pseudo-feeling detection rate** (% correct)
- **Application in scenarios**: % using learned feelings
- **Emotional awareness**: User self-reported improvement

### System Metrics

- **Load time** for feelings wheel
- **Search performance**
- **Data accuracy** (correct definitions/examples)
- **Mobile usage** vs desktop

---

## Content Guidelines

### Writing Feeling Definitions

**Good Definition**:

```
Grateful (adjective)
Feeling thankful and appreciative for something received or experienced.

Example: "I feel grateful when you help me with the project."
```

**Bad Definition**:

```
Grateful
When someone does something nice ❌ (This is about the action, not the feeling)
```

### Writing Examples

**Good Example**:

- Uses "I feel [feeling] when [observation]" format
- Concrete, relatable situation
- Shows the feeling in context
- ✅ "I feel anxious when I have multiple deadlines approaching."

**Bad Example**:

- Vague or abstract
- Includes judgment
- ❌ "I feel anxious when people are being irresponsible."

### Writing Quiz Questions

**Good Question**:

```
Sentence: "I feel like you don't value my opinion."
Answer: Pseudo-feeling
Explanation: "I feel like..." introduces a thought/interpretation, not a feeling.
Better: "I feel hurt and frustrated."
```

**Bad Question**:

```
Sentence: "I'm sad."
Answer: Real feeling
Explanation: This is a feeling.
(Too obvious, not educational)
```

---

## Accessibility Considerations

### Visual

- Color is not the only indicator (use icons too)
- High contrast ratios (WCAG AA)
- Large tap targets (44x44px minimum)
- Readable font sizes (16px+ body text)

### Cognitive

- Simple, clear language
- One concept at a time
- Progressive disclosure (don't overwhelm)
- Consistent patterns and layouts

### Motor

- Keyboard navigation support
- Touch-friendly buttons
- No required hover states
- Undo/edit options

### Screen Readers

- Semantic HTML
- ARIA labels for interactive elements
- Alt text for images
- Focus management

---

## Localization Considerations (Future)

### Challenges with Feelings

- Feelings don't translate 1:1 between languages
- Cultural differences in emotional expression
- Some languages have more/fewer feeling words
- Intensity levels may differ by culture

### Approach

- Start with English
- Work with NVC trainers in other languages
- Respect cultural nuances
- Don't just translate - adapt

---

## FAQ for Developers

### Q: How many feelings should we include?

**A**: Start with 60-80 for MVP, expand to 150+ over time. Focus on:

- Most common feelings (80% of usage)
- Full NVC feelings inventory
- Range of intensities for each family

### Q: How do we prevent users from getting overwhelmed?

**A**: Progressive disclosure:

1. Start with 6 families (simple)
2. Expand to feelings in one family (manageable)
3. Drill down to one feeling (focused)
4. Suggest "start with these 10" for beginners

### Q: What if users disagree with our categorizations?

**A**: That's okay! Emotional experience is subjective. Include:

- "Some people experience this differently"
- "This feeling might also fit in [family]"
- Option to provide feedback

### Q: How do we keep quiz questions challenging but not frustrating?

**A**:

- Start easy (build confidence)
- Increase difficulty gradually
- Allow retries without penalty
- Show progress (you're improving!)
- Celebrate small wins

### Q: Should check-ins be private?

**A**: Yes, by default. Consider:

- Optional sharing with coach/therapist
- Anonymous community insights
- Export for personal use

---

## Testing Guidelines

### Manual Testing Checklist

**Feelings Wheel**:

- [ ] All families display correctly
- [ ] Clicking family shows feelings
- [ ] Clicking feeling shows details
- [ ] Save to library works
- [ ] Search finds feelings
- [ ] Back button navigates correctly

**Quiz**:

- [ ] Questions display clearly
- [ ] Answer buttons work
- [ ] Feedback shows immediately
- [ ] Score tracks correctly
- [ ] Level progression works
- [ ] Can replay questions

**Check-In**:

- [ ] Quick-pick grid works
- [ ] Multi-select functions
- [ ] Save persists data
- [ ] Streak calculates correctly
- [ ] History displays
- [ ] Patterns detected

**Data Integrity**:

- [ ] All feelings have valid data
- [ ] No duplicate feeling words
- [ ] All quiz questions have explanations
- [ ] Relationships (synonyms, related) are bidirectional

---

## Appendix: Complete Feelings List

### Pleasant Feelings by Family

**Joyful** (Needs are being met - excitement/happiness):

- Cheerful, Delighted, Glad, Grateful, Happy, Hopeful, Inspired, Joyful, Optimistic, Proud, Thankful, Touched

**Peaceful** (Needs are being met - calm/contentment):

- Calm, Centered, Comfortable, Content, Peaceful, Relaxed, Relieved, Satisfied, Secure, Serene, Tranquil

**Excited** (Needs are being met - energy/anticipation):

- Amazed, Animated, Eager, Energetic, Enthusiastic, Excited, Invigorated, Lively, Passionate, Stimulated, Thrilled, Vibrant

### Unpleasant Feelings by Family

**Angry** (Needs not met - frustration/irritation):

- Aggravated, Annoyed, Bitter, Frustrated, Furious, Impatient, Irate, Irritated, Resentful, Upset

**Sad** (Needs not met - loss/disappointment):

- Dejected, Depressed, Despairing, Disappointed, Discouraged, Disheartened, Gloomy, Heartbroken, Lonely, Melancholy, Sad, Sorrowful, Unhappy

**Scared** (Needs not met - fear/anxiety):

- Afraid, Alarmed, Anxious, Apprehensive, Cautious, Fearful, Nervous, Panicky, Startled, Terrified, Uneasy, Worried

**Confused** (Needs not met - uncertainty):

- Ambivalent, Bewildered, Conflicted, Confused, Dazed, Hesitant, Lost, Perplexed, Puzzled, Torn, Uncomfortable, Uncertain

---

## Appendix: Quiz Question Examples by Level

### Level 1 (Beginner) - Obvious Pseudo-Feelings

1. "I feel like you don't care about me."
   - Answer: Pseudo-feeling
   - Type: "feel like"
   - Better: "I feel hurt and lonely."

2. "I feel that you're being unfair."
   - Answer: Pseudo-feeling
   - Type: "feel that"
   - Better: "I feel frustrated and disappointed."

3. "I feel you don't listen."
   - Answer: Pseudo-feeling
   - Type: Interpretive
   - Better: "I feel unheard and frustrated."

### Level 2 (Intermediate) - Evaluative Language

4. "I feel ignored."
   - Answer: Pseudo-feeling
   - Type: Evaluative
   - Better: "I feel lonely and disconnected."

5. "I feel rejected."
   - Answer: Pseudo-feeling
   - Type: Evaluative
   - Better: "I feel hurt and sad."

6. "I feel manipulated."
   - Answer: Pseudo-feeling
   - Type: Evaluative
   - Better: "I feel angry and mistrustful."

### Level 3 (Advanced) - Subtle Cases

7. "I feel abandoned."
   - Answer: Pseudo-feeling (tricky!)
   - Type: Interpretive action
   - Better: "I feel scared, lonely, and hurt."

8. "I feel misunderstood."
   - Answer: Pseudo-feeling
   - Type: Interpretive
   - Better: "I feel frustrated and disconnected."

9. "I feel judged."
   - Answer: Pseudo-feeling
   - Type: Evaluative
   - Better: "I feel defensive and hurt."

10. "I feel anxious."
    - Answer: Real feeling! ✅
    - Explanation: This is an authentic emotion describing your internal state.

---

**Last Updated**: November 8, 2025
**Version**: 1.0.0
**Status**: Ready for Implementation
**Owner**: NVC Learning Platform Team

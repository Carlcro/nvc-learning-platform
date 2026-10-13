# NVC Learning App - Project Specification

## Project Overview

An interactive web application to teach Non-Violent Communication (NVC) principles by Marshall Rosenberg. The app combines educational content with model-powered roleplay scenarios to help users practice empathetic communication.

### Core Objective
Create a fun, interactive learning platform that teaches users to communicate using NVC principles through progressive lessons, roleplay practice, and daily challenges.

---

## Technology Stack

### Frontend
- **Framework**: TanStack Start (React-based)
- **Routing**: TanStack Router (file-based routing, routes in `src/routes/`)
- **Styling**: Tailwind CSS
- **Language**: TypeScript (strict)

### Backend & Database
- **Platform**: Convex (handles database, backend functions, real-time sync, auth via `@convex-dev/auth`)
- **External API calls**: Convex Node actions (`'use node'`)
- **Scheduled Tasks**: Convex crons (`convex/crons.ts`)

### Model Integration
- **Provider**: Anthropic Claude API, model `claude-sonnet-4-6` (`claude-sonnet-5-5` for the roleplay character's replies), via `@anthropic-ai/sdk` inside Convex actions only
- **API key**: `ANTHROPIC_API_KEY`, set on the Convex deployment
- **Use Cases**:
  - In-character roleplay replies
  - Per-turn NVC analysis and scoring (structured output via `anthropic.messages.parse` with a JSON schema)
  - Custom scenario generation from a user's real situation
  - Daily challenge scenario generation

### Hosting
- **Frontend**: Cloudflare Workers (SSR, configured in `wrangler.jsonc`, deployed with `wrangler deploy`)
- **Backend**: Convex Cloud (managed)

---

## Core Concepts: Non-Violent Communication (NVC)

### The Four Components

1. **Observations** - Describing what we see/hear without evaluation or judgment
   - Example: "You didn't call when you said you would"
   - Not: "You're irresponsible"

2. **Feelings** - Expressing emotions, not thoughts disguised as feelings
   - Example: "I feel hurt" or "I feel anxious"
   - Not: "I feel like you don't care" (this is a thought)

3. **Needs** - Connecting feelings to universal human needs
   - Example: "because I need reliability" or "because connection is important to me"
   - Universal needs: respect, safety, understanding, autonomy, etc.

4. **Requests** - Making clear, concrete, positive requests (not demands)
   - Example: "Would you be willing to call if you're going to be late?"
   - Not: "You need to stop being late" (demand)

### NVC Terminology

- **Giraffe Language**: Compassionate, empathetic communication using NVC
- **Jackal Language**: Judgmental, blaming, or violent communication
- **Giraffe**: Symbol of NVC (has largest heart of land animals, long neck = perspective)
- **Jackal**: Symbol of violent communication (reactive, protective)

---

## App Structure & User Journey

### Phase 1: Foundation (Learning Mode)
**Goal**: Teach the 4 components of NVC

- Bite-sized lessons (5-10 minutes each), static content in `convex/lessons.ts`
- Interactive examples identifying giraffe vs jackal language
- Quizzes after each lesson; a lesson completes at its quiz `passingScore` (60), not 100
- Progress persists to the `lessonProgress` table for signed-in users, with a localStorage fallback for signed-out browsing
- Reference tools: the Feelings section (wheel, intensity, library, daily check-in, quiz)

**Lessons**:
1. Introduction to NVC
2. Observations without Evaluation
3. Identifying and Expressing Feelings
4. Connecting Feelings to Needs
5. Making Clear Requests
6. Putting It All Together

### Phase 2: Roleplay Practice (Core Experience)
**Goal**: Open-ended practice with in-character conversation partners

- Real-time conversations with a partner that stays in character
- Various scenarios: workplace conflicts, family disagreements, expressing needs
- Per-turn scoring and coaching feedback, computed server-side
- Ability to "rewind" and try different approaches
- Custom scenarios: users describe a real situation at `/practice/create` and get a tailored practice partner (private to the user)

**Scenario Categories**:
- Workplace (colleague conflicts, boss feedback, team disagreements)
- Family (parent-child, partners, siblings)
- Friendships (boundary setting, expressing hurt)
- Self-expression (asking for needs, saying no)

**Access model**: scenarios are deliberately open access. Nothing is ever locked; the user's level only drives a "recommended" hint in the practice hub. The `unlockRequirements` field remains in the schema but is not enforced, and this is the intended design.

### Phase 3: Daily Challenges & Mastery
**Goal**: Build consistent practice habits

- Three fresh scenarios generated each day (easy, medium, hard) by a midnight UTC cron
- Each user is recommended the difficulty that fits their level, with the others offered as alternatives
- Bonus points per difficulty: easy 50, medium 75, hard 100
- Streak tracking based on the user's local calendar day
- Progress analytics on the profile page

---

## Data Models

The schema in `convex/schema.ts` is the source of truth. Summary of the main tables:

### userProgress (single source of progress truth)
All user stats live here, written by `conversations.complete`:
```typescript
{
  userId: Id<'users'>
  level: number
  totalPoints: number
  pointsToNextLevel: number
  scenariosCompleted: number
  scenariosPassed: number    // 60+ score
  scenariosMastered: number  // 85+ score
  totalStars: number
  currentStreak: number
  longestStreak: number
  lastPracticeDate: string   // "2026-07-09", user's local day
  averageScores: { observation, feeling, need, request, overall } // true running averages
  scoredCompletions?: number // sample count behind the averages
  achievements: string[]
  badges: string[]
}
```

**Note**: the `userProfiles` table is deprecated. Nothing reads or writes it; stats live on `userProgress`, and the navigation reads `users.getUserProfile`, which merges from `userProgress`.

### lessonProgress
```typescript
{
  userId: Id<'users'>
  lessonId: string
  completed: boolean
  score: number // 0-100
  attempts: number
  completedAt?: number
}
```

### scenarios
```typescript
{
  title: string
  description: string
  category: 'workplace' | 'family' | 'friendship' | 'self_expression'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  characterName: string
  characterPersonality: string
  characterInitialMood: number // -10 to +10
  characterBackground?: string
  characterHiddenNeeds: string[]
  situation: string
  aiOpeningMessage: string
  learningObjectives: string[] // subset of the four components
  focusArea: string
  orderIndex: number // -1 for daily and custom scenarios (outside the ladder)
  unlockRequirements: {...} // present in schema but NOT enforced (open access by design)
  source?: 'daily' // daily challenge scenarios
  ownerId?: Id<'users'> // custom scenarios, private to their owner
  visibility?: 'private'
  estimatedDuration: number
  tags: string[]
  isActive: boolean
}
```

### scenarioProgress
Per-user, per-scenario status (`attempted` / `passed` / `mastered`), attempts, best score, best stars, and conversation history references.

### conversations
Owner-only. Messages carry per-turn analysis for user messages (`nvcScore`, `feedback`, `isJackalLanguage`, `jackalPhrases`, `whatWentWell`, `empathyShown`) and the character's evolving mood. Completed conversations store `finalScore`, `finalStars`, and `completionStatus`.

### dailyChallenges
```typescript
{
  date: string // "2026-07-09" (UTC day)
  scenarioId: Id<'scenarios'>
  difficulty: 'easy' | 'medium' | 'hard'
  description: string
  bonusPoints: number // 50 / 75 / 100
}
```

### challengeCompletions
Links a user, a challenge, and the completing conversation. Written server-side inside `conversations.complete`.

### Feelings tables
`feelings`, `userFeelingsProgress`, and `feelingsQuizQuestions` power the feelings wheel, library, daily check-in, and quiz. Quiz questions are served without answers; `api.feelingsQuiz.submitAnswer` grades server-side.

**Not built**: a standalone Needs Inventory tool was planned but not built and was cut from the schema (there are no `feelingsWheel` or `needsInventory` tables). It remains a candidate future feature.

---

## NVC Scoring Model (per-turn, contextual)

Every user message is analyzed server-side during `api.ai.submitTurn`. The analysis and the character reply run in parallel, and both are persisted atomically via `internal.conversations.recordTurn`. Scores are never accepted from the client.

### Component scores (observation, feeling, need, request: 0-25 each)

Components are scored ONLY for what the message actually attempts. A healthy conversation unfolds gradually: an observation in one message, a feeling in the next, a request later. An absent component scores 0, and that 0 is not a flaw; it means "not this turn". Cramming all four components into one message is not rewarded.

When a component is present, its quality is judged:
- **Observation**: free of judgments (no "always", "never", "should"), specific, observable behavior
- **Feeling**: real feeling words, not pseudo-feelings ("I feel that..."), owned ("I feel", never "you make me feel")
- **Need**: a universal human need, not a strategy disguised as one ("I need you to...")
- **Request**: concrete, doable, positively phrased, an invitation rather than a demand

### Total (0-100): contextual turn quality

The total is NOT the sum of the components. It judges how well this single turn moves the conversation toward connection:
- Quality of whatever the message attempts (one flawless piece that adds the next missing part of the arc can score 85-100 on its own)
- Freedom from blame, judgment, demands, defensiveness
- Empathy toward the other person's feelings and needs raises the score
- Momentum: does it advance the conversation or stall and escalate?

### Anchors
- **90-100**: pure giraffe, moves the conversation forward beautifully
- **70-89**: good, minor rough edges
- **50-69**: mixed, real effort but noticeable jackal elements
- **0-49**: mostly jackal, blame or judgment dominates

### Conversation results
- `finalScore` = average of the turn totals
- Stars: 85+ = 3, 70+ = 2, 60+ = 1, below 60 = 0
- Thresholds live in `convex/lib/progress.ts` (single source of truth)

### Points, streaks, and levels
`conversations.complete` (idempotent, server-side) awards:
- First completion: `100 * stars` (a flat 25 when the first completion earned no star)
- Repeat completions: reward improvement over the previous best, plus a small practice bonus
- Perfect score (100): one-time +200 bonus per scenario
- Daily challenge: the challenge's advertised `bonusPoints`

Streaks advance on the user's local calendar date (validated server-side). Levels use thresholds 0 / 300 / 700 / 1200 / 1800 / 2500 points, then +800 per level.

### Feedback rules
- Always name something genuine that went well
- One clear next-step hint per turn, phrased as an inviting nudge, never a script to copy
- Point out jackal phrases verbatim when present
- Encouraging and non-judgmental tone, plain spoken English, no markdown

---

## Model Integration Specifications

### Character Roleplay

The character reply is generated by a helper in `convex/ai.ts`. The system prompt includes the character profile, current mood (tracked from -10 to +10 across the conversation), hidden needs, and patience guidance scaled to the user's level. Behavioral rules:

1. Stay in character at all times; never mention NVC or any scoring system
2. React authentically to HOW the user communicates: empathy softens the character, blame hardens them
3. Progress gradually; one message does not completely transform the character
4. Keep responses natural and conversational (typically 1-2 sentences)
5. When the user has expressed a feeling, a need, and a clear request across the conversation, bring the scene to a natural, warm close

### Analysis

The analysis helper uses `anthropic.messages.parse` with a JSON schema (`output_config.format.type: 'json_schema'`) so the response is structured and typed. It receives the scenario context, the conversation history (loaded from the database, never from the client), and a progress summary of which arc pieces the user has already expressed, so coaching steers toward the earliest missing piece.

Analysis output shape:

```typescript
{
  observation: number   // 0-25
  feeling: number       // 0-25
  need: number          // 0-25
  request: number       // 0-25
  total: number         // 0-100, contextual
  feedback: string      // one next-step hint
  isJackalLanguage: boolean
  jackalPhrases: string[]
  giraffeAlternative: string // intentionally empty: users find their own words
  whatWentWell: string
  empathyShown: boolean
}
```

---

## User Interface Components

### Key UI Elements

1. **Giraffe Guide**
   - Friendly character image (never floated or bobbed)
   - Appears with tips and encouragement
   - Celebrates successes, coaches gently on mistakes

2. **Empathy Meter**
   - Visual gauge showing conversation quality
   - Fills with good NVC, depletes with jackal language

3. **Conversation Interface**
   - Chat-style message bubbles
   - Score badges on user messages
   - Per-turn coaching in the feedback panel

4. **Feedback Panel**
   - Turn score breakdown
   - What went well and one next-step hint
   - Jackal phrase highlights
   - Rewind to try a different approach

5. **Progress & Profile**
   - Current streak, total points, level
   - Completed lessons and scenarios
   - Achievements
   - Skill stats and activity feed

6. **Feelings Tools**
   - Feelings wheel with intensity
   - Browsable feelings library
   - Daily check-in (local calendar date)
   - Feelings quiz (graded server-side)

7. **Daily Challenge Card**
   - Today's recommended challenge plus alternatives
   - Difficulty and bonus points
   - Completion state

---

## Non-Functional Requirements

### Performance
- Initial page load: < 2 seconds
- Model response time: the analysis and character reply run in parallel so a turn costs one round trip; show clear loading indicators
- Optimistic UI updates for better perceived performance

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatible
- Color contrast ratios met
- Focus indicators visible

### Security
- `ANTHROPIC_API_KEY` stored in the Convex deployment environment (never in the client)
- Every Convex query and mutation derives the user via `getAuthUserId`; conversations are owner-only
- Scores, points, and completions are computed server-side from server-held data
- Seed and admin functions are `internalMutation`s, runnable only via `npx convex run` or the dashboard; there are no admin or test routes in the app
- Input length caps on all model-bound inputs
- HTTPS only

---

## Development Guidelines

### Code Style
- TypeScript strict mode
- ESLint + Prettier configured
- Functional components (React)
- Custom hooks for reusable logic
- Tailwind for styling (no CSS files unless necessary)
- No emojis, no em dashes or en dashes, no dark mode
- Never mention AI or artificial intelligence in UI copy, commits, or PRs

### File Structure
```
src/
├── routes/             # TanStack Start routes (learn/, practice/, feelings/, challenges/, profile)
├── components/         # Reusable UI components
│   ├── ui/             # Base components (buttons, cards, etc.)
│   ├── features/       # Feature-specific components
│   └── layout/         # Layout components
├── hooks/              # Custom React hooks
├── lib/                # Utilities, helpers
├── providers/          # App providers
└── styles/             # Global styles

convex/
├── schema.ts                    # Database schema
├── users.ts                     # User-related functions
├── scenarios.ts                 # Scenario data + management (seedAll internal mutation)
├── conversations.ts             # Conversation state + completion pipeline
├── ai.ts                        # Claude API integration (Node actions)
├── lessons.ts                   # Lesson content + lesson progress
├── dailyChallenges.ts           # Daily challenge queries + persistence
├── dailyChallengesGeneration.ts # Daily scenario generation via the model
├── crons.ts                     # Scheduled jobs (midnight UTC generation)
├── lib/progress.ts              # Pure progression logic (streaks, stars, points, achievements)
└── seed.ts                      # Feelings seed data (internal mutations)
```

### Git Workflow
- `main` branch: production-ready code
- Feature branches: `feature/[feature-name]`
- Commit messages: Conventional Commits format, no emojis, no AI mentions

### Testing Strategy
- Unit tests for the pure functions in `convex/lib/progress.ts`
- Integration tests for Convex functions
- E2E tests for critical user flows
- Manual testing for roleplay conversations

---

## Deployment

### Development
```bash
npm run dev    # one-off Convex sync, then Vite dev server + Convex backend together
```

### Production
```bash
npm run deploy # convex deploy (runs the build), then wrangler deploy
```

The frontend is served from Cloudflare Workers (`wrangler.jsonc`); the reactive backend runs on Convex Cloud. Monitor with the Convex dashboard and Cloudflare analytics.

### Seeding a deployment
```bash
npx convex run seed:seedAllFeelings
npx convex run scenarios:seedAll
npx convex run dailyChallenges:generateDailyChallenge
```

---

## Success Metrics

### User Engagement
- Daily active users (DAU)
- Average session duration
- Lessons completed per user
- Daily challenge completion rate
- User retention (7-day, 30-day)

### Learning Outcomes
- Average NVC score improvement over time
- Percentage of users reaching "good NVC" (70+)
- Scenarios completed per user
- User-reported confidence increase

### Technical
- API response time (p50, p95, p99)
- Error rate
- Model token usage (cost per conversation)
- Uptime (99.9% target)

---

## Future Considerations

### Candidate Features
- Needs Inventory reference tool (planned earlier, not built, cut from schema)
- Voice conversation mode
- Guided practice mode (multiple choice with scaffolding)
- Weekly summary emails
- Community features (optional, anonymized sharing)
- Export conversation transcripts
- Mobile app (React Native)

### Expansion Ideas
- NVC for specific contexts (parenting, leadership, therapy)
- Integration with therapy/coaching platforms
- Corporate training version
- Multilingual support
- NVC for written communication (emails, messages)

---

## References & Resources

### NVC Resources
- "Nonviolent Communication: A Language of Life" by Marshall B. Rosenberg
- Center for Nonviolent Communication: https://www.cnvc.org
- NVC Academy resources

### Technical Documentation
- TanStack Start: https://tanstack.com/start
- Convex: https://docs.convex.dev
- Claude API: https://docs.anthropic.com
- Cloudflare Workers: https://developers.cloudflare.com/workers

---

**Last Updated**: July 9, 2026
**Status**: Shipped and in active development

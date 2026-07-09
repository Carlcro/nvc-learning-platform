# Instructions for Claude Code & AI Assistants

This document provides context and guidelines for AI assistants (particularly Claude Code) working on the NVC Learning App project.

---

## Project Context

You are working on an **interactive web application that teaches Non-Violent Communication (NVC)**, a compassionate communication framework by Marshall Rosenberg. The app uses model-powered roleplay to help users practice empathetic communication skills.

**Key Philosophy**: The app should embody NVC principles. It should be encouraging, non-judgmental, and focused on growth rather than criticism.

---

## Quick Reference

### Essential Files to Read First
1. **PROJECT_SPEC.md** - Complete project specification, data models, and requirements
2. **convex/schema.ts** - Database schema (source of truth for data structure)
3. **src/routes/** - Application routing structure

### Tech Stack Quick Look
- **Frontend**: TanStack Start + React + TypeScript + Tailwind CSS (all frontend code lives in `src/`)
- **Backend**: Convex (database + serverless functions)
- **Model**: Anthropic Claude API (`claude-sonnet-4-6`), called only from Convex Node actions
- **Hosting**: Cloudflare Workers (configured in `wrangler.jsonc`) + Convex Cloud (backend)

---

## Project Conventions (hard rules)

1. **No emojis anywhere**: not in UI, docs, comments, or commits. If you see one, remove it (no replacement needed).
2. **Never mention AI or artificial intelligence** in UI copy, commit messages, PR titles, or PR descriptions. Users should never be made to think about artificial intelligence while using the app. In developer docs, refer to "the model" or "the Claude API".
3. **No em dashes or en dashes** anywhere: UI copy, comments, commits, docs. Use a comma, colon, or period instead.
4. **No dark mode**: do not add dark mode support.
5. **Never float or bob the giraffe guide image** up and down.
6. **Never use a sparkle icon** (the Sparkles icon or similar) anywhere in the UI.
7. **TypeScript strict**: no `any` types unless absolutely necessary.
8. **Functional components only**, custom hooks for reusable logic.
9. **Tailwind CSS only**: no custom CSS files unless there is a compelling reason.
10. **All model calls happen server-side in Convex actions**: never from the frontend, and scores are never accepted from the client.
11. **Encouraging, NVC-aligned copy**: feedback and UI text are warm, specific, and growth-oriented.

---

## Core Concepts You Must Understand

### Non-Violent Communication (NVC)

NVC has **4 components** that users learn and practice:

1. **Observation** - Facts without judgment
   - Good: "You arrived 30 minutes after we agreed"
   - Avoid: "You're always late and irresponsible"

2. **Feeling** - Actual emotions, not thoughts
   - Good: "I feel frustrated and worried"
   - Avoid: "I feel like you don't respect me" (this is a thought)

3. **Need** - Universal human need (not a strategy)
   - Good: "because reliability is important to me"
   - Avoid: "because I need you to be on time" (strategy, not need)

4. **Request** - Concrete, positive, doable action
   - Good: "Would you be willing to text me if you're running late?"
   - Avoid: "You need to stop being late" (demand, not request)

### Important Terminology

- **Giraffe Language** = NVC / compassionate communication
- **Jackal Language** = Judgmental / violent communication
- **Giraffe** = Symbol of empathy (large heart, long neck for perspective)
- **Jackal** = Symbol of reactive, defensive communication

---

## Development Guidelines

### When Writing Code

1. **Always use TypeScript** - No `any` types unless absolutely necessary
2. **Follow the existing file structure** - Frontend in `src/` (`src/routes`, `src/components`, `src/hooks`), backend in `convex/`
3. **Use Tailwind CSS** - No custom CSS files unless there is a compelling reason
4. **Functional components only** - No class components
5. **Custom hooks for logic** - Extract reusable logic into hooks
6. **Convex functions are typed** - Use the generated types from `convex/_generated`
7. **Follow the project conventions above** - especially no emojis, no dashes, no AI mentions

### Code Style Preferences

```typescript
// Good - Clear, typed, functional
export function EmpathyMeter({ score }: { score: number }) {
  const color = score >= 70 ? 'green' : score >= 50 ? 'yellow' : 'red'

  return (
    <div className="w-full bg-gray-200 rounded-full h-4">
      <div
        className={`h-4 rounded-full transition-all duration-500 bg-${color}-500`}
        style={{ width: `${score}%` }}
      />
    </div>
  )
}

// Avoid - Untyped, class component, inline styles
class EmpathyMeter extends React.Component {
  render() {
    return <div style={{ width: this.props.score }}></div>
  }
}
```

### Working with Convex

**Key Concepts**:
- **Queries** - Read data (reactive, real-time)
- **Mutations** - Write data (transactional)
- **Actions** - Call external APIs (can use Node.js APIs)

**Security model**: every query and mutation derives the current user via `getAuthUserId(ctx)` and never trusts a client-supplied user id. Conversations are owner-only. Seed and admin functions are `internalMutation`s that are only runnable from the CLI or dashboard:

```bash
npx convex run seed:seedAllFeelings
npx convex run scenarios:seedAll
npx convex run dailyChallenges:generateDailyChallenge
```

There are no admin or test routes in the app itself.

```typescript
// In app code - use generated API
import { useQuery, useMutation } from 'convex/react'
import { api } from '../convex/_generated/api'

// Query data (auto-updates when data changes)
const scenarios = useQuery(api.scenarios.listByOrder)

// Mutate data
const createConversation = useMutation(api.conversations.create)
await createConversation({ scenarioId })
```

```typescript
// In convex/ folder - define functions
import { query, mutation } from './_generated/server'
import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'

export const listMine = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) return []
    return await ctx.db
      .query('conversations')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect()
  },
})
```

### Working with the Claude API

**Always use Convex Node actions for model calls** - never call the API from the frontend. The real pattern, from `convex/ai.ts`:

```typescript
// convex/ai.ts
'use node' // Required for Node.js APIs

import Anthropic from '@anthropic-ai/sdk'
import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'
import { action } from './_generated/server'
import { internal } from './_generated/api'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!, // set on the Convex deployment
})

const MODEL = 'claude-sonnet-4-6'

// Structured output: constrain the response with a JSON schema and
// use anthropic.messages.parse, then read response.parsed_output.
const response = await anthropic.messages.parse({
  model: MODEL,
  max_tokens: 1024,
  system: systemPrompt,
  messages: [{ role: 'user', content: userPrompt }],
  output_config: {
    format: {
      type: 'json_schema',
      schema: nvcAnalysisSchema,
    },
  },
})
const analysis = response.parsed_output as NVCAnalysisResult
```

Plain text responses (the roleplay character) use `anthropic.messages.create` and read the first text content block.

### How a conversation turn works

The client calls a single action, `api.ai.submitTurn({ conversationId, message })`. The server then:

1. Authenticates the user and loads the conversation, scenario, character mood, and milestone state from the database (never from the client).
2. Runs the NVC analysis and the character's reply **in parallel** (both helpers live in `convex/ai.ts`).
3. Persists the user message, its analysis, and the character reply **atomically** via `internal.conversations.recordTurn`.

Scores are never accepted from the client, and a failed turn can always be retried safely.

---

## Common Tasks & How to Approach Them

### Task: Create a New Lesson

Lessons are static content defined in `convex/lessons.ts`. Progress persists to the `lessonProgress` table for signed-in users (`api.lessons.recordCompletion`, `api.lessons.getMyProgress`), with a localStorage fallback for signed-out browsing (see `src/hooks/useLessonProgress.ts`). A lesson counts as completed when the quiz score reaches its `passingScore` (60), not 100.

1. **Add the lesson content** to `convex/lessons.ts`, following the existing lesson shape (sections, examples, quiz with `passingScore`).
2. **Create the route file** in `src/routes/learn/` (see `src/routes/learn/observation.tsx` for the pattern).
3. **Add navigation** in `src/routes/learn/index.tsx`.

### NVC Scoring: the per-turn contextual model

Every user message is scored server-side during `submitTurn`. The shape:

```typescript
interface NVCScore {
  observation: number // 0-25
  feeling: number     // 0-25
  need: number        // 0-25
  request: number     // 0-25
  total: number       // 0-100, contextual turn quality (NOT the sum)
}
```

**Component scores (0-25 each)** are given ONLY for what the message actually attempts. A healthy conversation unfolds gradually: an observation in one message, a feeling in the next, a request later. An absent component scores 0, and that 0 is not a flaw; it simply means "not this turn". Never reward cramming all four components into one message, and never punish a message for leaving out components that are not its job that turn.

**Total (0-100)** is a contextual judgment of how well this single turn moves the conversation toward connection:
- Quality of whatever it attempts (a single flawless piece that adds the next missing part of the arc can score 85-100 on its own)
- Freedom from blame, judgment, demands, and defensiveness
- Empathy: curiosity about, or reflection of, the other person's feelings and needs raises the score
- Momentum: does it advance the conversation or stall and escalate?

**Anchors**:
- 90-100: pure giraffe, moves the conversation forward beautifully
- 70-89: good, minor rough edges
- 50-69: mixed, real effort but noticeable jackal elements
- 0-49: mostly jackal, blame or judgment dominates

**Conversation results**: the conversation's `finalScore` is the average of the turn totals. Stars: 85+ = 3 stars, 70+ = 2, 60+ = 1, below 60 = 0 (see `convex/lib/progress.ts`, the single source of truth for thresholds).

### The completion pipeline

`api.conversations.complete` is server-side and idempotent (completing twice awards nothing extra). It:

1. Computes `finalScore` and stars from the server-held messages.
2. Updates `scenarioProgress` (attempts, best score, status).
3. Awards points: first completion earns `100 * stars`; repeats reward improvement over the previous best (plus a small practice bonus); a perfect 100 earns a one-time +200 bonus; completing a daily challenge adds that challenge's advertised `bonusPoints`.
4. Advances the practice streak using the client's local calendar date, validated server-side (see `resolveLocalDate` in `convex/lib/progress.ts`).
5. Updates true running averages for the four components and overall score.
6. Awards achievements (catalog in `convex/lib/progress.ts`).

**Levels**: thresholds are 0 / 300 / 700 / 1200 / 1800 / 2500 points, then +800 points per level after level 5.

### Task: Create a New UI Component

1. **Check if a similar component exists** in `src/components/`
2. **Create in the appropriate folder**:
   - `src/components/ui/` - Generic, reusable (Button, Card, Badge)
   - `src/components/features/` - Feature-specific (EmpathyMeter, FeedbackPanel)
   - `src/components/layout/` - Layout components (Header, navigation)

3. **Use Tailwind + TypeScript**:
```typescript
// src/components/ui/Badge.tsx
interface BadgeProps {
  variant: 'success' | 'warning' | 'error'
  children: React.ReactNode
}

export function Badge({ variant, children }: BadgeProps) {
  const colors = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
  }

  return (
    <span className={`px-2 py-1 rounded-full text-sm ${colors[variant]}`}>
      {children}
    </span>
  )
}
```

### Task: Add a New Scenario

Built-in scenarios live as data arrays in `convex/scenarios.ts` (`BEGINNER_SCENARIOS`, `INTERMEDIATE_SCENARIOS`, `ADVANCED_SCENARIOS`) and are seeded with the internal mutation:

```bash
npx convex run scenarios:seedAll
```

**Scenario access is deliberately open**: scenarios are never locked. The user's level only drives a "recommended" hint in the practice hub. `unlockRequirements` remain in the schema but are not enforced; this is the intended design.

Users can also build **custom scenarios** from a real situation in their life via `/practice/create`, which uses `ai.assessScenarioReadiness` (clarifying questions) and `ai.generateCustomScenario`. Custom scenarios are private and owned by their creator.

### Daily Challenges

A cron (`convex/crons.ts`) runs at midnight UTC and calls `internal.dailyChallenges.generateDailyChallenge`, which generates 3 fresh scenarios via the Claude API (generation logic in `convex/dailyChallengesGeneration.ts`). Each generated scenario is persisted as a real scenario row (`source: 'daily'`, `orderIndex: -1` so it stays out of the practice ladder), and one challenge is created per difficulty with fixed bonus points: easy 50, medium 75, hard 100.

`api.dailyChallenges.getMyChallenge` picks the challenge matching the user's recommended difficulty and returns the others as alternatives. Challenge completion is credited inside `conversations.complete`, which awards exactly the challenge's advertised `bonusPoints`.

To generate a day's challenges manually:

```bash
npx convex run dailyChallenges:generateDailyChallenge
```

---

## Important Patterns & Best Practices

### Error Handling

```typescript
// Good - Graceful error handling with user feedback
function ConversationView() {
  const conversation = useQuery(api.conversations.getActive, { scenarioId })

  if (conversation === undefined) {
    return <LoadingSpinner />
  }

  if (conversation === null) {
    return (
      <EmptyState
        title="No active conversation"
        action={<Button onClick={startNew}>Start New</Button>}
      />
    )
  }

  return <ConversationDisplay conversation={conversation} />
}

// Avoid - Crashes on null/undefined
function ConversationView() {
  const conversation = useQuery(api.conversations.getActive, { scenarioId })
  return <div>{conversation.messages.map(...)}</div> // Will crash!
}
```

### Form Handling

```typescript
// Good - Controlled form with validation
function MessageInput({ onSend }: { onSend: (msg: string) => void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!value.trim()) {
      setError('Please enter a message')
      return
    }

    if (value.length > 1000) {
      setError('Message too long (max 1000 characters)')
      return
    }

    setError(null)
    onSend(value)
    setValue('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type your response..."
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button type="submit">Send</button>
    </form>
  )
}
```

---

## Testing Considerations

### What to Test

1. **Convex functions** - Unit test queries, mutations, actions
2. **Progression logic** - The pure functions in `convex/lib/progress.ts` (streaks, stars, points, levels, achievements) are the easiest and most valuable to test
3. **Critical user flows** - E2E tests for signup, lesson, roleplay
4. **UI components** - Test rendering, interactions

### Testing NVC Scores

Because the total is contextual (not a sum), test cases should assert ranges and the qualitative flags rather than exact totals:

```typescript
const testCases = [
  {
    context: 'first message of a conversation',
    input: "You're always late and you don't care about anyone else",
    expect: {
      totalRange: [0, 49], // mostly jackal
      isJackalLanguage: true,
      jackalPhrases: ['always late', "don't care"],
    },
  },
  {
    context: 'feeling and need already expressed earlier in the conversation',
    input: 'Would you be willing to text me if you are running late?',
    expect: {
      // A single clean request that adds the missing arc piece
      // deserves a high total on its own.
      totalRange: [85, 100],
      request: [20, 25],
      // Absent components score 0 and that is fine, not a flaw.
      observation: [0, 0],
      isJackalLanguage: false,
    },
  },
]
```

---

## Common Pitfalls & How to Avoid Them

### Pitfall 1: Not handling loading states

```typescript
// Bad
const data = useQuery(api.something.get)
return <div>{data.name}</div> // Crashes if data is undefined

// Good
const data = useQuery(api.something.get)
if (data === undefined) return <LoadingSpinner />
return <div>{data.name}</div>
```

### Pitfall 2: Calling the model directly from the frontend

```typescript
// Bad - Exposes the API key!
import Anthropic from '@anthropic-ai/sdk'
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const response = await anthropic.messages.create({...})

// Good - Use the Convex action that runs the whole turn server-side
const submitTurn = useAction(api.ai.submitTurn)
await submitTurn({ conversationId, message: userInput })
```

### Pitfall 3: Not using TypeScript properly

```typescript
// Bad
function MessageBubble({ message }: any) { ... }

// Good
interface MessageBubbleProps {
  message: {
    role: 'user' | 'assistant'
    content: string
    timestamp: number
  }
}
function MessageBubble({ message }: MessageBubbleProps) { ... }
```

### Pitfall 4: Forgetting NVC principles in UI copy

```typescript
// Bad - Judgmental, discouraging
<p>Your response was wrong. You clearly don't understand NVC.</p>

// Good - Encouraging, specific, growth-oriented
<p>
  Great effort! You identified a feeling. Let's work on connecting
  it to a universal need. Try asking yourself: what's important
  to me in this situation?
</p>
```

### Pitfall 5: Trusting client data for progress

Scores, points, streaks, and completions are all computed server-side from server-held data. Never add a mutation that accepts a score, points value, or completion flag from the client. The only client-supplied progress input is the local calendar date for streaks, and even that is validated server-side.

---

## Debugging Tips

### Convex Dashboard
- Visit https://dashboard.convex.dev
- View real-time logs
- Inspect database tables
- Test functions directly

### Common Issues

**Issue**: "Cannot find module convex/_generated/api"
- **Fix**: Run `npx convex dev` to generate types

**Issue**: Query returns `undefined` forever
- **Fix**: Check Convex dashboard logs for errors in the query function

**Issue**: Model responses are too slow
- **Fix**: The analysis and character reply already run in parallel inside `submitTurn`; make sure the UI shows a clear loading indicator

**Issue**: Components re-rendering too often
- **Fix**: Memoize with `useMemo` / `useCallback`, check dependency arrays

---

## When You Need Help

### Good Questions to Ask

- "How should I structure the conversation state to support 'rewind' functionality?"
- "What's the best way to implement real-time scoring feedback during typing?"
- "Should this be a Convex query or mutation?"

### Less Helpful Questions

- "Can you write all the code for me?" (Break it into smaller tasks)
- "Why doesn't this work?" (Include error messages, context)
- "Is this good?" (Be specific about what you're optimizing for)

### Useful Resources

- **TanStack Start Docs**: https://tanstack.com/start
- **Convex Docs**: https://docs.convex.dev
- **Claude API Docs**: https://docs.anthropic.com
- **NVC Resources**: https://www.cnvc.org
- **PROJECT_SPEC.md**: Complete project requirements

---

## AI Assistant Specific Notes

### For Claude Code

When working on this codebase:

1. **Always read PROJECT_SPEC.md first** for context on requirements
2. **Check existing patterns** before creating new ones
3. **Ask clarifying questions** if the task is ambiguous
4. **Test your changes** - explain how you would test the code
5. **Consider NVC principles** - the app should embody what it teaches
6. **Think about the user experience** - is this encouraging? Clear? Fun?
7. **You dont need to add dark mode** - users will not need dark mode

### Response Style

When explaining code or decisions:
- Be clear and specific
- Provide examples
- Explain the "why" not just the "what"
- Suggest alternatives when relevant
- Be encouraging but honest about tradeoffs

### Code Generation

When generating code:
- Follow existing patterns in the codebase
- Include types (TypeScript)
- Add comments for complex logic
- Consider edge cases
- Think about accessibility

---

## Project Values

Remember, this project is about teaching empathy and compassionate communication:

1. **Encouraging, not judgmental** - Feedback should help users grow
2. **Clear and specific** - Like observations in NVC, be concrete
3. **Focus on needs** - What does the user need to succeed?
4. **Collaborative, not demanding** - Make requests, not demands
5. **Celebrate progress** - Acknowledge what's working

These values should be reflected in:
- UI copy and messaging
- Error messages
- Feedback generation
- Code comments and documentation
- The overall user experience

---

## Current State

### Roleplay Scenarios (shipped)

Interactive roleplay conversations are live. Key implementation facts:

1. All model calls go through Convex Node actions in `convex/ai.ts`; the single entry point for a turn is `api.ai.submitTurn`.
2. Scoring is server-side, per-turn, and contextual (see the scoring section above). Scores are never accepted from the client.
3. Character responses stay in character and never break roleplay or mention the coaching system.
4. Scenario access is open by design; the level only drives a recommendation.
5. Feedback language is encouraging and non-judgmental, written in plain spoken English with no markdown.

Routes live under `src/routes/practice/` and roleplay components under `src/components/features/`. See `docs/AI_ROLEPLAY_FEATURE_SUMMARY.md` for the feature summary.

**Remember**: You're not just building an app, you're creating a tool that helps people communicate more compassionately. The code itself should reflect that compassion through thoughtful design, clear communication, and helpful guidance.

---

**Last Updated**: July 9, 2026
**For Questions**: See PROJECT_SPEC.md or ask the project maintainers

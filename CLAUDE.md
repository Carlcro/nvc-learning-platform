# Instructions for Claude Code & AI Assistants

This document provides context and guidelines for AI assistants (particularly Claude Code) working on the NVC Learning App project.

---

## Project Context

You are working on an **interactive web application that teaches Non-Violent Communication (NVC)** - a compassionate communication framework by Marshall Rosenberg. The app uses AI-powered roleplay to help users practice empathetic communication skills.

**Key Philosophy**: The app should embody NVC principles - it should be encouraging, non-judgmental, and focused on growth rather than criticism.

---

## Quick Reference

### Essential Files to Read First
1. **PROJECT_SPEC.md** - Complete project specification, data models, and requirements
2. **convex/schema.ts** - Database schema (source of truth for data structure)
3. **app/routes/** - Application routing structure

### Tech Stack Quick Look
- **Frontend**: TanStack Start + React + TypeScript + Tailwind CSS
- **Backend**: Convex (database + serverless functions)
- **AI**: Anthropic Claude API (called via Convex Actions)
- **Hosting**: Netlify (frontend) + Convex Cloud (backend)

---

## Core Concepts You Must Understand

### Non-Violent Communication (NVC)

NVC has **4 components** that users learn and practice:

1. **Observation** - Facts without judgment
   - ✅ "You arrived 30 minutes after we agreed"
   - ❌ "You're always late and irresponsible"

2. **Feeling** - Actual emotions, not thoughts
   - ✅ "I feel frustrated and worried"
   - ❌ "I feel like you don't respect me" (this is a thought)

3. **Need** - Universal human need (not a strategy)
   - ✅ "because reliability is important to me"
   - ❌ "because I need you to be on time" (strategy, not need)

4. **Request** - Concrete, positive, doable action
   - ✅ "Would you be willing to text me if you're running late?"
   - ❌ "You need to stop being late" (demand, not request)

### Important Terminology

- **Giraffe Language** = NVC / compassionate communication
- **Jackal Language** = Judgmental / violent communication
- **Giraffe** = Symbol of empathy (large heart, long neck for perspective)
- **Jackal** = Symbol of reactive, defensive communication

---

## Development Guidelines

### When Writing Code

1. **Always use TypeScript** - No `any` types unless absolutely necessary
2. **Follow the existing file structure** - Check PROJECT_SPEC.md for organization
3. **Use Tailwind CSS** - No custom CSS files unless there's a compelling reason
4. **Functional components only** - No class components
5. **Custom hooks for logic** - Extract reusable logic into hooks
6. **Convex functions are typed** - Use the generated types from `convex/_generated`

### Code Style Preferences

```typescript
// ✅ Good - Clear, typed, functional
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

// ❌ Avoid - Untyped, class component, inline styles
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

```typescript
// In app code - use generated API
import { useQuery, useMutation } from 'convex/react'
import { api } from '../convex/_generated/api'

// Query data (auto-updates when data changes)
const scenarios = useQuery(api.scenarios.list)

// Mutate data
const createConversation = useMutation(api.conversations.create)
await createConversation({ scenarioId: "123" })
```

```typescript
// In convex/ folder - define functions
import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query('scenarios').collect()
  }
})

export const create = mutation({
  args: { scenarioId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert('conversations', {
      scenarioId: args.scenarioId,
      messages: [],
      status: 'in_progress',
      createdAt: Date.now(),
    })
  }
})
```

### Working with AI (Claude API)

**Always use Convex Actions for AI calls** - Never call APIs from the frontend:

```typescript
// convex/ai.ts
"use node"; // Required for Node.js APIs

import { action } from "./_generated/server";
import { v } from "convex/values";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export const analyzeResponse = action({
  args: { 
    userMessage: v.string(),
    conversationHistory: v.array(v.object({
      role: v.union(v.literal("user"), v.literal("assistant")),
      content: v.string(),
    }))
  },
  handler: async (ctx, args) => {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: args.conversationHistory.concat([
        { role: "user", content: args.userMessage }
      ]),
    });
    
    return response.content[0].text;
  },
});
```

---

## Common Tasks & How to Approach Them

### Task: Create a New Lesson

1. **Add lesson data to Convex**:
   ```typescript
   // convex/lessons.ts
   export const lessons = internalQuery({
     handler: async (ctx) => {
       return [
         {
           id: 'observation',
           title: 'Observations Without Evaluation',
           content: '...',
           exercises: [...]
         }
       ]
     }
   })
   ```

2. **Create route file**:
   ```typescript
   // app/routes/learn/observation.tsx
   import { createFileRoute } from '@tanstack/react-router'
   import { useQuery } from 'convex/react'
   import { api } from '../../../convex/_generated/api'
   
   export const Route = createFileRoute('/learn/observation')({
     component: ObservationLesson,
   })
   
   function ObservationLesson() {
     const lesson = useQuery(api.lessons.getById, { id: 'observation' })
     // Render lesson content
   }
   ```

3. **Add navigation** to `/learn/index.tsx`

### Task: Implement NVC Scoring

See `PROJECT_SPEC.md` section "NVC Scoring Algorithm" for complete rules. Key points:

```typescript
interface NVCScore {
  observation: number  // 0-25
  feeling: number      // 0-25
  need: number         // 0-25
  request: number      // 0-25
  total: number        // 0-100
}

// Scoring thresholds
// 90-100: Excellent (pure giraffe)
// 70-89: Good (minor improvements)
// 50-69: Partial (significant jackal language)
// 0-49: Needs practice (mostly jackal)
```

**Implementation approach**:
1. Send user message to Claude API via Convex Action
2. Use detailed analysis prompt (see PROJECT_SPEC.md)
3. Parse JSON response
4. Store score in conversation message
5. Display feedback to user

### Task: Create a New UI Component

1. **Check if similar component exists** in `app/components/`
2. **Create in appropriate folder**:
   - `ui/` - Generic, reusable (Button, Card, Badge)
   - `features/` - Feature-specific (EmpathyMeter, FeedbackPanel)
   - `layout/` - Layout components (Header, Sidebar)

3. **Use Tailwind + TypeScript**:
```typescript
// app/components/ui/Badge.tsx
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

1. **Define scenario in Convex**:
```typescript
// Either add to seed data or create via mutation
await ctx.db.insert('scenarios', {
  title: 'Disagreement with Colleague',
  description: 'Your coworker criticized your work in a team meeting',
  category: 'workplace',
  difficulty: 'intermediate',
  characterName: 'Alex',
  characterPersonality: 'Defensive, feels attacked, values respect',
  situation: 'Alex publicly criticized your proposal in the meeting...',
  learningGoals: ['Practice empathy under pressure', 'Address conflict directly'],
  unlockLevel: 3,
  estimatedDuration: 10,
})
```

2. **Scenario automatically available** in roleplay interface

### Task: Implement Daily Challenges

1. **Create cron job** (convex/crons.ts):
```typescript
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "reset daily challenge",
  { hourUTC: 0, minuteUTC: 0 },
  internal.challenges.generateDaily
);

export default crons;
```

2. **Implement generation logic** (convex/challenges.ts):
```typescript
export const generateDaily = internalMutation({
  handler: async (ctx) => {
    const today = new Date().toISOString().split('T')[0]
    
    // Check if today's challenge exists
    const existing = await ctx.db
      .query('dailyChallenges')
      .withIndex('by_date', q => q.eq('date', today))
      .first()
    
    if (existing) return existing
    
    // Select random scenario
    const scenarios = await ctx.db.query('scenarios').collect()
    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)]
    
    // Create challenge
    return await ctx.db.insert('dailyChallenges', {
      date: today,
      scenarioId: randomScenario._id,
      difficulty: randomScenario.difficulty,
      description: randomScenario.description,
      bonusPoints: calculateBonusPoints(randomScenario.difficulty),
    })
  }
})
```

---

## Important Patterns & Best Practices

### Error Handling

```typescript
// ✅ Good - Graceful error handling with user feedback
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

// ❌ Avoid - Crashes on null/undefined
function ConversationView() {
  const conversation = useQuery(api.conversations.getActive, { scenarioId })
  return <div>{conversation.messages.map(...)}</div> // Will crash!
}
```

### Optimistic Updates

```typescript
// Use Convex's optimistic updates for better UX
const sendMessage = useMutation(api.conversations.addMessage)

async function handleSend(message: string) {
  // Optimistically add message to UI
  setOptimisticMessages(prev => [...prev, {
    role: 'user',
    content: message,
    timestamp: Date.now()
  }])
  
  // Send to backend
  await sendMessage({ conversationId, message })
  
  // Clear optimistic state (real data from query takes over)
  setOptimisticMessages([])
}
```

### Form Handling

```typescript
// ✅ Good - Controlled form with validation
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
2. **NVC scoring logic** - Test against known good/bad examples
3. **Critical user flows** - E2E tests for signup → lesson → roleplay
4. **UI components** - Test rendering, interactions

### Testing NVC Scores

```typescript
// Example test cases for scoring algorithm
const testCases = [
  {
    input: "You're always late and you don't care about anyone else",
    expected: {
      observation: 0,  // No observation, just judgment
      feeling: 0,      // No feeling expressed
      need: 0,         // No need identified
      request: 0,      // No request made
      total: 0,
      isJackalLanguage: true,
    }
  },
  {
    input: "When you arrived 30 minutes after our agreed time, I felt worried because punctuality helps me feel respected. Would you be willing to text me if you're running late?",
    expected: {
      observation: 25,  // Clear, judgment-free observation
      feeling: 22,      // Good feeling word ("worried")
      need: 23,         // Need for respect identified
      request: 24,      // Clear, positive request
      total: 94,
      isJackalLanguage: false,
    }
  }
]
```

---

## Common Pitfalls & How to Avoid Them

### ❌ Pitfall 1: Not handling loading states

```typescript
// ❌ Bad
const data = useQuery(api.something.get)
return <div>{data.name}</div> // Crashes if data is undefined

// ✅ Good
const data = useQuery(api.something.get)
if (data === undefined) return <LoadingSpinner />
return <div>{data.name}</div>
```

### ❌ Pitfall 2: Calling AI directly from frontend

```typescript
// ❌ Bad - Exposes API key!
import Anthropic from "@anthropic-ai/sdk"
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const response = await anthropic.messages.create({...})

// ✅ Good - Use Convex Action
const analyzeMessage = useAction(api.ai.analyzeResponse)
const response = await analyzeMessage({ message: userInput })
```

### ❌ Pitfall 3: Not using TypeScript properly

```typescript
// ❌ Bad
function MessageBubble({ message }: any) { ... }

// ✅ Good
interface MessageBubbleProps {
  message: {
    role: 'user' | 'assistant'
    content: string
    timestamp: number
  }
}
function MessageBubble({ message }: MessageBubbleProps) { ... }
```

### ❌ Pitfall 4: Forgetting NVC principles in UI copy

```typescript
// ❌ Bad - Judgmental, discouraging
<p>Your response was wrong. You clearly don't understand NVC.</p>

// ✅ Good - Encouraging, specific, growth-oriented
<p>
  Great effort! You identified a feeling. Let's work on connecting 
  it to a universal need. Try asking yourself: what's important 
  to me in this situation?
</p>
```

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

**Issue**: AI responses are too slow
- **Fix**: Use streaming (implement with SSE) or show loading indicators

**Issue**: Components re-rendering too often
- **Fix**: Memoize with `useMemo` / `useCallback`, check dependency arrays

---

## When You Need Help

### Good Questions to Ask

✅ "How should I structure the conversation state to support 'rewind' functionality?"
✅ "What's the best way to implement real-time scoring feedback during typing?"
✅ "Should this be a Convex query or mutation?"

### Less Helpful Questions

❌ "Can you write all the code for me?" (Break it into smaller tasks)
❌ "Why doesn't this work?" (Include error messages, context)
❌ "Is this good?" (Be specific about what you're optimizing for)

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

**Remember**: You're not just building an app - you're creating a tool that helps people communicate more compassionately. The code itself should reflect that compassion through thoughtful design, clear communication, and helpful guidance.

Good luck, and happy coding! 🦒💚

---

**Last Updated**: October 25, 2025
**For Questions**: See PROJECT_SPEC.md or ask the project maintainers
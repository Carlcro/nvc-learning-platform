# NVC Learning App - Project Specification

## Project Overview

An interactive web application to teach Non-Violent Communication (NVC) principles by Marshall Rosenberg. The app combines educational content with AI-powered roleplay scenarios to help users practice empathetic communication.

### Core Objective
Create a fun, interactive learning platform that teaches users to communicate using NVC principles through progressive lessons, AI roleplay, and daily challenges.

---

## Technology Stack

### Frontend
- **Framework**: TanStack Start (React-based)
- **Routing**: TanStack Router (file-based routing)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Language**: TypeScript

### Backend & Database
- **Platform**: Convex (handles database, backend functions, real-time sync, auth)
- **API Calls**: Convex Actions (Node.js runtime)
- **Scheduled Tasks**: Convex Crons

### AI Integration
- **Provider**: OpenAI (via Convex Actions)
- **Use Cases**:
  - Roleplay conversation generation
  - NVC response analysis and scoring
  - Feedback generation

### Hosting
- **Frontend**: Cloudflare Pages
- **Backend**: Convex Cloud (managed)

---

## Core Concepts: Non-Violent Communication (NVC)

### The Four Components

1. **Observations** - Describing what we see/hear without evaluation or judgment
   - Example: ✅ "You didn't call when you said you would" 
   - Not: ❌ "You're irresponsible"

2. **Feelings** - Expressing emotions, not thoughts disguised as feelings
   - Example: ✅ "I feel hurt" or "I feel anxious"
   - Not: ❌ "I feel like you don't care" (this is a thought)

3. **Needs** - Connecting feelings to universal human needs
   - Example: ✅ "because I need reliability" or "because connection is important to me"
   - Universal needs: respect, safety, understanding, autonomy, etc.

4. **Requests** - Making clear, concrete, positive requests (not demands)
   - Example: ✅ "Would you be willing to call if you're going to be late?"
   - Not: ❌ "You need to stop being late" (demand)

### NVC Terminology

- **Giraffe Language**: Compassionate, empathetic communication using NVC
- **Jackal Language**: Judgmental, blaming, or violent communication
- **Giraffe**: Symbol of NVC (has largest heart of land animals, long neck = perspective)
- **Jackal**: Symbol of violent communication (reactive, protective)

---

## App Structure & User Journey

### Phase 1: Foundation (Learning Mode)
**Goal**: Teach the 4 components of NVC

- Bite-sized lessons (5-10 minutes each)
- Interactive examples identifying giraffe vs jackal language
- Mini-quizzes after each component
- Reference tools: Feelings Wheel, Needs Inventory

**Lessons Structure**:
1. Introduction to NVC
2. Observations without Evaluation
3. Identifying and Expressing Feelings
4. Connecting Feelings to Needs
5. Making Clear Requests
6. Putting It All Together

### Phase 2: Guided Practice
**Goal**: Apply NVC in controlled scenarios

- Multiple-choice scenario responses
- Immediate feedback on choices
- Side-by-side comparison of jackal vs giraffe responses
- Gradual reduction of scaffolding

### Phase 3: AI Roleplay (Core Experience)
**Goal**: Open-ended practice with AI characters

- Real-time conversation with AI playing different roles
- Various scenarios: workplace conflicts, family disagreements, expressing needs
- Live NVC scoring and feedback
- Ability to "rewind" and try different approaches
- Progressive difficulty based on user skill

**Scenario Categories**:
- Workplace (colleague conflicts, boss feedback, team disagreements)
- Family (parent-child, partners, siblings)
- Friendships (boundary setting, expressing hurt)
- Self-expression (asking for needs, saying no)

### Phase 4: Daily Challenges & Mastery
**Goal**: Build consistent practice habits

- New scenario each day
- Increasing complexity
- Streak tracking
- Community features (optional, anonymized)
- Progress analytics

---

## Data Models

### Users
```typescript
{
  clerkId: string // or Convex auth ID
  name: string
  email: string
  createdAt: number
  currentStreak: number
  longestStreak: number
  totalPoints: number
  level: number // 1-10, unlocks harder scenarios
  avatarUrl?: string
}
```

### User Progress
```typescript
{
  userId: Id<"users">
  lessonId: string
  completed: boolean
  score: number // 0-100
  completedAt?: number
  attempts: number
}
```

### Scenarios
```typescript
{
  title: string
  description: string
  category: "workplace" | "family" | "friendship" | "self_expression"
  difficulty: "beginner" | "intermediate" | "advanced"
  characterName: string
  characterPersonality: string // AI system prompt
  situation: string // Context/backstory
  learningGoals: string[]
  unlockLevel: number // User must be this level to access
  estimatedDuration: number // minutes
}
```

### Conversations
```typescript
{
  userId: Id<"users">
  scenarioId: string
  messages: Array<{
    role: "user" | "assistant"
    content: string
    timestamp: number
    nvcScore?: {
      observation: number // 0-25
      feeling: number // 0-25
      need: number // 0-25
      request: number // 0-25
      total: number // 0-100
    }
    feedback?: string
    isJackalLanguage?: boolean
    jackalPhrases?: string[]
  }>
  status: "in_progress" | "completed" | "abandoned"
  finalScore?: number
  createdAt: number
  completedAt?: number
}
```

### Daily Challenges
```typescript
{
  date: string // "2025-10-25"
  scenarioId: string
  difficulty: "easy" | "medium" | "hard"
  description: string
  bonusPoints: number
}
```

### Challenge Completions
```typescript
{
  userId: Id<"users">
  challengeId: Id<"dailyChallenges">
  conversationId: Id<"conversations">
  completed: boolean
  score: number
  completedAt: number
}
```

---

## NVC Scoring Algorithm

### Scoring System (0-100 points)

**Component Breakdown** (25 points each):

1. **Observation Score (0-25)**
   - Criteria:
     - Free from judgments (no "always", "never", "should")
     - Specific and concrete (not vague)
     - Describes observable behavior
     - No interpretations or assumptions
   - Deductions:
     - -5 for each evaluative word
     - -10 for generalizations ("you always...")
     - -15 for labels or diagnoses

2. **Feeling Score (0-25)**
   - Criteria:
     - Uses actual feeling words (sad, angry, joyful, anxious)
     - Not pseudo-feelings ("I feel that...", "I feel like...")
     - Multiple feelings can be expressed
     - Feelings are owned ("I feel" not "you make me feel")
   - Deductions:
     - -10 for pseudo-feelings
     - -15 for blaming feelings on others
     - +5 bonus for identifying multiple related feelings

3. **Need Score (0-25)**
   - Criteria:
     - Identifies universal human need
     - Not specific to person/situation (need vs strategy)
     - Connection between feeling and need is clear
     - Uses NVC needs vocabulary
   - Universal needs examples: respect, understanding, safety, autonomy, connection, meaning, celebration
   - Deductions:
     - -10 for strategies disguised as needs ("I need you to...")
     - -15 for missing need entirely
     - +5 bonus for clearly connecting feeling to need

4. **Request Score (0-25)**
   - Criteria:
     - Concrete and specific (doable action)
     - Positive language (what TO do, not what NOT to do)
     - Present tense, actionable now
     - Request, not demand (open to "no")
     - Reasonable and realistic
   - Deductions:
     - -10 for vague requests
     - -10 for negative requests ("stop doing...")
     - -15 for demands or ultimatums
     - -20 for no request at all

### Overall Tone Modifiers
- **Empathy bonus** (+5-10): Shows curiosity about other's needs
- **Defense penalty** (-10-15): Defensive, reactive, closed
- **Blame penalty** (-10-20): Blames, shames, or judges the other person

### Success Thresholds
- **90-100**: Excellent NVC, pure giraffe language
- **70-89**: Good NVC with minor improvements needed
- **50-69**: Partial NVC, significant jackal language present
- **Below 50**: Mostly jackal language, needs practice

### Feedback Generation Rules
- Always acknowledge what was done well first
- Point out specific jackal phrases and suggest giraffe alternatives
- Focus on one main area for improvement
- Provide concrete example of how to rephrase
- Encouraging and non-judgmental tone

---

## AI Integration Specifications

### Conversation AI (Character Roleplay)

**System Prompt Structure**:
```
You are roleplaying as [CHARACTER_NAME].

Personality: [CHARACTER_PERSONALITY]
Situation: [SCENARIO_SITUATION]

Your emotional state starts at: [INITIAL_EMOTION]

Behavioral Rules:
1. Stay in character at all times
2. React authentically to the user's communication style:
   - If they use NVC (giraffe): Gradually become more open, understanding, and cooperative
   - If they use jackal language: Become more defensive, closed off, or reactive
3. Mirror the level of empathy you receive
4. Don't explicitly teach NVC - let them discover through consequences
5. Keep responses conversational (2-4 sentences)
6. Show realistic human emotions and reactions
7. If they're doing well, you can de-escalate naturally
8. If they're struggling, escalate slightly to maintain challenge

Never break character. Never mention NVC explicitly.
```

**Dynamic Difficulty Adjustment**:
- Track user's average NVC scores
- Adjust character reactivity:
  - Beginners: More forgiving, faster to de-escalate
  - Intermediate: Realistic reactions
  - Advanced: More challenging, requires precise NVC

### Analysis AI (Scoring & Feedback)

**Analysis Prompt Structure**:
```
You are an expert NVC coach analyzing a user's response.

Conversation context: [PREVIOUS_MESSAGES]
User's response: "[USER_MESSAGE]"

Analyze the response for the 4 NVC components:

1. OBSERVATION (0-25 points):
   - Is it free from judgment/evaluation?
   - Is it specific and concrete?
   - Does it describe observable behavior?

2. FEELING (0-25 points):
   - Does it use actual feeling words?
   - Are there pseudo-feelings ("I feel that...")?
   - Does it own the feeling without blame?

3. NEED (0-25 points):
   - Is a universal human need identified?
   - Is it a need vs a strategy?
   - Is the feeling-need connection clear?

4. REQUEST (0-25 points):
   - Is it concrete and specific?
   - Is it in positive language?
   - Is it a request, not a demand?
   - Is it realistic?

Also identify:
- Jackal phrases (judgments, blame, demands)
- What was done well
- One specific area for improvement
- A concrete suggestion for rephrasing

Return JSON:
{
  "observation": <score>,
  "feeling": <score>,
  "need": <score>,
  "request": <score>,
  "total": <sum>,
  "feedback": "<encouraging, specific feedback>",
  "isJackalLanguage": <boolean>,
  "jackalPhrases": ["<phrase1>", "<phrase2>"],
  "giraffeAlternative": "<suggested rephrasing>",
  "whatWentWell": "<specific praise>"
}
```

---

## User Interface Components

### Key UI Elements

1. **Giraffe Mascot**
   - Friendly animated character
   - Appears with tips and encouragement
   - Celebrates successes
   - Gentle coaching on mistakes

2. **Empathy Meter**
   - Visual gauge showing conversation quality
   - Fills up with good NVC, depletes with jackal language
   - Color-coded: red → yellow → green
   - Smooth animations

3. **Conversation Interface**
   - Chat-style message bubbles
   - User messages on right (blue)
   - AI character messages on left (gray)
   - Score badges on user messages
   - Timestamp for each message

4. **Feedback Panel** (shown during/after conversation)
   - Current NVC score breakdown
   - Real-time tips
   - Jackal phrase highlights
   - Giraffe alternatives
   - "Try Again" button to rewind

5. **Progress Dashboard**
   - Current streak
   - Total points
   - Level indicator
   - Completed lessons/scenarios
   - Achievement badges
   - Weekly practice chart

6. **Reference Tools** (always accessible)
   - Feelings Wheel: Interactive circle of feeling words
   - Needs Inventory: Categorized list of universal needs
   - NVC Cheat Sheet: Quick reminder of 4 components

7. **Daily Challenge Card**
   - Today's scenario
   - Difficulty indicator
   - Bonus points available
   - Time estimate
   - "Start Challenge" CTA

---

## Features & Requirements

### MVP Features (Phase 1)

**Must Have**:
- [ ] User authentication (Convex Auth or Clerk)
- [ ] 6 foundational lessons with interactive quizzes
- [ ] Feelings Wheel reference tool
- [ ] Needs Inventory reference tool
- [ ] 10 beginner-level AI roleplay scenarios
- [ ] Real-time NVC scoring (4 components)
- [ ] Feedback generation after each message
- [ ] Progress tracking (lessons completed, points earned)
- [ ] Responsive design (mobile + desktop)

**Nice to Have**:
- [ ] Giraffe mascot animations
- [ ] Audio/voice input option
- [ ] "Rewind" feature in conversations
- [ ] Achievement badges

### Phase 2 Features

- [ ] Daily challenges with streak tracking
- [ ] 20+ additional scenarios (intermediate level)
- [ ] Advanced scenarios (unlock at level 5+)
- [ ] Guided practice mode (multiple choice)
- [ ] Progress analytics dashboard
- [ ] Weekly summary emails

### Phase 3 Features

- [ ] Community features (optional sharing)
- [ ] Practice with real user scenarios (submitted & moderated)
- [ ] Voice conversation mode
- [ ] Mobile app (React Native)
- [ ] Offline lesson access
- [ ] Export conversation transcripts

---

## Non-Functional Requirements

### Performance
- Initial page load: < 2 seconds
- AI response time: < 3 seconds (streaming preferred)
- Smooth animations: 60fps
- Optimistic UI updates for better perceived performance

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatible
- Color contrast ratios met
- Focus indicators visible

### Security
- API keys stored in Convex environment (never in client)
- User data encrypted at rest
- HTTPS only
- Rate limiting on AI calls
- Input sanitization

### Scalability
- Handle 10,000+ concurrent users
- Convex real-time sync for all users
- Efficient AI token usage (concise prompts)
- CDN for static assets (Netlify)

---

## Development Guidelines

### Code Style
- TypeScript strict mode
- ESLint + Prettier configured
- Functional components (React)
- Custom hooks for reusable logic
- Tailwind for styling (no CSS files unless necessary)

### File Structure
```
app/
├── routes/              # TanStack Start routes
├── components/          # Reusable UI components
│   ├── ui/             # Base components (buttons, cards, etc.)
│   ├── features/       # Feature-specific components
│   └── layout/         # Layout components
├── hooks/              # Custom React hooks
├── lib/                # Utilities, helpers
└── styles/             # Global styles

convex/
├── schema.ts           # Database schema
├── users.ts            # User-related functions
├── scenarios.ts        # Scenario management
├── conversations.ts    # Chat logic
├── progress.ts         # Progress tracking
├── challenges.ts       # Daily challenges
├── ai.ts               # AI integration (Actions)
└── crons.ts            # Scheduled jobs
```

### Git Workflow
- `main` branch: production-ready code
- `develop` branch: active development
- Feature branches: `feature/[feature-name]`
- Commit messages: Conventional Commits format

### Testing Strategy
- Unit tests for utility functions
- Integration tests for Convex functions
- E2E tests for critical user flows
- Manual testing for AI conversations

---

## Deployment & CI/CD

### Development
```bash
# Run locally
npm run dev         # TanStack Start dev server
npx convex dev      # Convex local development
```

### Staging
- Auto-deploy from `develop` branch
- Cloudflare Pages preview deployments
- Convex dev environment

### Production
- Manual deploy from `main` branch
- Cloudflare Pages production
- Convex production environment
- Monitor with Convex dashboard + Cloudflare analytics

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
- AI token usage (cost per conversation)
- Uptime (99.9% target)

---

## Future Considerations

### Monetization Options
- Free tier: Basic lessons + 3 daily AI conversations
- Premium: Unlimited conversations, advanced scenarios, analytics ($9.99/month)
- One-time purchase option ($49.99 lifetime)
- Enterprise: Team accounts, custom scenarios ($99/month per team)

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
- create chat with open ai https://stack.convex.dev/full-stack-chatgpt-app
- Netlify: https://docs.netlify.com

---

## Contact & Collaboration

### Project Maintainers
- [Your name/contact]

### Contributing
- See CONTRIBUTING.md for guidelines
- Code of conduct: Be respectful and use giraffe language! 🦒

### Support
- GitHub Issues for bug reports
- Discussions for feature requests
- Email: [support email]

---

**Last Updated**: October 25, 2025
**Version**: 1.0.0
**Status**: In Active Development
# AI Roleplay Scenario Feature - Summary

## Overview

The AI Roleplay Scenario feature is the **core learning experience** of the NVC Learning Platform. It allows users to practice Non-Violent Communication in realistic, AI-powered conversations where they interact with characters facing various conflicts and emotional situations.

---

## Feature Purpose

**Goal**: Give users a safe, judgment-free space to practice NVC principles in real-time conversations with AI characters.

**Learning Outcome**: Users develop the ability to:
- Observe without judgment
- Express feelings authentically
- Connect feelings to needs
- Make clear, compassionate requests
- Respond to others with empathy

---

## How It Works

### 1. User Journey

```
User Flow:
1. User completes foundational lessons (optional but recommended)
2. User browses available scenarios by category/difficulty
3. User selects a scenario
4. User reads scenario context (situation, character background)
5. AI character starts the conversation with opening statement
6. User responds using text input (voice option future enhancement)
7. AI analyzes user's response for NVC components (real-time)
8. AI character responds naturally based on user's communication style
9. Conversation continues (typically 5-10 exchanges)
10. User can "rewind" and try different approaches
11. Final score and detailed feedback provided
12. User can retry scenario or move to next challenge
```

### 2. The AI System (Two AI Functions)

**AI Function #1: Character Roleplay**
- Plays the role of the other person in the conversation
- Maintains consistent personality and emotional state
- Reacts authentically to user's communication:
  - Good NVC (giraffe) → Character becomes more open, cooperative
  - Poor NVC (jackal) → Character becomes defensive, closed off
- Never breaks character or explicitly teaches NVC

**AI Function #2: NVC Analysis & Scoring**
- Analyzes each user message for the 4 NVC components
- Scores: Observation (0-25), Feeling (0-25), Need (0-25), Request (0-25)
- Identifies "jackal language" (judgments, blame, demands)
- Provides coaching feedback and giraffe alternatives
- Tracks conversation quality over time

---

## Scenario Structure

### Scenario Components

Each scenario includes:

1. **Title**: Short, descriptive name
2. **Category**: Workplace, Family, Friendship, Self-Expression
3. **Difficulty**: Beginner, Intermediate, Advanced
4. **Context/Situation**: 2-3 sentences setting up the conflict
5. **Character Profile**:
   - Name
   - Personality traits
   - Emotional state
   - Background/motivation
   - Current needs (hidden from user)
6. **Learning Goals**: What NVC skills this scenario practices
7. **Estimated Duration**: 5-15 minutes
8. **Unlock Level**: User must be at certain level to access

### Example Scenario

```
Title: "Missed Deadline"
Category: Workplace
Difficulty: Intermediate

Situation: 
Your coworker Alex was responsible for completing a report that 
you needed for your presentation. The deadline was yesterday, 
but Alex still hasn't delivered it. You're frustrated because 
this puts your own work at risk.

Character: Alex
Personality: Stressed, overworked, defensive when criticized, 
values being seen as competent
Emotional State: Anxious, overwhelmed, guilty but trying to hide it
Hidden Needs: Understanding, support, acknowledgment of effort

AI Opening: "Look, I know the report is late. I've been completely 
swamped this week. Can we talk about this later?"

Learning Goals:
- Express frustration without blame
- Make observation without judgment
- Request collaboration rather than demand
- Practice empathy under pressure
```

---

## User Interface Components

### 1. Scenario Selection Page

```
┌─────────────────────────────────────────┐
│  Practice Scenarios                      │
│                                          │
│  Filter: [All] [Workplace] [Family]...  │
│  Difficulty: [All] [Beginner]...        │
│                                          │
│  ┌────────────┐  ┌────────────┐        │
│  │ Scenario 1 │  │ Scenario 2 │        │
│  │  [Emoji]   │  │  [Emoji]   │        │
│  │  Title     │  │  Title     │        │
│  │  Category  │  │  Category  │        │
│  │  ⏱ 10 min  │  │  ⏱ 8 min   │        │
│  │  [Start]   │  │  [Locked]  │        │
│  └────────────┘  └────────────┘        │
└─────────────────────────────────────────┘
```

### 2. Scenario Brief Page (Before Starting)

```
┌─────────────────────────────────────────┐
│  Missed Deadline                         │
│  Workplace • Intermediate • 10 min       │
│                                          │
│  📋 Situation:                           │
│  Your coworker Alex was responsible...   │
│                                          │
│  🎯 What You'll Practice:                │
│  • Express frustration without blame    │
│  • Make requests vs demands             │
│                                          │
│  💡 Tip: Remember to focus on your       │
│  feelings and needs, not Alex's behavior │
│                                          │
│  [Start Conversation]                    │
└─────────────────────────────────────────┘
```

### 3. Conversation Interface (Main Screen)

**Layout**: Split screen with conversation on left, feedback on right

```
┌──────────────────────┬──────────────────┐
│ Conversation         │ Live Feedback    │
│                      │                  │
│ Alex:                │ Empathy Meter:   │
│ "Look, I know the    │ [████████░░] 80% │
│ report is late..."   │                  │
│                      │ Current Message: │
│ You:                 │ ✓ Observation    │
│ "When the report     │ ✓ Feeling        │
│ wasn't delivered by  │ ⚠ Need (partial) │
│ yesterday..."        │ ✗ No request     │
│  [Score: 65/100]     │                  │
│                      │ 💬 Quick Tip:    │
│ Alex:                │ "Try making a    │
│ "I'm really sorry,   │ specific request │
│ I've been..."        │ for what you     │
│                      │ need."           │
│ ┌──────────────────┐ │                  │
│ │ Type response... │ │ 🦒 Giraffe:      │
│ └──────────────────┘ │ "Would you be    │
│ [⏮ Rewind] [Send]   │ willing to..."   │
└──────────────────────┴──────────────────┘
```

### 4. Feedback Panel (Right Side)

Components:
- **Empathy Meter**: Visual gauge showing conversation quality
- **Current Message Analysis**: Real-time breakdown of NVC components
- **Quick Tips**: Contextual coaching hints
- **Giraffe Alternatives**: Suggested rephrasing for jackal language
- **Conversation Stats**: Messages sent, average score, time elapsed

### 5. Final Results Page

```
┌─────────────────────────────────────────┐
│  Scenario Complete! 🦒                   │
│                                          │
│  Final Score: 78/100                     │
│  Grade: Good NVC (Giraffe Language)      │
│                                          │
│  Component Breakdown:                    │
│  Observation:  85/100  ████████░░        │
│  Feeling:      75/100  ███████░░░        │
│  Need:         70/100  ███████░░░        │
│  Request:      82/100  ████████░░        │
│                                          │
│  💚 What Went Well:                      │
│  • You expressed feelings clearly        │
│  • You made specific, doable requests    │
│                                          │
│  🌱 Areas for Growth:                    │
│  • Try connecting feelings to needs      │
│    more explicitly                       │
│                                          │
│  [View Transcript] [Try Again] [Next]   │
└─────────────────────────────────────────┘
```

---

## Scoring System

### NVC Component Scoring (0-100 total)

**Observation (0-25 points)**
- Free from judgment, evaluation, interpretation
- Specific and concrete
- Describes observable behavior

**Feeling (0-25 points)**
- Uses actual feeling words (not pseudo-feelings)
- Owns the feeling (not "you make me feel")
- Authentic emotional expression

**Need (0-25 points)**
- Identifies universal human need
- Distinguishes need from strategy
- Clear connection between feeling and need

**Request (0-25 points)**
- Concrete and specific
- Positive language (what TO do)
- Request, not demand
- Reasonable and doable

### Additional Modifiers

**Empathy Bonus** (+5 to +10)
- Shows curiosity about other person's needs
- Reflects back what they've said
- Acknowledges their feelings

**Jackal Penalty** (-10 to -20)
- Blame, shame, criticism
- Demands or ultimatums
- Defensive or reactive language

### Thresholds

- **90-100**: Excellent - Pure giraffe language
- **70-89**: Good - Solid NVC with minor improvements
- **50-69**: Partial - Mix of giraffe and jackal
- **0-49**: Needs Practice - Mostly jackal language

---

## Dynamic Difficulty System

### Character Reactivity Based on User Skill

**For Beginners** (Level 1-2):
- AI character is more forgiving
- Responds positively even to imperfect NVC
- De-escalates quickly with minimal effort
- More guidance and hints provided

**For Intermediate** (Level 3-5):
- Realistic reactions to communication style
- Requires consistent NVC to make progress
- Some challenging emotional states

**For Advanced** (Level 6+):
- Highly reactive to communication quality
- Won't de-escalate without excellent NVC
- Complex emotional situations
- Multiple needs at play
- May test user with provocative statements

### Adaptive Feedback

- **First attempts**: More detailed coaching, gentler feedback
- **Experienced users**: Concise feedback, higher expectations
- **Struggling users**: Offer hints, show giraffe alternatives more prominently
- **Excelling users**: Less scaffolding, more challenging scenarios unlock

---

## Special Features

### 1. Rewind Function

**Purpose**: Allow users to try different approaches without penalty

**How it works**:
- User clicks "Rewind" button
- Conversation rolls back 1-3 messages
- User can type a new response
- Original attempt is saved for learning
- Compare both approaches in review

**UI Indicator**:
```
You (Original attempt): "You never deliver on time!"
  Score: 25/100 ⚠️

You (After rewind): "When the report wasn't ready by 
the deadline, I felt worried..."
  Score: 82/100 ✓

AI shows both and highlights improvement
```

### 2. Hint System

**Levels of Hints**:

**Level 1 - Gentle Nudge** (automatic after low score):
- "Consider how you might rephrase this observation"
- "What feeling are you experiencing?"

**Level 2 - Component Hint** (user clicks "Need help?"):
- Shows which NVC component is missing
- Asks guiding question: "What need is unmet here?"

**Level 3 - Example** (user clicks "Show me"):
- Provides giraffe language example
- User can use it or modify it

### 3. Giraffe Coach (Mascot Guide)

**Appears at key moments**:
- First time entering a scenario (welcome message)
- After significant jackal language (encouraging intervention)
- After excellent NVC (celebration)
- When user seems stuck (offers help)

**Tone**: Warm, non-judgmental, encouraging
**Visual**: Small animated giraffe in corner or chat bubble

### 4. Conversation Transcripts

**Features**:
- Full conversation history with timestamps
- Color-coded NVC scores per message
- Annotations showing what worked/didn't work
- Exportable as PDF or text
- Option to share (anonymized) with community

---

## Technical Implementation

### Data Flow

```
User types message
    ↓
Frontend sends to Convex
    ↓
Convex Action #1: Analyze message with Claude API
    ↓
Returns: NVC score + feedback
    ↓
Store in conversation record
    ↓
Convex Action #2: Generate AI character response
    ↓
AI character receives:
  - User's message
  - User's NVC score
  - Conversation history
  - Character personality
    ↓
AI responds in character
    ↓
Frontend displays both score and response
    ↓
Update empathy meter, show feedback
```

### Key Convex Functions

**Queries**:
- `scenarios.list()` - Get available scenarios
- `scenarios.getById(id)` - Get scenario details
- `conversations.getActive(userId, scenarioId)` - Get ongoing conversation
- `conversations.getHistory(userId)` - Past conversations

**Mutations**:
- `conversations.create(userId, scenarioId)` - Start new conversation
- `conversations.addMessage(conversationId, message, score)` - Add message
- `conversations.complete(conversationId, finalScore)` - Mark complete

**Actions** (AI calls):
- `ai.analyzeResponse(message, context)` - Score NVC components
- `ai.generateCharacterResponse(message, character, history)` - AI response
- `ai.provideFeedback(message, score)` - Generate coaching tips

---

## Content Requirements

### Minimum Viable Product (MVP)

**Scenario Categories**:
1. **Workplace** (3 scenarios)
   - Missed deadline
   - Criticism from boss
   - Team conflict

2. **Family** (3 scenarios)
   - Teenager refusing chores
   - Partner forgot anniversary
   - Parent offering unsolicited advice

3. **Friendship** (2 scenarios)
   - Friend cancelled plans last minute
   - Friend borrowed money and hasn't returned it

4. **Self-Expression** (2 scenarios)
   - Asking for a raise
   - Setting boundaries with a friend

**Total**: 10 scenarios minimum for MVP

### Difficulty Distribution

- **Beginner** (4 scenarios): Simple conflicts, one clear need
- **Intermediate** (4 scenarios): Moderate complexity, emotional intensity
- **Advanced** (2 scenarios): Complex situations, multiple needs

---

## Success Metrics

### User Engagement
- Scenarios started
- Scenarios completed
- Average conversation length
- Retry rate (using rewind)
- Daily practice rate

### Learning Outcomes
- Average NVC score improvement over time
- Component-specific improvements
- Percentage reaching "Good" (70+) consistently
- Time to reach each proficiency level

### Technical Metrics
- AI response time (< 3 seconds target)
- NVC analysis accuracy (manual review sample)
- User satisfaction ratings
- Bug/error rate

---

## Future Enhancements (Post-MVP)

### Phase 2 Features
1. **Voice input/output** - Speak responses instead of typing
2. **Video/avatar animations** - See character's facial expressions
3. **Multi-turn challenges** - Longer, more complex conversations
4. **Team scenarios** - Practice mediating between multiple people
5. **Custom scenarios** - Users submit their own situations

### Phase 3 Features
1. **Multiplayer practice** - Practice with other real users
2. **AI that learns** - Character remembers past interactions
3. **Emotion detection** - Analyze tone from voice input
4. **VR scenarios** - Immersive practice environments
5. **Coach certification path** - Training for NVC trainers

---

## Design Principles

### Keep It Encouraging
- Focus on growth, not perfection
- Celebrate small wins
- Frame feedback as learning opportunities
- Giraffe mascot is always supportive, never critical

### Make It Safe
- No judgment or shame
- Users can practice in private
- Rewind function removes fear of mistakes
- Progress is saved and revisited

### Make It Practical
- Scenarios based on real-life situations
- Immediately applicable skills
- Clear connection to everyday communication
- Variety of contexts (work, family, friends)

### Make It Engaging
- Conversational, not quiz-like
- Visual feedback (empathy meter, scores)
- Sense of progress and achievement
- Unlock system creates motivation

---

## Open Questions & Decisions Needed

### Technical
1. Should we implement streaming responses from Claude API for faster perceived performance?
2. How many messages per conversation before we suggest wrapping up?
3. Should scoring happen after every message or only on demand?

### UX
1. Should rewind be unlimited or limited (e.g., 3 per scenario)?
2. Should we show NVC scores inline or only in the side panel?
3. How prominent should hints be? Automatic or user-initiated?

### Content
1. How many scenarios do we need for MVP?
2. Should some scenarios have multiple "endings" based on user performance?
3. Do we want character backstories visible to users or hidden?

### Gamification
1. Should users earn points/badges for completing scenarios?
2. Should there be a leaderboard or keep it non-competitive?
3. How do we balance achievement rewards with NVC philosophy of intrinsic motivation?

---

## Next Steps

### Development Roadmap

**Week 1-2: Core Infrastructure**
- Set up scenario data structure in Convex
- Create AI analysis system (scoring algorithm)
- Build AI character response system
- Test with 1-2 simple scenarios

**Week 3-4: UI Development**
- Conversation interface
- Feedback panel
- Empathy meter
- Rewind functionality

**Week 5-6: Content & Polish**
- Write 10 MVP scenarios
- Refine AI prompts
- User testing and iteration
- Bug fixes and optimization

**Week 7: Launch Prep**
- Final testing
- Performance optimization
- Documentation
- Beta user testing

---

## Conclusion

The AI Roleplay Scenario feature is where users transform from **understanding NVC concepts** to **actually using them in realistic situations**. 

By providing:
- ✅ Safe practice environment
- ✅ Real-time feedback
- ✅ Realistic, adaptive AI characters
- ✅ Encouraging, non-judgmental coaching

We create a learning experience that is:
- **Effective** - Users actually improve their communication skills
- **Engaging** - Fun and motivating to practice
- **Empowering** - Builds confidence for real-world application

This feature is the heart of the app and will determine its success in helping people communicate more compassionately.

---

**Last Updated**: November 1, 2025
**Status**: Ready for Development
**Priority**: HIGH - Core Feature
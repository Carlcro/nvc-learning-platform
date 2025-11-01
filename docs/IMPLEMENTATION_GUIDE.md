# AI Roleplay Implementation Guide

This guide explains how to use the conversation and AI functions to implement the AI Roleplay feature.

## Overview

The AI Roleplay feature consists of three main components:

1. **Scenario Schema** (`convex/schema.ts`) - Defines scenario data with character profiles
2. **Conversation Management** (`convex/conversations.ts`) - Handles conversation lifecycle
3. **AI Functions** (`convex/ai.ts`) - Powers NVC analysis and character responses

## Architecture

```
User sends message
    ↓
Frontend calls analyzeNVCResponse (AI)
    ↓
Returns: NVC scores + feedback
    ↓
Store in conversation + display to user
    ↓
Frontend calls generateCharacterResponse (AI)
    ↓
Returns: Character's natural response
    ↓
Display character response
    ↓
User sees both score and character reaction
```

## Data Flow

### Starting a Conversation

```typescript
// Frontend
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

function RoleplayComponent() {
  const createConversation = useMutation(api.conversations.create);
  const scenario = useQuery(api.scenarios.getById, { scenarioId: "..." });

  const handleStart = async () => {
    const conversationId = await createConversation({
      userId: currentUser._id,
      scenarioId: scenario._id,
    });
    // Navigate to conversation view with conversationId
  };
}
```

### Sending a Message

```typescript
function ConversationView({ conversationId, scenario }) {
  const conversation = useQuery(api.conversations.getById, { conversationId });
  const analyzeMessage = useAction(api.ai.analyzeNVCResponse);
  const generateResponse = useAction(api.ai.generateCharacterResponse);
  const addMessage = useMutation(api.conversations.addMessage);

  const handleSendMessage = async (userMessage: string) => {
    try {
      // Step 1: Analyze user's message for NVC components
      const analysis = await analyzeMessage({
        userMessage,
        conversationHistory: conversation?.messages || [],
        userLevel: currentUser.level,
      });

      // Step 2: Store user message with NVC score
      await addMessage({
        conversationId,
        role: "user",
        content: userMessage,
        nvcScore: {
          observation: analysis.observation,
          feeling: analysis.feeling,
          need: analysis.need,
          request: analysis.request,
          total: analysis.total,
        },
        feedback: analysis.feedback,
        isJackalLanguage: analysis.isJackalLanguage,
        jackalPhrases: analysis.jackalPhrases,
        giraffeAlternative: analysis.giraffeAlternative,
        whatWentWell: analysis.whatWentWell,
      });

      // Step 3: Generate character response based on NVC score
      const characterResponse = await generateResponse({
        userMessage,
        conversationHistory: conversation?.messages || [],
        scenario: {
          title: scenario.title,
          characterName: scenario.characterName,
          characterPersonality: scenario.characterPersonality,
          characterEmotionalState: scenario.characterEmotionalState,
          characterBackground: scenario.characterBackground,
          characterHiddenNeeds: scenario.characterHiddenNeeds,
        },
        userNVCScore: analysis.total,
        userLevel: currentUser.level,
      });

      // Step 4: Store character response
      await addMessage({
        conversationId,
        role: "assistant",
        content: characterResponse,
      });

      // UI automatically updates via useQuery
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle error
    }
  };
}
```

## API Reference

### Conversation Queries

#### `getActive(userId, scenarioId)`

Get the user's active (in_progress) conversation for a scenario.

```typescript
const conversation = useQuery(api.conversations.getActive, {
  userId: user._id,
  scenarioId: scenario._id,
});

if (conversation === undefined) {
  // Loading
} else if (conversation === null) {
  // No active conversation - user should start one
} else {
  // Active conversation found
}
```

**Returns**: `Conversation | null | undefined`

#### `getById(conversationId)`

Get full conversation by ID.

```typescript
const conversation = useQuery(api.conversations.getById, {
  conversationId: "...",
});
```

**Returns**: `Conversation | undefined`

#### `getHistory(userId, scenarioId)`

Get all conversations for a user in a scenario (past attempts).

```typescript
const history = useQuery(api.conversations.getHistory, {
  userId: user._id,
  scenarioId: scenario._id,
});
```

**Returns**: `Conversation[]`

#### `getUserConversations(userId)`

Get all conversations for a user across all scenarios.

```typescript
const allConversations = useQuery(api.conversations.getUserConversations, {
  userId: user._id,
});
```

**Returns**: `Conversation[]`

#### `getUserCompletedConversations(userId)`

Get completed conversations (for stats/progress).

```typescript
const completed = useQuery(api.conversations.getUserCompletedConversations, {
  userId: user._id,
});
```

**Returns**: `Conversation[]`

### Conversation Mutations

#### `create(userId, scenarioId)`

Start a new conversation.

```typescript
const conversationId = await createConversation({
  userId: user._id,
  scenarioId: scenario._id,
});
```

**Returns**: `Id<"conversations">`

#### `addMessage(conversationId, role, content, nvcScore?, feedback?, ...)`

Add a message to a conversation.

```typescript
await addMessage({
  conversationId: "...",
  role: "user", // or "assistant"
  content: "Your message here",
  // Optional NVC data (for user messages):
  nvcScore: {
    observation: 20,
    feeling: 18,
    need: 15,
    request: 12,
    total: 65,
  },
  feedback: "Great observation! Consider adding...",
  isJackalLanguage: false,
  jackalPhrases: [],
  giraffeAlternative: "Alternative phrasing here",
  whatWentWell: "You clearly expressed your feeling",
});
```

**Returns**: `{ success: true }`

#### `complete(conversationId)`

Mark conversation as complete and calculate final score.

```typescript
const result = await complete({
  conversationId: "...",
});
// result: { success: true, finalScore: 72, messageCount: 12 }
```

**Returns**: `{ success: true, finalScore: number, messageCount: number }`

#### `abandon(conversationId)`

Abandon a conversation without completing it.

```typescript
await abandon({ conversationId: "..." });
```

**Returns**: `{ success: true }`

### AI Actions

#### `analyzeNVCResponse(userMessage, conversationHistory, userLevel?)`

Analyze a user's message for NVC components.

```typescript
const analysis = await analyzeNVCResponse({
  userMessage: "When you arrived late, I felt worried...",
  conversationHistory: [
    { role: "user", content: "Previous user message" },
    { role: "assistant", content: "Previous character response" },
  ],
  userLevel: 3, // Optional: 1-10, affects feedback style
});

// Returns:
{
  observation: 22,
  feeling: 23,
  need: 20,
  request: 19,
  total: 84,
  feedback: "Excellent message! You clearly expressed...",
  isJackalLanguage: false,
  jackalPhrases: [],
  giraffeAlternative: "Optional alternative if there's jackal language",
  whatWentWell: "You connected your feeling to a universal need"
}
```

**Returns**: `NVCAnalysisResult`

```typescript
interface NVCAnalysisResult {
  observation: number; // 0-25
  feeling: number; // 0-25
  need: number; // 0-25
  request: number; // 0-25
  total: number; // 0-100
  feedback: string;
  isJackalLanguage: boolean;
  jackalPhrases: string[];
  giraffeAlternative: string;
  whatWentWell: string;
}
```

#### `generateCharacterResponse(userMessage, conversationHistory, scenario, userNVCScore?, userLevel?)`

Generate an authentic character response.

```typescript
const response = await generateCharacterResponse({
  userMessage: "When you arrived late, I felt worried...",
  conversationHistory: [
    { role: "user", content: "..." },
    { role: "assistant", content: "..." },
  ],
  scenario: {
    title: "Missed Deadline",
    characterName: "Alex",
    characterPersonality: "Stressed, defensive...",
    characterEmotionalState: "Anxious, guilty",
    characterBackground: "Recently overworked...",
    characterHiddenNeeds: ["Support", "Understanding"],
  },
  userNVCScore: 84, // Optional: affects character reactivity
  userLevel: 3, // Optional: 1-10, affects difficulty
});

// Returns: "I really appreciate you bringing this up in such a kind way..."
```

**Returns**: `string` (character's response)

## Message Structure

Messages are stored in the `messages` array on a conversation:

```typescript
interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  // Optional NVC data (user messages only):
  nvcScore?: {
    observation: number;
    feeling: number;
    need: number;
    request: number;
    total: number;
  };
  feedback?: string;
  isJackalLanguage?: boolean;
  jackalPhrases?: string[];
  giraffeAlternative?: string;
  whatWentWell?: string;
}
```

## Scoring Thresholds

The AI analysis uses these thresholds:

- **90-100**: Excellent NVC (pure giraffe language)
- **70-89**: Good NVC with minor improvements
- **50-69**: Partial NVC, significant improvements needed
- **0-49**: Mostly jackal language, needs practice

## Character Reactivity

The character's response is influenced by the user's NVC score AND their user level:

### Beginner (Level 1-2)
- Score 40+: Character becomes open and cooperative
- Score <40: Character remains patient, doesn't escalate

### Intermediate (Level 3-5)
- Score 70+: Character feels understood, becomes open
- Score 50-69: Character shows mixed emotions
- Score <50: Character becomes defensive

### Advanced (Level 6+)
- Score 85+: Character experiences significant emotional shift
- Score 70-84: Character feels respected, opens up
- Score 50-69: Character is conflicted
- Score <50: Character becomes notably defensive

## Error Handling

Both AI actions may throw errors if the OpenAI API fails:

```typescript
try {
  const analysis = await analyzeMessage({
    userMessage,
    conversationHistory,
  });
} catch (error) {
  console.error("Analysis failed:", error);
  // Show user-friendly error message
  // You might retry or show a fallback message
}
```

## Performance Tips

1. **Keep conversation history short** - Consider trimming to last 6-8 messages when calling AI actions
2. **Batch operations** - Combine addMessage calls when possible
3. **Cache scenarios** - Fetch scenario data once, reuse for character responses
4. **Handle loading states** - Show spinners while AI is processing (typically 1-3 seconds)

## Testing

To test the AI functions locally:

```bash
# Seed initial scenarios
npx convex run scenarios:seedBeginner

# Run development server
npx convex dev
```

Then use the Convex dashboard at https://dashboard.convex.dev to test actions directly.

## Example: Complete Conversation Flow

```typescript
// 1. Start conversation
const conversationId = await createConversation({
  userId: user._id,
  scenarioId: scenario._id,
});

// 2. Get initial conversation state
const conversation = await getById({ conversationId });

// 3. Display AI opening message
const messages = [
  {
    role: "assistant",
    content: scenario.aiOpeningMessage,
  },
];

// 4. User sends message
const userMessage = "When you... I felt...";

// 5. Analyze user's message
const analysis = await analyzeMessage({
  userMessage,
  conversationHistory: messages,
  userLevel: user.level,
});

// 6. Store user message with score
await addMessage({
  conversationId,
  role: "user",
  content: userMessage,
  nvcScore: {
    observation: analysis.observation,
    feeling: analysis.feeling,
    need: analysis.need,
    request: analysis.request,
    total: analysis.total,
  },
  feedback: analysis.feedback,
  // ... other fields
});

// 7. Generate character response
const charResponse = await generateCharacterResponse({
  userMessage,
  conversationHistory: [...messages, { role: "user", content: userMessage }],
  scenario: {
    title: scenario.title,
    characterName: scenario.characterName,
    // ... other fields
  },
  userNVCScore: analysis.total,
  userLevel: user.level,
});

// 8. Store character response
await addMessage({
  conversationId,
  role: "assistant",
  content: charResponse,
});

// 9. Repeat steps 4-8 until conversation is complete

// 10. Complete conversation
const result = await complete({ conversationId });
// Displays final score: result.finalScore
```

## Next Steps

1. **Create UI components** for the conversation interface
2. **Add scenario browser** for selecting scenarios
3. **Implement rewind functionality** for trying different approaches
4. **Add daily challenges** system
5. **Create progress tracking** and analytics views

See `AI_ROLEPLAY_FEATURE_SUMMARY.md` for the complete feature specification.

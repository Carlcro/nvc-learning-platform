"use node";

/**
 * AI Integration Module for NVC Analysis
 *
 * This module handles all interactions with the OpenAI API for:
 * - Analyzing user messages for NVC components
 * - Generating AI character responses in roleplay scenarios
 * - Providing coaching feedback
 *
 * See AI_ROLEPLAY_FEATURE_SUMMARY.md for feature details
 */

import { v } from "convex/values";
import OpenAI from "openai";
import { action } from "./_generated/server";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface NVCScore {
  observation: number // 0-25
  feeling: number // 0-25
  need: number // 0-25
  request: number // 0-25
  total: number // 0-100
}

export interface NVCAnalysisResult {
  observation: number
  feeling: number
  need: number
  request: number
  total: number
  feedback: string
  isJackalLanguage: boolean
  jackalPhrases: Array<string>
  giraffeAlternative: string
  whatWentWell: string
}

export interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
}

// ============================================================================
// NVC ANALYSIS ACTION
// ============================================================================

/**
 * Analyze a user's message for NVC components
 *
 * Uses OpenAI to evaluate the message against the 4 NVC components:
 * 1. Observation - Facts without judgment (0-25 points)
 * 2. Feeling - Actual emotions expressed (0-25 points)
 * 3. Need - Universal human need identified (0-25 points)
 * 4. Request - Clear, positive, doable request (0-25 points)
 *
 * Returns a structured analysis with scores, feedback, and suggestions.
 *
 * @param userMessage - The user's response to analyze
 * @param conversationHistory - Previous messages for context
 * @param userLevel - User's skill level (1-10) to adjust feedback style
 * @returns NVC analysis with scores and feedback
 */
export const analyzeNVCResponse = action({
  args: {
    userMessage: v.string(),
    conversationHistory: v.array(v.any()),
    userLevel: v.optional(v.number()), // 1-10, affects feedback depth
  },
  handler: async (_ctx, args): Promise<NVCAnalysisResult> => {
    // Build conversation context for analysis
    const conversationContext =
      args.conversationHistory && args.conversationHistory.length > 0
        ? args.conversationHistory
            .map((msg) => `${msg.role === "user" ? "User" : "Character"}: ${msg.content}`)
            .join("\n")
        : "This is the start of a new conversation.";

    // Adjust feedback style based on user level
    const feedbackStyle = (args.userLevel || 1) >= 5 ? "concise and focused" : "detailed and educational";

    // Construct the analysis prompt
    const analysisPrompt = `You are an expert Non-Violent Communication (NVC) coach analyzing a user's response in a roleplay conversation.

## Conversation Context:
${conversationContext}

## User's Response to Analyze:
"${args.userMessage}"

## Your Task:
Analyze this response for the 4 NVC components and return a JSON analysis. Feedback style: ${feedbackStyle}.

### Scoring Guidelines:

**OBSERVATION SCORE (0-25 points):**
- Free from judgments, no "always", "never", "should"
- Specific and concrete (not vague)
- Describes observable behavior
- Deductions: -5 evaluative words, -10 generalizations, -15 labels

**FEELING SCORE (0-25 points):**
- Uses actual feeling words (sad, angry, joyful, anxious, etc.)
- NOT pseudo-feelings ("I feel that...", "I feel like...")
- Feelings owned ("I feel" not "you make me feel")
- Deductions: -10 pseudo-feelings, -15 blaming

**NEED SCORE (0-25 points):**
- Universal human need (not specific to person/situation)
- NOT strategy disguised as need ("I need you to...")
- Clear connection between feeling and need
- Examples: respect, safety, autonomy, connection, understanding, meaning
- Deductions: -10 strategies as needs, -15 missing need

**REQUEST SCORE (0-25 points):**
- Concrete and specific (doable action)
- Positive language (what TO do, not what NOT to do)
- A request, not a demand
- Reasonable and realistic
- Deductions: -10 vague, -10 negative, -15 demands, -20 no request

### Modifiers:
- Empathy bonus: +5-10 for curiosity about other's needs
- Defense penalty: -10-15 for defensive tone
- Blame penalty: -10-20 for blame/shame

### Success Thresholds:
- 90-100: Excellent NVC (pure giraffe language)
- 70-89: Good NVC with minor improvements
- 50-69: Partial NVC, significant improvements needed
- 0-49: Mostly jackal language, needs practice

## Return Format:
Return a valid JSON object (no markdown):
{
  "observation": <0-25>,
  "feeling": <0-25>,
  "need": <0-25>,
  "request": <0-25>,
  "total": <0-100>,
  "feedback": "<${feedbackStyle} feedback>",
  "isJackalLanguage": <boolean>,
  "jackalPhrases": ["phrase1", "phrase2"],
  "giraffeAlternative": "<suggested rephrase or strengthening>",
  "whatWentWell": "<specific strength>"
}

Important:
- Total = sum of 4 components (max 100)
- Be encouraging and constructive
- Be specific about what works and what could improve
- Embody NVC principles in your feedback (non-judgmental, encouraging)`

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: analysisPrompt,
          },
        ],
      })

      // Extract the text response
      const textContent = response.choices[0]?.message?.content
      if (!textContent) {
        throw new Error('No text response from OpenAI')
      }

      // Parse JSON response
      const analysisText = textContent

      // Try to extract JSON from the response (in case it includes markdown)
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        console.error('Could not find JSON in response:', analysisText)
        throw new Error('Invalid response format from OpenAI')
      }

      const analysis = JSON.parse(jsonMatch[0]) as NVCAnalysisResult

      // Validate response structure
      if (
        !('observation' in analysis) ||
        !('feeling' in analysis) ||
        !('need' in analysis) ||
        !('request' in analysis) ||
        !('total' in analysis)
      ) {
        throw new Error('Missing required fields in analysis response')
      }

      return analysis
    } catch (error) {
      console.error('Error analyzing NVC response:', error)
      throw new Error(
        `Failed to analyze NVC response: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  },
})

// ============================================================================
// CHARACTER ROLEPLAY ACTION
// ============================================================================

/**
 * Generate an AI character response for a roleplay scenario
 *
 * The AI character responds to the user's message while:
 * - Staying in character
 * - Reacting authentically to the user's communication style
 * - De-escalating if user uses NVC, escalating slightly if they use jackal language
 * - Never explicitly teaching NVC
 * - Keeping responses conversational (2-4 sentences)
 *
 * @param userMessage - The user's message in the conversation
 * @param conversationHistory - Previous messages in this conversation
 * @param scenario - Full scenario object with character details
 * @param userNVCScore - User's NVC score (0-100) to adjust character reactivity
 * @returns The AI character's response
 */
export const generateCharacterResponse = action({
  args: {
    userMessage: v.string(),
    conversationHistory: v.array(v.any()),
    scenario: v.object({
      title: v.string(),
      characterName: v.string(),
      characterPersonality: v.string(),
      characterEmotionalState: v.string(),
      characterBackground: v.string(),
      characterHiddenNeeds: v.array(v.string()),
    }),
    userNVCScore: v.optional(v.number()), // 0-100 score
    userLevel: v.optional(v.number()), // 1-10, affects difficulty
  },
  handler: async (_ctx, args): Promise<string> => {
    const userLevel = args.userLevel || 1;
    const nvcScore = args.userNVCScore || 0;

    // Determine character's emotional response based on NVC score and user level
    let characterReactionGuidance = "";

    if (userLevel <= 2) {
      // Beginners: forgiving character
      characterReactionGuidance =
        nvcScore >= 40
          ? "The character feels heard and becomes noticeably more open, warm, and cooperative."
          : "The character remains patient and doesn't escalate. They stay engaged despite imperfect communication.";
    } else if (userLevel <= 5) {
      // Intermediate: realistic reactions
      characterReactionGuidance =
        nvcScore >= 70
          ? "The character feels genuinely understood. They become more open, vulnerable, and willing to cooperate."
          : nvcScore >= 50
            ? "The character appreciates some effort but remains somewhat guarded. They show mixed emotions."
            : "The character feels judged or unheard. They become defensive or withdrawn.";
    } else {
      // Advanced: challenging character
      characterReactionGuidance =
        nvcScore >= 85
          ? "The character experiences a significant emotional shift - they feel truly seen and become collaborative."
          : nvcScore >= 70
            ? "The character feels respected. They open up more but maintain some boundaries."
            : nvcScore >= 50
              ? "The character is conflicted. Part of them wants to connect but they remain guarded."
              : "The character feels misunderstood or blamed. They become notably defensive or argumentative.";
    }

    // Build system prompt with full character context
    const systemPrompt = `You are roleplaying as ${args.scenario.characterName} in a realistic conflict resolution conversation.

CHARACTER PROFILE:
- Name: ${args.scenario.characterName}
- Personality: ${args.scenario.characterPersonality}
- Current Emotional State: ${args.scenario.characterEmotionalState}
- Background: ${args.scenario.characterBackground}
- Your Hidden Needs: ${args.scenario.characterHiddenNeeds.join(", ")}

BEHAVIORAL RULES:
1. STAY IN CHARACTER - Never break character, never mention NVC, never explain yourself
2. React authentically based on how the user is communicating:
   ${characterReactionGuidance}
3. Show realistic emotions - you have defensiveness, hopes, fears, and needs
4. Keep responses natural and conversational (typically 1-2 sentences)
5. Use natural dialogue patterns - contractions, casual speech
6. Progress gradually - one message doesn't completely transform the character
7. Show you're listening by referencing what they said
8. Don't be perfectly rational - let emotions guide reactions

IMPORTANT REMINDERS:
- Never teach NVC explicitly
- Never acknowledge the scoring system
- Show character growth through openness, not through explaining yourself
- React to both what they say AND how they say it`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        max_tokens: 300,
        temperature: 0.8,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          ...args.conversationHistory,
          {
            role: "user",
            content: args.userMessage,
          },
        ],
      });

      const textContent = response.choices[0]?.message?.content;
      if (!textContent) {
        throw new Error("No response from OpenAI");
      }

      return textContent;
    } catch (error) {
      console.error("Error generating character response:", error);
      throw new Error(
        `Failed to generate character response: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  },
});

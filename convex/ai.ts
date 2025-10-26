'use node'

/**
 * AI Integration Module for NVC Analysis
 *
 * This module handles all interactions with the OpenAI API for:
 * - Analyzing user messages for NVC components
 * - Generating AI character responses in roleplay scenarios
 * - Providing coaching feedback
 *
 * See PROJECT_SPEC.md "AI Integration Specifications" section for details
 */

import { v } from 'convex/values'
import OpenAI from 'openai'
import { action } from './_generated/server'

// Initialize OpenAI client with API key from environment
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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
 * Uses Claude to evaluate the message against the 4 NVC components:
 * 1. Observation - Facts without judgment (0-25 points)
 * 2. Feeling - Actual emotions expressed (0-25 points)
 * 3. Need - Universal human need identified (0-25 points)
 * 4. Request - Clear, positive, doable request (0-25 points)
 *
 * Returns a structured analysis with scores, feedback, and suggestions.
 *
 * @param userMessage - The user's response to analyze
 * @param conversationHistory - Previous messages for context (optional)
 * @returns NVC analysis with scores and feedback
 */
export const analyzeNVCResponse = action({
  args: {
    userMessage: v.string(),
    conversationHistory: v.optional(
      v.array(
        v.object({
          role: v.union(v.literal('user'), v.literal('assistant')),
          content: v.string(),
        }),
      ),
    ),
  },
  handler: async (_ctx, args): Promise<NVCAnalysisResult> => {
    // Build conversation context for analysis
    const conversationContext =
      args.conversationHistory && args.conversationHistory.length > 0
        ? args.conversationHistory
            .map((msg) => `${msg.role}: ${msg.content}`)
            .join('\n')
        : 'This is the start of a new conversation.'

    // Construct the analysis prompt based on PROJECT_SPEC.md
    const analysisPrompt = `You are an expert Non-Violent Communication (NVC) coach analyzing a user's response in a roleplay conversation.

## Conversation Context:
${conversationContext}

## User's Response to Analyze:
"${args.userMessage}"

## Your Task:
Analyze this response for the 4 NVC components and return a JSON analysis.

### Scoring Guidelines (from PROJECT_SPEC.md):

**OBSERVATION SCORE (0-25 points):**
- Free from judgments, no "always", "never", "should"
- Specific and concrete (not vague)
- Describes observable behavior
- No interpretations or assumptions
- Deductions: -5 for evaluative words, -10 for generalizations, -15 for labels

**FEELING SCORE (0-25 points):**
- Uses actual feeling words (sad, angry, joyful, anxious, etc.)
- NOT pseudo-feelings ("I feel that...", "I feel like...")
- Multiple feelings can be expressed
- Feelings owned ("I feel" not "you make me feel")
- Deductions: -10 for pseudo-feelings, -15 for blaming feelings on others
- Bonus: +5 for identifying multiple related feelings

**NEED SCORE (0-25 points):**
- Identifies universal human need (not specific to person/situation)
- NOT a strategy disguised as need ("I need you to...")
- Clear connection between feeling and need
- Uses NVC needs vocabulary (respect, understanding, safety, autonomy, connection, meaning, celebration, etc.)
- Deductions: -10 for strategies as needs, -15 for missing need
- Bonus: +5 for clearly connecting feeling to need

**REQUEST SCORE (0-25 points):**
- Concrete and specific (doable action)
- Positive language (what TO do, not what NOT to do)
- Present tense, actionable now
- A request, not a demand (open to "no")
- Reasonable and realistic
- Deductions: -10 for vague requests, -10 for negative requests, -15 for demands, -20 for no request

### Overall Modifiers:
- Empathy bonus: +5-10 for showing curiosity about other's needs
- Defense penalty: -10-15 for defensive, reactive, closed tone
- Blame penalty: -10-20 for blaming, shaming, or judging

### Success Thresholds:
- 90-100: Excellent NVC (pure giraffe language)
- 70-89: Good NVC with minor improvements
- 50-69: Partial NVC, significant jackal language
- Below 50: Mostly jackal language, needs practice

## Return Format:
Return a valid JSON object (no markdown, just raw JSON):
{
  "observation": <number 0-25>,
  "feeling": <number 0-25>,
  "need": <number 0-25>,
  "request": <number 0-25>,
  "total": <number 0-100>,
  "feedback": "<2-3 sentences of encouraging, specific feedback>",
  "isJackalLanguage": <boolean>,
  "jackalPhrases": ["<phrase1>", "<phrase2>"],
  "giraffeAlternative": "<suggested rephrasing using giraffe language>",
  "whatWentWell": "<specific praise of what the user did well>"
}

Important:
- Total should equal the sum of the 4 component scores (max 100)
- Be encouraging and constructive in feedback
- If there are no jackal phrases, return empty array
- Always provide a giraffe alternative even if current response is good
- Acknowledge specific strengths in whatWentWell`

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
 * @param characterName - Name of the AI character
 * @param characterPersonality - Description of character's personality and emotional state
 * @param scenario - The situation/context for the conversation
 * @returns The AI character's response
 */
export const generateCharacterResponse = action({
  args: {
    userMessage: v.string(),
    conversationHistory: v.array(
      v.object({
        role: v.union(v.literal('user'), v.literal('assistant')),
        content: v.string(),
      }),
    ),
    characterName: v.string(),
    characterPersonality: v.string(),
    scenario: v.string(),
    userNVCScore: v.optional(v.number()), // Average NVC score to adjust difficulty
  },
  handler: async (_ctx, args): Promise<string> => {
    // Determine difficulty adjustment based on user's NVC score
    let difficultyGuidance = ''
    if (args.userNVCScore !== undefined) {
      if (args.userNVCScore >= 70) {
        difficultyGuidance =
          'The user is using good NVC. You should gradually become more open, understanding, and willing to cooperate. Show signs of de-escalation.'
      } else if (args.userNVCScore >= 50) {
        difficultyGuidance =
          'The user is using some NVC but also some judgmental language. React realistically - show some openness but also some defensiveness.'
      } else {
        difficultyGuidance =
          'The user is using primarily jackal language (judgments, blame). You should become more defensive or reactive, but still stay human and realistic.'
      }
    }

    // Character system prompt (based on PROJECT_SPEC.md)
    const systemPrompt = `You are roleplaying as ${args.characterName}.

Personality: ${args.characterPersonality}

Situation: ${args.scenario}

Behavioral Rules:
1. Stay in character at all times
2. React authentically to the user's communication style:
   - If they use NVC (giraffe language): Gradually become more open, understanding, and cooperative
   - If they use jackal language: Become more defensive, closed off, or reactive
3. Mirror the level of empathy you receive
4. Don't explicitly teach NVC - let them discover through consequences
5. Keep responses conversational (2-4 sentences)
6. Show realistic human emotions and reactions
7. If they're doing well with empathy, you can de-escalate naturally
8. If they're struggling, escalate slightly to maintain challenge

${difficultyGuidance ? `Current adjustment: ${difficultyGuidance}` : ''}

IMPORTANT: Never break character. Never mention NVC explicitly. Never explain what you're doing.`

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        max_tokens: 300,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          ...args.conversationHistory,
          {
            role: 'user',
            content: args.userMessage,
          },
        ],
      })

      // Extract the text response
      const textContent = response.choices[0]?.message?.content
      if (!textContent) {
        throw new Error('No text response from OpenAI')
      }

      return textContent
    } catch (error) {
      console.error('Error generating character response:', error)
      throw new Error(
        `Failed to generate character response: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  },
})

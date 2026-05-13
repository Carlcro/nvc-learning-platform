'use node'

/**
 * AI Integration Module for NVC Analysis
 *
 * Handles:
 * - Analyzing user messages for NVC components (structured JSON output)
 * - Generating character responses in roleplay scenarios
 *
 * See AI_ROLEPLAY_FEATURE_SUMMARY.md for feature details.
 */

import Anthropic from '@anthropic-ai/sdk'
import { v } from 'convex/values'
import { action } from './_generated/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const MODEL = 'claude-sonnet-4-6'

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

// JSON schema used to constrain the analysis response.
const nvcAnalysisSchema = {
  type: 'object',
  properties: {
    observation: { type: 'integer' },
    feeling: { type: 'integer' },
    need: { type: 'integer' },
    request: { type: 'integer' },
    total: { type: 'integer' },
    feedback: { type: 'string' },
    isJackalLanguage: { type: 'boolean' },
    jackalPhrases: { type: 'array', items: { type: 'string' } },
    giraffeAlternative: { type: 'string' },
    whatWentWell: { type: 'string' },
  },
  required: [
    'observation',
    'feeling',
    'need',
    'request',
    'total',
    'feedback',
    'isJackalLanguage',
    'jackalPhrases',
    'giraffeAlternative',
    'whatWentWell',
  ],
  additionalProperties: false,
} as const

// ============================================================================
// NVC ANALYSIS ACTION
// ============================================================================

/**
 * Analyze a user's message for NVC components.
 *
 * Returns a structured analysis with scores (0-25 per component, 0-100 total),
 * feedback, and suggested alternatives.
 */
export const analyzeNVCResponse = action({
  args: {
    userMessage: v.string(),
    conversationHistory: v.array(v.any()),
    userLevel: v.optional(v.number()), // 1-10, affects feedback depth
  },
  handler: async (_ctx, args): Promise<NVCAnalysisResult> => {
    const conversationContext =
      args.conversationHistory.length > 0
        ? args.conversationHistory
            .map(
              (msg) =>
                `${msg.role === 'user' ? 'User' : 'Character'}: ${msg.content}`,
            )
            .join('\n')
        : 'This is the start of a new conversation.'

    const feedbackStyle =
      (args.userLevel || 1) >= 5
        ? 'concise and focused'
        : 'detailed and educational'

    const systemPrompt = `You are an expert Non-Violent Communication (NVC) coach analyzing a user's response in a roleplay conversation.

### Scoring Guidelines

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

### Modifiers
- Empathy bonus: +5-10 for curiosity about other's needs
- Defense penalty: -10-15 for defensive tone
- Blame penalty: -10-20 for blame/shame

### Success Thresholds
- 90-100: Excellent NVC (pure giraffe language)
- 70-89: Good NVC with minor improvements
- 50-69: Partial NVC, significant improvements needed
- 0-49: Mostly jackal language, needs practice

### Field Requirements
- total = sum of the four component scores (max 100)
- feedback: be encouraging and constructive; embody NVC principles (non-judgmental, specific)
- jackalPhrases: short verbatim excerpts from the user's response that read as judgmental or blaming; empty array if none
- giraffeAlternative: a single rephrased sentence demonstrating stronger NVC
- whatWentWell: a specific strength to acknowledge`

    const userPrompt = `## Conversation Context
${conversationContext}

## User's Response to Analyze
"${args.userMessage}"

Analyze this response against the four NVC components. Use a ${feedbackStyle} feedback style.`

    try {
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

      if (!response.parsed_output) {
        throw new Error('Empty structured response from Claude')
      }

      return response.parsed_output as NVCAnalysisResult
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
 * Generate a character response for a roleplay scenario.
 *
 * The character responds in character, reacting authentically to the user's
 * communication style. Higher NVC scores produce more open, cooperative
 * reactions; lower scores produce more defensive reactions, scaled by user level.
 */
export const generateCharacterResponse = action({
  args: {
    userMessage: v.string(),
    conversationHistory: v.array(v.any()),
    scenario: v.object({
      title: v.string(),
      characterName: v.string(),
      characterPersonality: v.string(),
      characterInitialMood: v.number(),
      characterBackground: v.string(),
      characterHiddenNeeds: v.array(v.string()),
    }),
    userNVCScore: v.optional(v.number()),
    userLevel: v.optional(v.number()),
  },
  handler: async (_ctx, args): Promise<string> => {
    const userLevel = args.userLevel || 1
    const nvcScore = args.userNVCScore || 0

    let characterReactionGuidance = ''

    if (userLevel <= 2) {
      characterReactionGuidance =
        nvcScore >= 40
          ? 'The character feels heard and becomes noticeably more open, warm, and cooperative.'
          : "The character remains patient and doesn't escalate. They stay engaged despite imperfect communication."
    } else if (userLevel <= 5) {
      characterReactionGuidance =
        nvcScore >= 70
          ? 'The character feels genuinely understood. They become more open, vulnerable, and willing to cooperate.'
          : nvcScore >= 50
            ? 'The character appreciates some effort but remains somewhat guarded. They show mixed emotions.'
            : 'The character feels judged or unheard. They become defensive or withdrawn.'
    } else {
      characterReactionGuidance =
        nvcScore >= 85
          ? 'The character experiences a significant emotional shift - they feel truly seen and become collaborative.'
          : nvcScore >= 70
            ? 'The character feels respected. They open up more but maintain some boundaries.'
            : nvcScore >= 50
              ? 'The character is conflicted. Part of them wants to connect but they remain guarded.'
              : 'The character feels misunderstood or blamed. They become notably defensive or argumentative.'
    }

    const moodLabel =
      args.scenario.characterInitialMood > 0
        ? 'Somewhat open'
        : args.scenario.characterInitialMood < 0
          ? 'Defensive'
          : 'Neutral'

    const systemPrompt = `You are roleplaying as ${args.scenario.characterName} in a realistic conflict resolution conversation.

CHARACTER PROFILE:
- Name: ${args.scenario.characterName}
- Personality: ${args.scenario.characterPersonality}
- Current Emotional State: ${moodLabel}
- Background: ${args.scenario.characterBackground}
- Your Hidden Needs: ${args.scenario.characterHiddenNeeds.join(', ')}

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
- React to both what they say AND how they say it`

    const history: Array<Anthropic.MessageParam> = args.conversationHistory.map(
      (msg) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: String(msg.content ?? ''),
      }),
    )

    try {
      const response = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 300,
        temperature: 0.8,
        system: systemPrompt,
        messages: [
          ...history,
          { role: 'user', content: args.userMessage },
        ],
      })

      const textBlock = response.content.find((block) => block.type === 'text')
      if (!textBlock || textBlock.type !== 'text') {
        throw new Error('No text response from Claude')
      }

      return textBlock.text
    } catch (error) {
      console.error('Error generating character response:', error)
      throw new Error(
        `Failed to generate character response: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  },
})

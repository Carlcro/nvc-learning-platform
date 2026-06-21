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

// JSON schema used when deciding whether we know enough to shape a scenario.
const scenarioReadinessSchema = {
  type: 'object',
  properties: {
    ready: { type: 'boolean' },
    questions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          question: { type: 'string' },
        },
        required: ['question'],
        additionalProperties: false,
      },
    },
  },
  required: ['ready', 'questions'],
  additionalProperties: false,
} as const

// JSON schema for a fully-formed roleplay scenario built from a real situation.
// Mirrors the fields scenarios.createCustom accepts.
const customScenarioSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    category: {
      type: 'string',
      enum: ['workplace', 'family', 'friendship', 'self_expression'],
    },
    difficulty: {
      type: 'string',
      enum: ['beginner', 'intermediate', 'advanced'],
    },
    situation: { type: 'string' },
    characterName: { type: 'string' },
    characterPersonality: { type: 'string' },
    characterInitialMood: { type: 'integer' },
    characterBackground: { type: 'string' },
    characterHiddenNeeds: { type: 'array', items: { type: 'string' } },
    aiOpeningMessage: { type: 'string' },
    learningObjectives: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['observation', 'feeling', 'need', 'request'],
      },
    },
    focusArea: { type: 'string' },
    estimatedDuration: { type: 'integer' },
    tags: { type: 'array', items: { type: 'string' } },
  },
  required: [
    'title',
    'description',
    'category',
    'difficulty',
    'situation',
    'characterName',
    'characterPersonality',
    'characterInitialMood',
    'characterBackground',
    'characterHiddenNeeds',
    'aiOpeningMessage',
    'learningObjectives',
    'focusArea',
    'estimatedDuration',
    'tags',
  ],
  additionalProperties: false,
} as const

export interface ClarifyingQA {
  question: string
  answer: string
}

export interface ScenarioReadinessResult {
  ready: boolean
  questions: Array<{ question: string }>
}

export interface CustomScenarioResult {
  title: string
  description: string
  category: 'workplace' | 'family' | 'friendship' | 'self_expression'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  situation: string
  characterName: string
  characterPersonality: string
  characterInitialMood: number
  characterBackground: string
  characterHiddenNeeds: Array<string>
  aiOpeningMessage: string
  learningObjectives: Array<string>
  focusArea: string
  estimatedDuration: number
  tags: Array<string>
}

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
    // What the user has already demonstrated earlier in THIS conversation, so
    // the coaching can point at the one piece that is still missing rather than
    // re-explaining things they have already done.
    componentsLanded: v.optional(
      v.object({
        feeling: v.boolean(),
        need: v.boolean(),
        request: v.boolean(),
      }),
    ),
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

    // Summarise progress so the "next step" can steer toward the earliest NVC
    // piece they have not yet expressed (feeling, then need, then request).
    const landed = args.componentsLanded
    const progressSummary = landed
      ? (() => {
          const done = [
            landed.feeling && 'a feeling',
            landed.need && 'a need',
            landed.request && 'a clear request',
          ].filter(Boolean) as Array<string>
          const todo = [
            !landed.feeling && 'a feeling',
            !landed.need && 'a need',
            !landed.request && 'a clear request',
          ].filter(Boolean) as Array<string>
          return [
            done.length
              ? `Already expressed earlier in this conversation: ${done.join(', ')}.`
              : 'They have not yet clearly expressed a feeling, need, or request.',
            todo.length ? `Still to come: ${todo.join(', ')}.` : 'All core pieces are present; help them refine.',
          ].join(' ')
        })()
      : 'This is early in the conversation.'

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

### Writing the Feedback (read carefully)
Write every text field in plain, warm, spoken English. Do NOT use markdown, asterisks, bold, headings, or bullet characters. Keep sentences short and easy to read at a glance.

- total = sum of the four component scores (max 100)
- whatWentWell: name the single best thing in THIS message, in one specific, encouraging sentence (max 15 words). Always find something genuine, even in a weak message.
- feedback: the ONE most useful next move, in a single short sentence (max 22 words). This is the heart of the coaching. Give a HINT, not a script: point them in a direction or ask a guiding question (for example "what's underneath that frustration?") so they discover their own words. NEVER hand them a phrase to copy or say. Use the progress summary: steer them toward the earliest piece they have NOT yet expressed in this conversation (feeling, then need, then request); if all three are present, help them sharpen the weakest component. Phrase it as an inviting nudge, never a correction, and do not restate what they already did well.
- giraffeAlternative: leave this as an empty string. Do not write a suggested phrase; the user should find their own wording.
- jackalPhrases: short verbatim excerpts from the user's response that read as judgmental or blaming; empty array if none
- isJackalLanguage: true only if the message leans on blame, judgment, or labels`

    const userPrompt = `## Conversation Context
${conversationContext}

## Progress so far in this conversation
${progressSummary}

## User's Response to Analyze
"${args.userMessage}"

Analyze this response against the four NVC components, then write concise, glanceable feedback that moves them one clear step forward.`

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
    // True once the user has expressed a feeling, a need, and a clear request.
    // The character then brings the scene to a natural close instead of opening
    // a new thread, so the conversation actually ends when ending is unlocked.
    shouldClose: v.optional(v.boolean()),
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

    // When the user has completed the full arc, steer the character toward a
    // genuine ending so the scene comes to rest rather than dangling.
    const closingGuidance = args.shouldClose
      ? `

THIS IS THE CLOSING MOMENT:
The user has expressed themselves fully and you now feel genuinely heard and understood. Let the conversation come to a natural, warm close:
- Acknowledge what shifted for you and that you feel heard.
- Respond with a sense of resolution, relief, or goodwill.
- Do NOT ask a question, raise a new concern, or open a new topic. Let your reply land as a gentle ending, not an invitation to keep going.
- Keep it short and heartfelt (1-2 sentences).`
      : ''

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
- React to both what they say AND how they say it${closingGuidance}`

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

// ============================================================================
// CUSTOM SCENARIO BUILDER ACTIONS
// ============================================================================

/**
 * Decide whether we know enough about a person's real situation to shape a
 * believable practice partner, and if not, return a few warm follow-up
 * questions aimed only at the gaps.
 *
 * Fails open: if anything goes wrong we proceed (ready: true) rather than
 * blocking someone from rehearsing.
 */
export const assessScenarioReadiness = action({
  args: {
    userDescription: v.string(),
    priorAnswers: v.array(
      v.object({ question: v.string(), answer: v.string() }),
    ),
    roundsSoFar: v.number(),
  },
  handler: async (_ctx, args): Promise<ScenarioReadinessResult> => {
    // Hard cap: two rounds of follow-ups, then we always proceed.
    const isFinalRound = args.roundsSoFar >= 2

    const transcript =
      args.priorAnswers.length > 0
        ? args.priorAnswers
            .map((qa) => `Q: ${qa.question}\nA: ${qa.answer || '(skipped)'}`)
            .join('\n\n')
        : 'No details gathered yet.'

    const systemPrompt = `You are a warm, grounded guide helping someone prepare to rehearse a real, difficult conversation from their life before they have it for real.

Your only job right now is to decide whether you have enough concrete detail to build a believable practice partner who behaves like the real person they described. You need a sense of:
1. Who the other person is and the nature of the relationship
2. A specific, observable thing that happened or a clear pattern (not a judgment)
3. How that person usually reacts when things get tense
4. What this person hopes to express or change in the conversation

If any of these is thin or missing, write up to 3 short, specific, gentle follow-up questions that fill exactly those gaps. Never ask about something they already shared. Keep questions plain and human, the way a caring friend would ask. Do not give advice, do not teach, and do not name any communication method.

If you already have enough to build a realistic partner, say it is ready and return no questions.`

    const userPrompt = `The person described their situation:
"${args.userDescription}"

What we have gathered so far:
${transcript}

${
  isFinalRound
    ? 'This is the final round. Mark it ready and return no questions.'
    : 'Decide whether this is ready. If not, list only the questions that close real gaps.'
}`

    try {
      const response = await anthropic.messages.parse({
        model: MODEL,
        max_tokens: 512,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
        output_config: {
          format: {
            type: 'json_schema',
            schema: scenarioReadinessSchema,
          },
        },
      })

      if (!response.parsed_output) {
        throw new Error('Empty structured response from Claude')
      }

      const result = response.parsed_output as ScenarioReadinessResult

      if (isFinalRound) {
        return { ready: true, questions: [] }
      }

      return {
        ready: result.ready,
        questions: result.questions.slice(0, 3),
      }
    } catch (error) {
      console.error('Error assessing scenario readiness:', error)
      // Fail open so the user is never stuck on this step.
      return { ready: true, questions: [] }
    }
  },
})

/**
 * Synthesize a fully-formed roleplay scenario from the person's account and the
 * clarifying answers. The character is built to behave like the real person
 * described, so the rehearsal feels true to life. Output maps onto
 * scenarios.createCustom.
 */
export const generateCustomScenario = action({
  args: {
    userDescription: v.string(),
    answers: v.array(
      v.object({ question: v.string(), answer: v.string() }),
    ),
  },
  handler: async (_ctx, args): Promise<CustomScenarioResult> => {
    const transcript =
      args.answers.length > 0
        ? args.answers
            .map((qa) => `Q: ${qa.question}\nA: ${qa.answer || '(not answered)'}`)
            .join('\n\n')
        : 'No additional details were provided.'

    const systemPrompt = `You build a realistic roleplay practice partner from a person's account of a real relationship and situation, so they can rehearse a hard conversation before having it for real.

Guidelines:
- Build the character to behave like the ACTUAL person described. Mirror their described temperament, typical reactions under tension, and likely emotional triggers.
- Do not make the character a cartoon villain, and do not make them implausibly easy. Aim for the difficulty the person implied.
- Infer the underlying needs that, if met, would soften this person, and put them in characterHiddenNeeds. These stay hidden from the user.
- characterInitialMood is an integer from -10 (very guarded/closed) to +10 (very open). Set it from how guarded or open the person seems given the situation.
- Write "situation" in second person ("You..."), 2-3 sentences, describing only observable events - no judgments or labels.
- Write "aiOpeningMessage" as the first thing this person would naturally say to open the conversation, in their own voice, with natural, casual speech.
- Choose category, difficulty, learningObjectives (a subset of observation, feeling, need, request), and a short snake_case focusArea that best fit.
- Write "description" and "title" warmly and encouragingly.
- Never invent graphic, abusive, or unsafe specifics the person did not provide. If the situation is emotionally heavy, keep the character firm but never cruel, and keep everything safe and non-judgmental.
- Never use emojis. Never mention any communication method, coaching, or that this is generated.`

    const userPrompt = `The person wants to rehearse this conversation:
"${args.userDescription}"

What they shared:
${transcript}

Produce the scenario object that best brings this real situation to life as a practice partner.`

    try {
      const response = await anthropic.messages.parse({
        model: MODEL,
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
        output_config: {
          format: {
            type: 'json_schema',
            schema: customScenarioSchema,
          },
        },
      })

      if (!response.parsed_output) {
        throw new Error('Empty structured response from Claude')
      }

      return response.parsed_output as CustomScenarioResult
    } catch (error) {
      console.error('Error generating custom scenario:', error)
      throw new Error(
        `Failed to generate custom scenario: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  },
})

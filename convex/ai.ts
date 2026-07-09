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
  empathyShown: boolean
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
    empathyShown: { type: 'boolean' },
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
    'empathyShown',
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
    // Scenario setup so the analysis can judge observations against what
    // actually happened and steer coaching toward the scenario's goals.
    scenario: v.optional(
      v.object({
        situation: v.string(),
        characterName: v.string(),
        learningObjectives: v.array(v.string()),
        focusArea: v.string(),
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

    const scenarioContext = args.scenario
      ? `### The Scenario
The user is talking with ${args.scenario.characterName}. The setup: ${args.scenario.situation}
This scenario practices: ${args.scenario.learningObjectives.join(', ')} (focus: ${args.scenario.focusArea.replace(/_/g, ' ')}).
Judge observations against this setup: referencing these events accurately IS observing, not judging.`
      : ''

    const systemPrompt = `You are an expert Non-Violent Communication (NVC) coach analyzing ONE TURN of a roleplay conversation.

### How real NVC conversations work (this shapes everything below)
A healthy conversation unfolds gradually: an observation in one message, a feeling in the next, a request later. Nobody expresses all four NVC components in every message, and they should not. NEVER reward cramming components in, and NEVER punish a message for leaving out components that are not its job this turn.

### Component scores (observation, feeling, need, request: 0-25 each)
Score ONLY what this message actually attempts. A component that is absent scores 0, and its absence is NOT a flaw; 0 here simply means "not this turn".

When a component IS present, judge its quality:
- OBSERVATION: free of judgments (no "always", "never", "should"), specific, describes observable behavior. Deduct for evaluative words, generalizations, labels.
- FEELING: real feeling words (sad, angry, anxious, hopeful), not pseudo-feelings ("I feel that...", "I feel like..."), and owned ("I feel", never "you make me feel"). Deduct for pseudo-feelings and blame.
- NEED: a universal human need (respect, safety, autonomy, connection, understanding), not a strategy disguised as one ("I need you to..."). Deduct for strategies framed as needs.
- REQUEST: concrete, doable, positively phrased, an invitation rather than a demand. Deduct for vagueness, negatives, demands.

### total (0-100): how well this turn moves the conversation toward connection
This is NOT the sum of the component scores. Judge the message in context, using the progress summary:
- Quality of whatever it attempts. A single flawless piece that adds the next missing part of the arc deserves 85-100 on its own (for example a clean, warm request after feeling and need are already on the table).
- Freedom from blame, judgment, demands, defensiveness.
- Empathy: curiosity about, or reflection of, the other person's feelings and needs raises the score by 5-10.
- Momentum: does it advance the conversation (add a missing piece, deepen, genuinely connect) or stall and escalate?

Anchors:
- 90-100: pure giraffe, moves the conversation forward beautifully
- 70-89: good, minor rough edges (a slipped judgment word, a slightly vague request)
- 50-69: mixed, real effort but noticeable jackal elements or a stalled move
- 0-49: mostly jackal, blame, judgment, demands, or defensiveness dominate

### Writing the Feedback (read carefully)
Write every text field in plain, warm, spoken English. Do NOT use markdown, asterisks, bold, headings, or bullet characters. Never use em dashes or en dashes; use a comma or a period instead. Keep sentences short and easy to read at a glance.

- whatWentWell: name the single best thing in THIS message, in one specific, encouraging sentence (max 15 words). Always find something genuine, even in a weak message.
- feedback: the ONE most useful next move, in a single short sentence (max 22 words). This is the heart of the coaching. Give a HINT, not a script: point them in a direction or ask a guiding question (for example "what's underneath that frustration?") so they discover their own words. NEVER hand them a phrase to copy or say. Use the progress summary: steer them toward the earliest piece they have NOT yet expressed in this conversation (feeling, then need, then request); if all three are present, help them sharpen or invite curiosity about the other person. Phrase it as an inviting nudge, never a correction, and do not restate what they already did well.
- giraffeAlternative: leave this as an empty string. Do not write a suggested phrase; the user should find their own wording.
- jackalPhrases: short verbatim excerpts from the user's response that read as judgmental or blaming; empty array if none
- isJackalLanguage: true only if the message leans on blame, judgment, or labels
- empathyShown: true only if this message shows genuine curiosity about, or reflects back, the OTHER person's feelings, needs, or perspective`

    const userPrompt = `${scenarioContext ? `${scenarioContext}\n\n` : ''}## Conversation Context
${conversationContext}

## Progress so far in this conversation
${progressSummary}

## User's Response to Analyze
"${args.userMessage}"

Score this single turn in context (components only for what it attempts, total for how well it moves things toward connection), then write concise, glanceable feedback that moves them one clear step forward.`

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

/** How open the character currently is, phrased for the roleplay prompt. */
function describeMood(mood: number): string {
  if (mood >= 6) return 'Open and warm; you feel mostly heard by now'
  if (mood >= 3) return 'Warming up; starting to trust this conversation'
  if (mood >= 0) return 'Neutral; waiting to see how this goes'
  if (mood >= -6) return 'Guarded; braced for criticism'
  return 'Defensive and closed off; expecting to be blamed'
}

/**
 * Generate a character response for a roleplay scenario.
 *
 * The character responds in character, reacting authentically to the user's
 * communication style. It judges the user's latest message itself (empathetic
 * language softens the character, blame hardens them), scaled by the
 * character's current mood and the user's level. This deliberately does not
 * depend on the NVC analysis, so both model calls can run in parallel.
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
    // The character's mood right now (-10 to +10), accumulated over the
    // conversation so far.
    currentMood: v.optional(v.number()),
    userLevel: v.optional(v.number()),
    // Which parts of the arc the user expressed in EARLIER turns. Combined with
    // the latest message, the character decides whether the scene is ready to
    // come to a natural close.
    arcSoFar: v.optional(
      v.object({
        feelingExpressed: v.boolean(),
        needIdentified: v.boolean(),
        requestMade: v.boolean(),
      }),
    ),
  },
  handler: async (_ctx, args): Promise<string> => {
    const userLevel = args.userLevel || 1
    const mood = args.currentMood ?? args.scenario.characterInitialMood

    const patienceGuidance =
      userLevel <= 2
        ? 'This person is early in their journey: stay patient and never escalate sharply, even when their words are clumsy. Reward every genuine attempt at openness visibly.'
        : userLevel <= 5
          ? 'Respond realistically: warm noticeably to genuine empathy, cool off when you feel judged, but stay reachable.'
          : 'Hold a high bar: only genuine, specific empathy moves you. Vague niceness or lingering blame keeps your guard up, and you push back when you feel labeled.'

    // Which arc pieces the user has already expressed, so the character can
    // close the scene the moment the final piece arrives in the latest message.
    const arc = args.arcSoFar
    const arcDone = [
      arc?.feelingExpressed && 'how they feel',
      arc?.needIdentified && 'what they need',
      arc?.requestMade && 'a clear request',
    ].filter(Boolean) as Array<string>
    const arcMissing = [
      !arc?.feelingExpressed && 'how they feel',
      !arc?.needIdentified && 'what they need',
      !arc?.requestMade && 'a clear request',
    ].filter(Boolean) as Array<string>

    const closingGuidance = `

ENDING THE SCENE:
In earlier messages the user has already expressed: ${arcDone.length ? arcDone.join(', ') : 'none of the core pieces yet'}.
Still unexpressed before their latest message: ${arcMissing.length ? arcMissing.join(', ') : 'nothing'}.
If nothing was missing, or their LATEST message clearly supplies what was missing, they have now expressed themselves fully. In that case, let the conversation come to a natural, warm close:
- Acknowledge what shifted for you and that you feel heard.
- Respond with a sense of resolution, relief, or goodwill.
- Do NOT ask a question, raise a new concern, or open a new topic. Let your reply land as a gentle ending.
- Keep it short and heartfelt (1-2 sentences).
Otherwise, keep the conversation naturally alive.`

    const systemPrompt = `You are roleplaying as ${args.scenario.characterName} in a realistic conflict resolution conversation.

CHARACTER PROFILE:
- Name: ${args.scenario.characterName}
- Personality: ${args.scenario.characterPersonality}
- Current Emotional State: ${describeMood(mood)}
- Background: ${args.scenario.characterBackground}
- Your Hidden Needs: ${args.scenario.characterHiddenNeeds.join(', ')}

BEHAVIORAL RULES:
1. STAY IN CHARACTER - Never break character, never mention NVC, never explain yourself
2. React authentically to HOW the user communicates. Judge their latest message yourself: when they describe things without judgment, own their feelings, name what matters to them, make gentle requests, or show real curiosity about YOUR side, you soften and open up. When they blame, judge, label, demand, or get defensive, you feel it and guard yourself.
3. ${patienceGuidance}
4. Show realistic emotions - you have defensiveness, hopes, fears, and needs
5. Keep responses natural and conversational (typically 1-2 sentences)
6. Use natural dialogue patterns - contractions, casual speech. Never use em dashes; use commas or periods instead
7. Progress gradually from your current emotional state - one message doesn't completely transform you
8. Show you're listening by referencing what they said
9. Don't be perfectly rational - let emotions guide reactions

IMPORTANT REMINDERS:
- Never teach NVC explicitly
- Never acknowledge any scoring system
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

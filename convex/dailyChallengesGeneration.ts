'use node'

import Anthropic from '@anthropic-ai/sdk'
import { internalAction } from './_generated/server'

/**
 * Daily Challenge Scenario Generation
 *
 * Generates fresh scenario variations via Claude.
 * Runs in a Node.js Convex action.
 */

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const MODEL = 'claude-sonnet-4-6'

interface GeneratedScenario {
  title: string
  description: string
  category: 'workplace' | 'family' | 'friendship' | 'self_expression'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  characterName: string
  characterPersonality: string
  characterInitialMood: number
  characterBackground: string
  characterHiddenNeeds: Array<string>
  situation: string
  aiOpeningMessage: string
  learningObjectives: Array<string>
  focusArea: string
}

/**
 * Generate 3 scenario variations (beginner, intermediate, advanced)
 * Uses AI to create fresh, diverse scenarios
 */
export const generateThreeScenarios = internalAction({
  args: {},
  handler: async () => {
    return await generateThreeScenariosFn()
  },
})

async function generateThreeScenariosFn(): Promise<Array<GeneratedScenario>> {
  const prompt = `You are an expert in Non-Violent Communication (NVC) and conflict resolution. Generate 3 distinct daily challenge scenarios for an NVC learning app.

Each scenario should be a realistic interpersonal conflict situation that users can practice NVC communication in.

Requirements for each scenario:
1. BEGINNER (Easy level):
   - Clear, straightforward conflict
   - Single NVC component focus
   - Forgiving character that responds well to basic NVC
   - Category: Choose from [workplace, family, friendship, self_expression]
   - Duration: 5-10 minutes

2. INTERMEDIATE (Medium level):
   - More nuanced conflict with multiple perspectives
   - Multiple NVC components required
   - Character with realistic emotional reactions
   - Category: Choose from [workplace, family, friendship, self_expression]
   - Duration: 10-15 minutes

3. ADVANCED (Hard level):
   - Complex interpersonal dynamics
   - Requires sophisticated NVC understanding
   - Defensive character that gradually opens up with good NVC
   - Category: Choose from [workplace, family, friendship, self_expression]
   - Duration: 15-20 minutes

For each scenario, return a JSON object with:
- title: Concise, clear title (5-8 words)
- description: 1-2 sentence description of the conflict
- category: One of [workplace, family, friendship, self_expression]
- difficulty: One of [beginner, intermediate, advanced]
- characterName: First name only
- characterPersonality: 2-3 sentences describing personality traits
- characterInitialMood: Number from -10 (very closed/defensive) to +10 (very open)
- characterBackground: 1-2 sentences of background and motivation context
- characterHiddenNeeds: Array of 2-3 universal needs that, if met, would soften this character (hidden from the user)
- situation: 3-4 sentences setting up the conflict, written in second person ("You...")
- aiOpeningMessage: The character's first message (2-3 sentences)
- learningObjectives: Array of 2-3 NVC components to practice [observation, feeling, need, request]
- focusArea: One of [conflict_resolution, boundary_setting, feedback_response, appreciation, apology, request_making, empathy]

Return the scenarios in the required structured format. Produce exactly 3 scenarios, one per difficulty level, in order: beginner, intermediate, advanced.`

  try {
    const response = await anthropic.messages.parse({
      model: MODEL,
      max_tokens: 2000,
      temperature: 1, // Encourage creativity and variety
      messages: [{ role: 'user', content: prompt }],
      output_config: {
        format: {
          type: 'json_schema',
          schema: scenarioBatchSchema,
        },
      },
    })

    const parsed = response.parsed_output as
      | { scenarios: Array<GeneratedScenario> }
      | null

    if (!parsed || !Array.isArray(parsed.scenarios)) {
      throw new Error('Empty structured response from Claude')
    }

    const scenarios = parsed.scenarios
    if (scenarios.length !== 3 || !validateScenarios(scenarios)) {
      throw new Error('Invalid scenario format from Claude')
    }

    return scenarios
  } catch (error) {
    console.error('Error generating scenarios:', error)
    // Return fallback scenarios
    return generateFallbackScenarios()
  }
}

const scenarioSchema = {
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
    characterName: { type: 'string' },
    characterPersonality: { type: 'string' },
    characterInitialMood: { type: 'integer' },
    characterBackground: { type: 'string' },
    characterHiddenNeeds: { type: 'array', items: { type: 'string' } },
    situation: { type: 'string' },
    aiOpeningMessage: { type: 'string' },
    learningObjectives: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['observation', 'feeling', 'need', 'request'],
      },
    },
    focusArea: {
      type: 'string',
      enum: [
        'conflict_resolution',
        'boundary_setting',
        'feedback_response',
        'appreciation',
        'apology',
        'request_making',
        'empathy',
      ],
    },
  },
  required: [
    'title',
    'description',
    'category',
    'difficulty',
    'characterName',
    'characterPersonality',
    'characterInitialMood',
    'characterBackground',
    'characterHiddenNeeds',
    'situation',
    'aiOpeningMessage',
    'learningObjectives',
    'focusArea',
  ],
  additionalProperties: false,
} as const

const scenarioBatchSchema = {
  type: 'object',
  properties: {
    scenarios: {
      type: 'array',
      items: scenarioSchema,
    },
  },
  required: ['scenarios'],
  additionalProperties: false,
} as const

/**
 * Validate that generated scenarios have required fields
 */
function validateScenarios(scenarios: Array<GeneratedScenario>): boolean {
  const requiredFields: Array<keyof GeneratedScenario> = [
    'title',
    'description',
    'category',
    'difficulty',
    'characterName',
    'characterPersonality',
    'characterInitialMood',
    'characterBackground',
    'characterHiddenNeeds',
    'situation',
    'aiOpeningMessage',
    'learningObjectives',
    'focusArea',
  ]

  return scenarios.every((scenario) =>
    requiredFields.every((field) => field in scenario),
  )
}

/**
 * Generate fallback scenarios in case AI generation fails
 */
function generateFallbackScenarios(): Array<GeneratedScenario> {
  return [
    {
      title: 'Miscommunication with a Friend',
      description:
        'Your friend cancelled plans last minute and you feel hurt. Practice expressing your feelings without blame.',
      category: 'friendship',
      difficulty: 'beginner',
      characterName: 'Sam',
      characterPersonality:
        'Friendly but sometimes forgetful, values connection, gets defensive when criticized',
      characterInitialMood: 0,
      characterBackground:
        'Sam juggles a lot of commitments and hates letting people down, which makes them scattered.',
      characterHiddenNeeds: ['acceptance', 'ease', 'connection'],
      situation:
        'You and Sam had plans to go to a movie tonight. An hour before you were supposed to meet, Sam texted saying they forgot they already committed to something else and cannot make it. You feel disappointed and hurt.',
      aiOpeningMessage:
        "I know I messed up on the plans. I completely forgot I'd already promised to help Jordan move. I felt terrible when I realized.",
      learningObjectives: ['feeling', 'observation'],
      focusArea: 'boundary_setting',
    },
    {
      title: 'Workplace Feedback Concerns',
      description:
        'A colleague gave you feedback on your work and you felt it was unfair. Practice expressing your perspective clearly.',
      category: 'workplace',
      difficulty: 'intermediate',
      characterName: 'Alex',
      characterPersonality:
        'Direct communicator, values efficiency, sometimes comes across as harsh, actually cares deeply about team success',
      characterInitialMood: -2,
      characterBackground:
        'Alex has been burned by projects failing late and now pushes hard on quality early, without noticing how it lands.',
      characterHiddenNeeds: ['competence', 'trust', 'contribution'],
      situation:
        'In a team meeting, Alex said your recent project proposal "lacks clear structure and seems rushed." You felt embarrassed and defensive. The feedback stung because you worked hard on it. Now Alex is walking by your desk and pauses.',
      aiOpeningMessage:
        "Hey, I noticed you seemed upset after the meeting. I want to clarify what I meant. I wasn't trying to dismiss your work—I see potential in the idea.",
      learningObjectives: ['observation', 'need', 'request'],
      focusArea: 'conflict_resolution',
    },
    {
      title: 'Family Boundary Conflict',
      description:
        "A family member keeps bringing up a sensitive topic that you've asked them not to discuss. Practice setting boundaries respectfully.",
      category: 'family',
      difficulty: 'advanced',
      characterName: 'Jamie',
      characterPersonality:
        'Well-meaning but struggles to respect boundaries, comes from a generation where direct communication was less valued, values family closeness above all, can be stubborn but is ultimately loving',
      characterInitialMood: -4,
      characterBackground:
        'Jamie shows love through involvement and worries that backing off would mean losing closeness with you.',
      characterHiddenNeeds: ['closeness', 'reassurance', 'to matter'],
      situation:
        'Your family member Jamie keeps asking about your personal life choices despite you having asked them multiple times to drop the subject. They bring it up again at a family gathering and everyone goes quiet. You need to address this firmly but without damaging the relationship.',
      aiOpeningMessage:
        "I just want you to know I bring this up because I care about you. I only want what's best for you and your future.",
      learningObjectives: ['observation', 'feeling', 'need', 'request'],
      focusArea: 'boundary_setting',
    },
  ]
}

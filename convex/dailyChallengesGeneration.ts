'use node'

import { internalAction } from './_generated/server'
import OpenAI from 'openai'

/**
 * Daily Challenge Scenario Generation
 *
 * Handles AI-based scenario generation using OpenAI
 * This file uses Node.js for API calls
 */

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

interface GeneratedScenario {
  title: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  characterName: string
  characterPersonality: string
  characterInitialMood: number
  situation: string
  aiOpeningMessage: string
  learningObjectives: string[]
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

async function generateThreeScenariosFn(): Promise<GeneratedScenario[]> {
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
- situation: 3-4 sentences setting up the conflict
- aiOpeningMessage: The character\'s first message (2-3 sentences)
- learningObjectives: Array of 2-3 NVC components to practice [observation, feeling, need, request]
- focusArea: One of [conflict_resolution, boundary_setting, feedback_response, appreciation, apology, request_making, empathy]

Return ONLY a valid JSON array with 3 objects, no markdown or explanation:
[
  { beginner scenario object },
  { intermediate scenario object },
  { advanced scenario object }
]`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 2000,
      temperature: 1, // Encourage creativity and variety
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from AI')
    }

    // Parse JSON response
    const scenarios = JSON.parse(content) as GeneratedScenario[]

    // Validate the response
    if (
      !Array.isArray(scenarios) ||
      scenarios.length !== 3 ||
      !validateScenarios(scenarios)
    ) {
      throw new Error('Invalid scenario format from AI')
    }

    return scenarios
  } catch (error) {
    console.error('Error generating scenarios:', error)
    // Return fallback scenarios
    return generateFallbackScenarios()
  }
}

/**
 * Validate that generated scenarios have required fields
 */
function validateScenarios(scenarios: any[]): boolean {
  const requiredFields = [
    'title',
    'description',
    'category',
    'difficulty',
    'characterName',
    'characterPersonality',
    'characterInitialMood',
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
function generateFallbackScenarios(): GeneratedScenario[] {
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
      situation:
        'You and Sam had plans to go to a movie tonight. An hour before you were supposed to meet, Sam texted saying they forgot they already committed to something else and cannot make it. You feel disappointed and hurt.',
      aiOpeningMessage:
        "I know I messed up on the plans. I completely forgot I\'d already promised to help Jordan move. I felt terrible when I realized.",
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
      situation:
        'In a team meeting, Alex said your recent project proposal "lacks clear structure and seems rushed." You felt embarrassed and defensive. The feedback stung because you worked hard on it. Now Alex is walking by your desk and pauses.',
      aiOpeningMessage:
        "Hey, I noticed you seemed upset after the meeting. I want to clarify what I meant. I wasn\'t trying to dismiss your work—I see potential in the idea.",
      learningObjectives: ['observation', 'need', 'request'],
      focusArea: 'conflict_resolution',
    },
    {
      title: 'Family Boundary Conflict',
      description:
        'A family member keeps bringing up a sensitive topic that you\'ve asked them not to discuss. Practice setting boundaries respectfully.',
      category: 'family',
      difficulty: 'advanced',
      characterName: 'Jamie',
      characterPersonality:
        'Well-meaning but struggles to respect boundaries, comes from a generation where direct communication was less valued, values family closeness above all, can be stubborn but is ultimately loving',
      characterInitialMood: -4,
      situation:
        'Your family member Jamie keeps asking about your personal life choices despite you having asked them multiple times to drop the subject. They bring it up again at a family gathering and everyone goes quiet. You need to address this firmly but without damaging the relationship.',
      aiOpeningMessage:
        "I just want you to know I bring this up because I care about you. I only want what\'s best for you and your future.",
      learningObjectives: ['observation', 'feeling', 'need', 'request'],
      focusArea: 'boundary_setting',
    },
  ]
}

import { createFileRoute } from '@tanstack/react-router'
import { useMutation } from 'convex/react'
import { useState } from 'react'
import { api } from '../../../convex/_generated/api'
import { Button } from '~/components/ui/Button'
import { Card, CardBody } from '~/components/ui/Card'

export const Route = createFileRoute('/admin/seed-scenarios')({
  component: SeedScenariosPage,
})

function SeedScenariosPage() {
  const createScenario = useMutation(api.scenarios.create)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const scenarios = [
    {
      title: 'Colleague Feedback',
      description:
        'Your coworker gave you critical feedback during a team meeting and you felt blindsided. Practice expressing your feelings without blame.',
      category: 'workplace' as const,
      difficulty: 'beginner' as const,
      characterName: 'Jordan',
      characterPersonality:
        'Direct and detail-oriented, values efficiency and honest feedback, not intentionally hurtful',
      characterEmotionalState:
        'Neutral to slightly defensive, does not realize the impact of their words',
      characterBackground:
        'Project manager with a results-oriented approach. Tends to prioritize productivity over emotional awareness.',
      characterHiddenNeeds: [
        'Respect for their directness',
        'Efficiency in teamwork',
        'Being understood as well-intentioned',
      ],
      aiOpeningMessage:
        "Look, I was just giving you honest feedback. You know I'm always straightforward. Is there an issue with what I said?",
      situation: `During today's team standup, Jordan said: "Your code review process is too slow. It's holding up the team."

You felt embarrassed and hurt that this was said in front of everyone. This is your chance to respond to Jordan and express how you felt, what you need, and what might work better moving forward.`,
      learningGoals: [
        'Practice separating observation from judgment',
        'Express feelings without blame',
        'Identify what is important to you (a universal need)',
        'Make a clear request for future communication',
      ],
      unlockLevel: 1,
      estimatedDuration: 8,
    },
    {
      title: 'Family Responsibility Conflict',
      description:
        'You feel frustrated that your sibling is not helping with household chores as promised. Learn to express your needs without accusation.',
      category: 'family' as const,
      difficulty: 'beginner' as const,
      characterName: 'Alex',
      characterPersonality:
        'Busy with work, feels guilty about not helping, can be defensive if attacked, cares about family',
      characterEmotionalState:
        'Stressed about work, guilty but defensive, not wanting to feel blamed',
      characterBackground:
        'Alex recently took on extra responsibilities at work and is struggling to balance everything. They feel overwhelmed and sometimes shut down when confronted.',
      characterHiddenNeeds: [
        'Compassion for their workload',
        'To not be blamed or shamed',
        'Support rather than criticism',
      ],
      aiOpeningMessage:
        'Hey, I know I have been slacking on chores. I have just had so much going on at work. Can we talk about this when I am less stressed?',
      situation: `You agreed with your sibling Alex that you would share household chores equally. Last weekend, you did most of the cleaning while Alex said they were too busy.

Today, you notice the kitchen is messy again and Alex is relaxing on the couch. You are feeling frustrated and want to address this. This is your chance to express what you are observing and how it affects you.`,
      learningGoals: [
        'Describe specific behaviors without blame',
        'Name the feeling underneath your frustration',
        'Connect to what matters to you (respect, fairness, cooperation)',
        'Request specific actions going forward',
      ],
      unlockLevel: 1,
      estimatedDuration: 8,
    },
    {
      title: 'Friend Canceled Plans',
      description:
        'Your friend canceled your plans at the last minute again. Practice expressing disappointment while staying open and curious.',
      category: 'friendship' as const,
      difficulty: 'beginner' as const,
      characterName: 'Sam',
      characterPersonality:
        'Genuine and caring, has a chaotic schedule, sometimes over-commits, struggles with organization',
      characterEmotionalState:
        'Stressed and guilty about canceling again, anxious about the friendship strain',
      characterBackground:
        'Sam is juggling a demanding job with personal commitments. They deeply value the friendship but have difficulty saying no and managing their time.',
      characterHiddenNeeds: [
        'Understanding and acceptance',
        'To not be abandoned due to their struggles',
        'Space to be imperfect',
      ],
      aiOpeningMessage:
        'Hey, I am so sorry, something came up at work. I feel terrible about this. I know I keep doing this... do you hate me?',
      situation: `You had plans to meet Sam this evening to catch a movie and grab dinner. An hour before you were supposed to meet, Sam texted: "Hey, I am so sorry, something came up at work. Can we reschedule?"

This is the third time in two months Sam has canceled. You are disappointed and hurt, but you also care about the friendship. You want to express how this pattern affects you while staying open to understanding what is going on with them.`,
      learningGoals: [
        'Acknowledge your feelings without making Sam the villain',
        'Express the impact of their actions on you',
        'Share what you need from the friendship',
        'Stay curious about their perspective',
      ],
      unlockLevel: 1,
      estimatedDuration: 8,
    },
  ]

  const handleSeed = async () => {
    setLoading(true)
    setMessage('')

    try {
      for (const scenario of scenarios) {
        await createScenario(scenario as any)
      }
      setMessage(`✅ Successfully seeded ${scenarios.length} scenarios!`)
    } catch (error) {
      setMessage(
        `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
      console.error('Seed error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-giraffe-50 to-cream p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-brown-800">
            🌱 Seed Scenarios
          </h1>
          <p className="text-brown-600">
            Add the initial set of beginner scenarios to your database
          </p>
        </div>

        <Card>
          <CardBody className="space-y-4">
            <div className="space-y-2">
              <h2 className="font-semibold text-brown-800">
                Scenarios to Create:
              </h2>
              <ul className="space-y-2">
                {scenarios.map((s) => (
                  <li
                    key={s.title}
                    className="text-sm text-brown-700 flex items-start gap-2"
                  >
                    <span className="text-giraffe-500 mt-0.5">•</span>
                    <div>
                      <div className="font-semibold">{s.title}</div>
                      <div className="text-xs text-brown-600">
                        {s.description}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              onClick={handleSeed}
              isLoading={loading}
              disabled={loading}
              variant="primary"
              size="lg"
              className="w-full"
            >
              {loading ? 'Seeding...' : 'Seed All Scenarios'}
            </Button>

            {message && (
              <div
                className={`p-4 rounded-lg text-sm font-semibold ${
                  message.startsWith('✅')
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    : 'bg-red-50 text-red-800 border border-red-300'
                }`}
              >
                {message}
              </div>
            )}
          </CardBody>
        </Card>

        <Card className="bg-blue-50 border-2 border-blue-300">
          <CardBody>
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <h3 className="font-bold text-blue-900 mb-2">How to Use</h3>
                <p className="text-sm text-blue-800 leading-relaxed">
                  Click the "Seed All Scenarios" button above to add the 3
                  beginner scenarios to your database. After seeding, you will
                  see them in the /practice page. This is a one-time setup step.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-giraffe-50 border-2 border-giraffe-300">
          <CardBody>
            <div className="flex items-start gap-3">
              <div className="text-2xl">🦒</div>
              <p className="text-sm text-brown-800 leading-relaxed">
                After seeding, go to <strong>/admin/seed-scenarios</strong> then
                navigate to <strong>/practice</strong> to see the scenarios in
                your scenario browser!
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

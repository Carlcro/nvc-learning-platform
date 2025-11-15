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
  const seedAll = useMutation(api.scenarios.seedAll)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [scenarioBreakdown, setScenarioBreakdown] = useState<{
    beginner?: number
    intermediate?: number
    advanced?: number
  } | null>(null)

  const handleSeedAll = async () => {
    setLoading(true)
    setMessage('')
    setScenarioBreakdown(null)

    try {
      const result = (await seedAll()) as any
      if (result.success) {
        setMessage(`✅ ${result.message}`)
        setScenarioBreakdown(result.breakdown)
      } else {
        setMessage(`⚠️ ${result.message}`)
      }
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
    <div className="min-h-screen bg-linear-to-b from-giraffe-50 to-cream p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-brown-800">
            🌱 Seed All Scenarios
          </h1>
          <p className="text-brown-600">
            Add the complete set of NVC practice scenarios to your database
          </p>
        </div>

        <Card>
          <CardBody className="space-y-4">
            <div className="space-y-3">
              <h2 className="font-semibold text-brown-800">
                Scenarios to Create:
              </h2>

              <div className="space-y-3">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                  <div className="font-semibold text-blue-900 mb-2">
                    🎯 Beginner Scenarios (3)
                  </div>
                  <ul className="text-sm text-blue-800 space-y-1 ml-2">
                    <li>• Colleague Feedback - Workplace criticism</li>
                    <li>• Family Responsibility Conflict - Chore disputes</li>
                    <li>• Friend Canceled Plans - Repeated cancellations</li>
                  </ul>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded">
                  <div className="font-semibold text-amber-900 mb-2">
                    ⭐ Intermediate Scenarios (4)
                  </div>
                  <ul className="text-sm text-amber-800 space-y-1 ml-2">
                    <li>• Romantic Partner Emotional Distance</li>
                    <li>• Workplace Boundary with Boss</li>
                    <li>• Friend's Hurtful Comment About Your Appearance</li>
                    <li>• Parent Critical of Your Life Choices</li>
                  </ul>
                </div>

                <div className="bg-orange-50 border-l-4 border-orange-400 p-3 rounded">
                  <div className="font-semibold text-orange-900 mb-2">
                    🔥 Advanced Scenarios (2)
                  </div>
                  <ul className="text-sm text-orange-800 space-y-1 ml-2">
                    <li>• Team Member Undermining You at Work</li>
                    <li>
                      • Navigating Different Parenting Styles with Co-Parent
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSeedAll}
              isLoading={loading}
              disabled={loading}
              variant="primary"
              size="lg"
              className="w-full"
            >
              {loading ? 'Seeding...' : 'Seed All 9 Scenarios'}
            </Button>

            {message && (
              <div
                className={`p-4 rounded-lg text-sm font-semibold ${
                  message.startsWith('✅')
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    : message.startsWith('⚠️')
                      ? 'bg-yellow-50 text-yellow-800 border border-yellow-300'
                      : 'bg-red-50 text-red-800 border border-red-300'
                }`}
              >
                {message}
              </div>
            )}

            {scenarioBreakdown && (
              <div className="bg-giraffe-50 border border-giraffe-200 rounded-lg p-4">
                <h3 className="font-semibold text-giraffe-900 mb-2">
                  Scenarios Added:
                </h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-2xl font-bold text-giraffe-600">
                      {scenarioBreakdown.beginner}
                    </div>
                    <div className="text-xs text-giraffe-700">Beginner</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-giraffe-600">
                      {scenarioBreakdown.intermediate}
                    </div>
                    <div className="text-xs text-giraffe-700">Intermediate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-giraffe-600">
                      {scenarioBreakdown.advanced}
                    </div>
                    <div className="text-xs text-giraffe-700">Advanced</div>
                  </div>
                </div>
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
                  Click the "Seed All 9 Scenarios" button above to add all
                  beginner, intermediate, and advanced scenarios to your
                  database. After seeding, you will see them in the /practice
                  page. This is a one-time setup step.
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
                After seeding, navigate to <strong>/practice</strong> to see all
                scenarios in your scenario browser! You can filter by difficulty
                and category.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

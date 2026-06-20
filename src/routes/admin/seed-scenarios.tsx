import { createFileRoute } from '@tanstack/react-router'
import { useMutation } from 'convex/react'
import { useState } from 'react'
import { api } from '../../../convex/_generated/api'
import { Button } from '~/components/ui/Button'
import { Card, CardBody } from '~/components/ui/Card'

export const Route = createFileRoute('/admin/seed-scenarios')({
  component: SeedScenariosPage,
})

type Status = 'success' | 'warning' | 'error'

function SeedScenariosPage() {
  const seedAll = useMutation(api.scenarios.seedAll)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status | null>(null)
  const [scenarioBreakdown, setScenarioBreakdown] = useState<{
    beginner?: number
    intermediate?: number
    advanced?: number
  } | null>(null)

  const handleSeedAll = async () => {
    setLoading(true)
    setMessage('')
    setStatus(null)
    setScenarioBreakdown(null)

    try {
      const result = (await seedAll()) as any
      if (result.success) {
        setStatus('success')
        setMessage(result.message)
        setScenarioBreakdown(result.breakdown)
      } else {
        setStatus('warning')
        setMessage(result.message)
      }
    } catch (error) {
      setStatus('error')
      setMessage(
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
      console.error('Seed error:', error)
    } finally {
      setLoading(false)
    }
  }

  const messageStyles: Record<Status, string> = {
    success: 'bg-empathy-high/15 text-brown-800 border border-empathy-high/40',
    warning: 'bg-giraffe-50 text-brown-700 border border-giraffe-200',
    error: 'bg-empathy-low/15 text-empathy-low border border-empathy-low/40',
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-giraffe-50 to-cream pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-brown-800">
            Seed all scenarios
          </h1>
          <p className="text-brown-600">
            Add the complete set of NVC practice scenarios to your database
          </p>
        </div>

        <Card>
          <CardBody className="space-y-4">
            <div className="space-y-3">
              <h2 className="font-semibold text-brown-800">
                Scenarios to create
              </h2>

              <div className="space-y-3">
                <div className="bg-giraffe-50 border-2 border-giraffe-100 p-3 rounded-lg">
                  <div className="font-semibold text-brown-800 mb-2">
                    Beginner scenarios (3)
                  </div>
                  <ul className="text-sm text-brown-700 space-y-1 ml-2">
                    <li>Colleague Feedback - Workplace criticism</li>
                    <li>Family Responsibility Conflict - Chore disputes</li>
                    <li>Friend Canceled Plans - Repeated cancellations</li>
                  </ul>
                </div>

                <div className="bg-giraffe-50 border-2 border-giraffe-100 p-3 rounded-lg">
                  <div className="font-semibold text-brown-800 mb-2">
                    Intermediate scenarios (4)
                  </div>
                  <ul className="text-sm text-brown-700 space-y-1 ml-2">
                    <li>Romantic Partner Emotional Distance</li>
                    <li>Workplace Boundary with Boss</li>
                    <li>Friend's Hurtful Comment About Your Appearance</li>
                    <li>Parent Critical of Your Life Choices</li>
                  </ul>
                </div>

                <div className="bg-giraffe-50 border-2 border-giraffe-100 p-3 rounded-lg">
                  <div className="font-semibold text-brown-800 mb-2">
                    Advanced scenarios (2)
                  </div>
                  <ul className="text-sm text-brown-700 space-y-1 ml-2">
                    <li>Team Member Undermining You at Work</li>
                    <li>
                      Navigating Different Parenting Styles with Co-Parent
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
              {loading ? 'Seeding...' : 'Seed all 9 scenarios'}
            </Button>

            {message && status && (
              <div
                className={`p-4 rounded-lg text-sm font-semibold ${messageStyles[status]}`}
              >
                {message}
              </div>
            )}

            {scenarioBreakdown && (
              <div className="bg-giraffe-50 border border-giraffe-200 rounded-lg p-4">
                <h3 className="font-semibold text-brown-800 mb-2">
                  Scenarios added
                </h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-2xl font-bold text-giraffe-700">
                      {scenarioBreakdown.beginner}
                    </div>
                    <div className="text-xs text-brown-600">Beginner</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-giraffe-700">
                      {scenarioBreakdown.intermediate}
                    </div>
                    <div className="text-xs text-brown-600">Intermediate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-giraffe-700">
                      {scenarioBreakdown.advanced}
                    </div>
                    <div className="text-xs text-brown-600">Advanced</div>
                  </div>
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h3 className="font-bold text-brown-800 mb-2">How to use</h3>
            <p className="text-sm text-brown-700 leading-relaxed">
              Click the "Seed all 9 scenarios" button above to add all beginner,
              intermediate, and advanced scenarios to your database. After
              seeding, you will see them on the /practice page. This is a
              one-time setup step.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="text-sm text-brown-700 leading-relaxed">
              After seeding, navigate to <strong>/practice</strong> to see all
              scenarios in your scenario browser. You can filter by difficulty
              and category.
            </p>
          </CardBody>
        </Card>
      </div>
    </main>
  )
}

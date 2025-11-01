/**
 * ScenarioResults Component
 *
 * Displays final score and feedback after completing a scenario
 * Shows breakdown of NVC components and learning insights
 */

import { EmpathyMeter } from './EmpathyMeter'
import { Card, CardBody } from '~/components/ui/Card'
import { Button } from '~/components/ui/Button'

interface ScenarioResultsProps {
  finalScore: number
  scenarioTitle: string
  messageCount: number
  onRetry: () => void
  onNext: () => void
  onViewTranscript: () => void
}

function getGrade(score: number): {
  label: string
  color: string
  emoji: string
} {
  if (score >= 90)
    return {
      label: 'Excellent',
      color: 'from-emerald-400 to-emerald-500',
      emoji: '🌟',
    }
  if (score >= 70)
    return {
      label: 'Good',
      color: 'from-giraffe-400 to-giraffe-500',
      emoji: '⭐',
    }
  if (score >= 50)
    return {
      label: 'Partial',
      color: 'from-yellow-400 to-orange-400',
      emoji: '🌱',
    }
  return {
    label: 'Needs Practice',
    color: 'from-red-400 to-orange-400',
    emoji: '💪',
  }
}

export function ScenarioResults({
  finalScore,
  scenarioTitle,
  messageCount,
  onRetry,
  onNext,
  onViewTranscript,
}: ScenarioResultsProps) {
  const grade = getGrade(finalScore)

  return (
    <div className="min-h-screen bg-gradient-to-b from-giraffe-50 to-cream p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="text-6xl">{grade.emoji}</div>
          <h1 className="text-4xl font-bold text-brown-800">
            Scenario Complete!
          </h1>
          <p className="text-lg text-brown-600">{scenarioTitle}</p>
        </div>

        {/* Score Card */}
        <Card className="overflow-hidden">
          <div className={`bg-gradient-to-r ${grade.color} text-white p-8`}>
            <div className="text-center">
              <p className="text-giraffe-50 text-sm font-semibold mb-2">
                FINAL SCORE
              </p>
              <h2 className="text-6xl font-bold mb-2">{finalScore}</h2>
              <p className="text-2xl font-bold text-white">{grade.label} NVC</p>
            </div>
          </div>

          <CardBody className="space-y-6">
            {/* Empathy Meter */}
            <div>
              <EmpathyMeter score={finalScore} showLabel={false} />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-giraffe-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-giraffe-700">
                  {messageCount}
                </div>
                <div className="text-sm text-giraffe-800 font-semibold mt-1">
                  Messages
                </div>
              </div>
              <div className="bg-giraffe-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-giraffe-700">
                  {Math.round((finalScore / 100) * 10)}
                </div>
                <div className="text-sm text-giraffe-800 font-semibold mt-1">
                  Components Mastered
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Feedback Box */}
        <Card className="bg-blue-50 border-2 border-blue-300">
          <CardBody className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <h3 className="font-bold text-blue-900 mb-2">Key Takeaway</h3>
                <p className="text-blue-800 text-sm leading-relaxed">
                  {finalScore >= 90
                    ? 'Excellent work! You demonstrated strong NVC skills. Your messages showed clear observations, feelings, needs, and requests. Keep practicing to maintain this level of empathetic communication.'
                    : finalScore >= 70
                      ? 'Great effort! You showed good NVC components in your communication. To improve further, focus on clearly connecting your feelings to universal needs and making specific, doable requests.'
                      : finalScore >= 50
                        ? 'Good try! You made some progress with NVC components. Next time, focus on expressing feelings and needs more explicitly, and avoid judgmental language. Every attempt builds your skills!'
                        : "Keep practicing! NVC takes time to learn. Focus on one component at a time: first observations, then feelings, then needs, then requests. You've got this!"}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Encouragement */}
        <Card className="bg-gradient-to-r from-giraffe-100 to-giraffe-50 border-2 border-giraffe-300">
          <CardBody>
            <div className="flex items-start gap-3">
              <div className="text-2xl">🦒</div>
              <p className="text-brown-800 text-sm leading-relaxed">
                Remember, practicing NVC is about growth, not perfection. Each
                conversation helps you develop greater empathy and
                understanding. You're building a valuable skill that will
                improve your real-world relationships.
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={onViewTranscript}
            className="flex-1"
          >
            📋 View Transcript
          </Button>
          <Button variant="secondary" onClick={onRetry} className="flex-1">
            🔄 Try Again
          </Button>
          <Button variant="primary" onClick={onNext} className="flex-1">
            ➜ Next Scenario
          </Button>
        </div>

        {/* Footer Stats */}
        <div className="text-center text-sm text-brown-600 space-y-1">
          <p>💪 Keep practicing to unlock more challenging scenarios</p>
          <p>🌟 Your progress is being tracked</p>
        </div>
      </div>
    </div>
  )
}

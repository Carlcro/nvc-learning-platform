/**
 * ScenarioResults Component
 *
 * Displays final score and feedback after completing a scenario
 * Shows breakdown of NVC components and learning insights
 */

import { useMemo } from 'react'
import { EmpathyMeter } from './EmpathyMeter'
import { Card, CardBody } from '~/components/ui/Card'
import { Button } from '~/components/ui/Button'

interface ScenarioResultsProps {
  finalScore: number
  stars: number
  scenarioTitle: string
  messageCount: number
  onRetry: () => void
  onNext: () => void
  onViewTranscript: () => void
}

const CONFETTI_COLORS = [
  'bg-giraffe-400',
  'bg-giraffe-500',
  'bg-emerald-400',
  'bg-emerald-300',
  'bg-orange-300',
]

/**
 * Lightweight CSS confetti burst. Pieces are generated once on mount and fall
 * with varied drift, rotation, and timing. Purely decorative and
 * non-interactive; disabled automatically under prefers-reduced-motion.
 */
function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        dx: `${Math.round((Math.random() - 0.5) * 120)}px`,
        rot: `${Math.round(Math.random() * 540 + 180)}deg`,
        dur: `${(Math.random() * 1 + 1.4).toFixed(2)}s`,
        delay: `${(Math.random() * 0.6).toFixed(2)}s`,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: Math.random() > 0.5 ? 'w-2 h-2' : 'w-1.5 h-3',
      })),
    [],
  )

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-40">
      {pieces.map((p) => (
        <span
          key={p.id}
          className={`absolute top-0 rounded-sm ${p.color} ${p.size} animate-confetti`}
          style={
            {
              left: `${p.left}%`,
              '--dx': p.dx,
              '--rot': p.rot,
              '--dur': p.dur,
              '--delay': p.delay,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

function StarsReveal({ stars }: { stars: number }) {
  return (
    <div className="flex justify-center gap-2 mt-4">
      {[0, 1, 2].map((i) => {
        const earned = i < stars
        return (
          <svg
            key={i}
            className={`w-10 h-10 animate-star-pop ${
              earned ? 'text-yellow-300' : 'text-white/30'
            }`}
            style={{ animationDelay: `${0.15 + i * 0.18}s` }}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.293 9.8c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        )
      })}
    </div>
  )
}

function getGrade(score: number): {
  label: string
  color: string
} {
  if (score >= 90)
    return {
      label: 'Excellent',
      color: 'from-emerald-400 to-emerald-500',
    }
  if (score >= 70)
    return {
      label: 'Good',
      color: 'from-giraffe-400 to-giraffe-500',
    }
  if (score >= 50)
    return {
      label: 'Partial',
      color: 'from-yellow-400 to-orange-400',
    }
  return {
    label: 'Needs Practice',
    color: 'from-red-400 to-orange-400',
  }
}

export function ScenarioResults({
  finalScore,
  stars,
  scenarioTitle,
  messageCount,
  onRetry,
  onNext,
  onViewTranscript,
}: ScenarioResultsProps) {
  const grade = getGrade(finalScore)

  return (
    <div className="min-h-screen bg-linear-to-b from-giraffe-50 to-cream p-6">
      {stars > 0 && <Confetti />}
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-brown-800">
            Scenario Complete!
          </h1>
          <p className="text-lg text-brown-600">{scenarioTitle}</p>
        </div>

        {/* Score Card */}
        <Card className="overflow-hidden">
          <div className={`bg-linear-to-r ${grade.color} text-white p-8`}>
            <div className="text-center">
              <p className="text-giraffe-50 text-sm font-semibold mb-2">
                FINAL SCORE
              </p>
              <h2 className="text-6xl font-bold mb-2">{finalScore}</h2>
              <p className="text-2xl font-bold text-white">{grade.label} NVC</p>
              <StarsReveal stars={stars} />
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
                  {stars}/3
                </div>
                <div className="text-sm text-giraffe-800 font-semibold mt-1">
                  Stars Earned
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Feedback Box */}
        <Card className="bg-blue-50 border-2 border-blue-300">
          <CardBody className="space-y-3">
            <div className="flex items-start gap-3">
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
        <Card className="bg-linear-to-r from-giraffe-100 to-giraffe-50 border-2 border-giraffe-300">
          <CardBody>
            <div className="flex items-start gap-3">
              <p className="text-brown-800 text-sm leading-relaxed">
                Remember, practicing NVC is about growth, not perfection. Each
                conversation helps you develop greater empathy and
                understanding. You're building a valuable skill that will
                improve your real-world relationships.
              </p>
              <img
                src="/giraff.png"
                alt="Giraffe Coach"
                className="w-24 h-24 object-contain flex-shrink-0"
              />
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
            View Transcript
          </Button>
          <Button variant="secondary" onClick={onRetry} className="flex-1">
            Try Again
          </Button>
          <Button variant="primary" onClick={onNext} className="flex-1">
            Next Scenario
          </Button>
        </div>
      </div>
    </div>
  )
}

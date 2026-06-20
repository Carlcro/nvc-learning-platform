import { useEffect, useState } from 'react'
import { Card, CardBody } from '~/components/ui/Card'

interface OverallScoreRingProps {
  score: number // 0-100
}

/**
 * The profile's emotional centerpiece — the EmpathyMeter rendered as a ring.
 * Color reflects how close the learner's communication is to giraffe (never an
 * arbitrary hue), and the label frames the score as a stage on a journey, never
 * a grade. The ring draws in on mount; reduced motion shows it filled at once.
 */
export function OverallScoreRing({ score }: OverallScoreRingProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)))

  // Animate the ring from empty to its value once, after mount.
  const [shown, setShown] = useState(0)
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(clamped))
    return () => cancelAnimationFrame(id)
  }, [clamped])

  const radius = 56
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - shown / 100)

  return (
    <Card className="overflow-hidden h-full">
      <div className="bg-giraffe-50 px-6 py-3 border-b border-giraffe-100">
        <h2 className="text-sm font-semibold text-brown-700">Overall empathy</h2>
      </div>

      <CardBody className="flex flex-col items-center justify-center text-center">
        <div className="relative w-40 h-40">
          <svg
            viewBox="0 0 140 140"
            className="w-full h-full -rotate-90"
            role="img"
            aria-label={`Overall empathy score: ${clamped} out of 100`}
          >
            {/* Track */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              strokeWidth="12"
              className="stroke-giraffe-100"
            />
            {/* Progress */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              strokeWidth="12"
              strokeLinecap="round"
              stroke="currentColor"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className={`${bandColor(clamped)} transition-[stroke-dashoffset] duration-1000 ease-out motion-reduce:transition-none`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-brown-800 leading-none">
              {clamped}
            </span>
            <span className="text-xs text-brown-600 mt-1">out of 100</span>
          </div>
        </div>

        <p className="mt-4 font-semibold text-brown-800">{bandLabel(clamped)}</p>
        <p className="text-xs text-brown-600 mt-0.5">
          Across observation, feeling, need &amp; request
        </p>
      </CardBody>
    </Card>
  )
}

// Band color as a text color so the ring stroke (currentColor) follows it.
// Mirrors the EmpathyMeter bands; coral signals "keep practicing", never alarm.
function bandColor(score: number): string {
  if (score >= 90) return 'text-empathy-high'
  if (score >= 70) return 'text-giraffe-400'
  if (score >= 50) return 'text-giraffe-300'
  return 'text-empathy-low'
}

function bandLabel(score: number): string {
  if (score >= 90) return 'Pure giraffe'
  if (score >= 70) return 'Mostly giraffe'
  if (score >= 50) return 'Mix of giraffe & jackal'
  return 'Keep practicing'
}

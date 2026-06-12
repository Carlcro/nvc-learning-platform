/**
 * EmpathyMeter Component
 *
 * Visual representation of NVC communication quality (0-100)
 * Uses color gradient from red (low) -> yellow (medium) -> green (high)
 */

interface EmpathyMeterProps {
  score: number // 0-100
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

function getScoreColor(score: number): string {
  if (score >= 90) return 'from-empathy-high to-empathy-high'
  if (score >= 70) return 'from-giraffe-300 to-giraffe-400'
  if (score >= 50) return 'from-giraffe-200 to-giraffe-300'
  if (score >= 30) return 'from-empathy-low/70 to-empathy-low'
  return 'from-empathy-low to-empathy-low'
}

function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 50) return 'Partial'
  return 'Needs Practice'
}

function getScoreDescription(score: number): string {
  if (score >= 90) return 'Pure giraffe language'
  if (score >= 70) return 'Minor improvements'
  if (score >= 50) return 'Mix of giraffe & jackal'
  return 'Mostly jackal language'
}

export function EmpathyMeter({
  score,
  showLabel = true,
  size = 'md',
}: EmpathyMeterProps) {
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  }

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  const clampedScore = Math.max(0, Math.min(100, Math.round(score)))

  return (
    <div className="space-y-2">
      {/* Score Label */}
      {showLabel && (
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-brown-800">Empathy Meter</h3>
          <div className="text-right">
            <div className={`font-bold text-brown-900 ${textSizes[size]}`}>
              {clampedScore}/100
            </div>
            <div
              className={`text-giraffe-700 font-semibold ${textSizes[size]}`}
            >
              {getScoreLabel(clampedScore)}
            </div>
          </div>
        </div>
      )}

      {/* Meter Bar */}
      <div
        className={`w-full bg-brown-200 rounded-full overflow-hidden ${sizeClasses[size]}`}
      >
        <div
          className={`h-full bg-linear-to-r ${getScoreColor(clampedScore)} transition-all duration-500 flex items-center justify-end pr-1`}
          style={{ width: `${clampedScore}%` }}
        >
          {clampedScore > 15 && size !== 'sm' && (
            <div className="text-brown-800 font-bold text-xs hidden sm:block">
              {clampedScore}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {showLabel && (
        <p className="text-xs text-brown-600">
          {getScoreDescription(clampedScore)}
        </p>
      )}
    </div>
  )
}

/**
 * MilestoneProgress Component
 *
 * Compact progress indicator showing conversation milestones
 * Uses horizontal layout with progress bar and small icons
 */

export interface Milestones {
  conversationStarted: boolean
  feelingExpressed: boolean
  needIdentified: boolean
  requestMade: boolean
  resolutionReached: boolean
  // Optional: conversations from before the empathy milestone lack it.
  empathyShown?: boolean
}

interface MilestoneProgressProps {
  milestones: Milestones
}

const milestoneConfig = [
  { key: 'conversationStarted' as const, label: 'Start', icon: '1' },
  { key: 'feelingExpressed' as const, label: 'Feeling', icon: 'F' },
  { key: 'needIdentified' as const, label: 'Need', icon: 'N' },
  { key: 'requestMade' as const, label: 'Request', icon: 'R' },
  { key: 'resolutionReached' as const, label: 'Done', icon: '*' },
]

export function MilestoneProgress({ milestones }: MilestoneProgressProps) {
  const completedCount = milestoneConfig.filter((m) => milestones[m.key]).length
  const progressPercentage = (completedCount / milestoneConfig.length) * 100

  return (
    <div className="bg-white rounded-xl p-3 border border-giraffe-200 shadow-sm">
      {/* Header with Progress */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-giraffe-800">Progress</span>
        <span className="text-xs font-medium text-giraffe-600">
          {completedCount}/{milestoneConfig.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 bg-giraffe-100 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-giraffe-400 to-empathy-high transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Milestone Icons Row */}
      <div className="flex justify-between">
        {milestoneConfig.map((milestone, idx) => {
          const isCompleted = milestones[milestone.key]
          const isNext =
            !isCompleted &&
            (idx === 0 || milestones[milestoneConfig[idx - 1].key])

          return (
            <div
              key={milestone.key}
              className="flex flex-col items-center gap-1"
              title={milestone.label}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-empathy-high text-brown-900'
                    : isNext
                      ? 'bg-giraffe-200 text-brown-800 ring-2 ring-giraffe-400'
                      : 'bg-giraffe-50 text-brown-400'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  milestone.icon
                )}
              </div>
              <span
                className={`text-[10px] ${
                  isCompleted
                    ? 'text-brown-700 font-medium'
                    : isNext
                      ? 'text-brown-700'
                      : 'text-brown-500'
                }`}
              >
                {milestone.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

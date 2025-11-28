interface ChallengeStatsProps {
  currentStreak: number
  longestStreak: number
  completedCount: number
  averageScore: number
  totalPoints: number
  level: number
}

export function ChallengeStats({
  currentStreak,
  longestStreak,
  completedCount,
  averageScore,
  totalPoints,
  level,
}: ChallengeStatsProps) {
  const showStreakFire = currentStreak >= 7

  return (
    <div className="bg-gradient-to-br from-giraffe-50 to-giraffe-100 border border-giraffe-200 rounded-lg p-6">
      <h3 className="text-lg font-bold text-brown-900 mb-4">Your Challenge Stats</h3>

      {/* Streak Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        {/* Current Streak */}
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-2xl">
              {showStreakFire ? '🔥' : '📅'}
            </span>
            <span className="text-3xl font-bold text-giraffe-600">
              {currentStreak}
            </span>
          </div>
          <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">
            Current Streak
          </p>
          {showStreakFire && (
            <p className="text-xs text-giraffe-600 font-semibold mt-1">
              Keep it up!
            </p>
          )}
        </div>

        {/* Longest Streak */}
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-brown-700 mb-1">
            {longestStreak}
          </div>
          <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">
            Best Streak
          </p>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-600 mb-1">
            {completedCount}
          </div>
          <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">
            Completed
          </p>
        </div>

        {/* Average Score */}
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {averageScore}%
          </div>
          <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">
            Avg Score
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-giraffe-200 my-4" />

      {/* Points and Level Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total Points */}
        <div className="bg-white rounded-lg p-4">
          <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
            Total Points
          </p>
          <p className="text-2xl font-bold text-giraffe-600">{totalPoints}</p>
        </div>

        {/* Level */}
        <div className="bg-white rounded-lg p-4">
          <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
            Level
          </p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-brown-800">{level}</span>
            <div className="flex items-center gap-1">
              {[...Array(Math.min(5, Math.ceil(level / 2)))].map((_, i) => (
                <span key={i} className="text-lg">

                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Milestone Celebrations */}
      {(currentStreak === 7 ||
        currentStreak === 30 ||
        currentStreak === 100) && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <p className="text-sm font-bold text-yellow-800">
            🏆 Milestone Achievement Unlocked!
          </p>
          <p className="text-xs text-yellow-700 mt-1">
            {currentStreak === 7 && 'You are on a 7-day streak!'}
            {currentStreak === 30 && 'You have maintained a 30-day streak!'}
            {currentStreak === 100 && 'You have an incredible 100-day streak!'}
          </p>
        </div>
      )}
    </div>
  )
}

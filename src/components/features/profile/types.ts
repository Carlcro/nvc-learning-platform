export interface UserStats {
  level: number
  totalPoints: number
  pointsToNextLevel: number
  scenariosCompleted: number
  scenariosMastered: number
  totalStars: number
  currentStreak: number
  longestStreak: number
  averageScores: {
    observation: number
    feeling: number
    need: number
    request: number
    overall: number
  }
}

export interface NVCScore {
  observation: number
  feeling: number
  need: number
  request: number
  total: number
}

export interface FeedbackData {
  score: NVCScore
  feedback: string
  whatWentWell: string
  giraffeAlternative: string
  isJackalLanguage: boolean
}

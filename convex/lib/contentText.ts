/**
 * The words of lessons and the feelings library that change with the
 * language. Structure, ids, answers and scores never change: a lesson's quiz
 * has the same questions in the same order, with the correct option in the
 * same place, in every language, so grading does not depend on the language.
 */

export interface LessonExampleText {
  title: string
  scenario: string
  giraffResponse: string
  jackalResponse: string
  explanation: string
}

export interface LessonQuestionText {
  question: string
  /** Same count and order as the English options. */
  options: Array<string>
  explanation: string
}

export interface LessonText {
  title: string
  description: string
  content: string
  /** Same count and order as the English examples. */
  examples: Array<LessonExampleText>
  /** Same count and order as the English questions. */
  questions: Array<LessonQuestionText>
}

/** Keyed by lessonId. */
export type LessonTranslationTable = Record<string, LessonText>

export interface FeelingText {
  /** The word as shown. The English word stays the stable key everywhere. */
  word: string
  definition: string
  examples: Array<string>
  synonyms: Array<string>
  relatedFeelings: Array<string>
}

export interface FeelingQuizText {
  sentence: string
  explanation: string
  correctFeelings?: Array<string>
}

export interface FeelingsTranslation {
  /** Keyed by the English feeling word. Families are feeling words too. */
  feelings: Partial<Record<string, FeelingText>>
  /** Keyed by the English quiz sentence. Same real-or-not answer. */
  quiz: Partial<Record<string, FeelingQuizText>>
}

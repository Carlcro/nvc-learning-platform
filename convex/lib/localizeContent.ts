import {
  FEELINGS_TRANSLATIONS,
  LESSON_TRANSLATIONS,
} from '../contentTranslations'
import { NEED_WORDS } from '../contentTranslations/needs'
import type { Locale } from './locale'
import type { LessonText } from './contentText'

/**
 * Lessons and feelings as they read in a language. Only words change: ids,
 * order, answers and families stay exactly as stored, and a translation that
 * does not line up with the English (a missing example, a question with a
 * different number of options) is ignored rather than shown half-matched.
 */

interface LessonShape {
  lessonId: string
  title: string
  description: string
  content: string
  examples: Array<{
    title: string
    scenario: string
    giraffResponse: string
    jackalResponse: string
    explanation: string
  }>
  quiz: {
    questions: Array<{
      question: string
      options: Array<string>
      correctAnswer: number
      explanation: string
    }>
    passingScore: number
  }
}

function lessonText(lessonId: string, locale: Locale): LessonText | undefined {
  if (locale === 'en') return undefined
  return LESSON_TRANSLATIONS[locale][lessonId]
}

/** True when a translation has the same examples, questions and options. */
export function lessonTextFits(lesson: LessonShape, text: LessonText): boolean {
  return (
    text.examples.length === lesson.examples.length &&
    text.questions.length === lesson.quiz.questions.length &&
    text.questions.every(
      (q, i) => q.options.length === lesson.quiz.questions[i].options.length,
    )
  )
}

export function localizeLesson<T extends LessonShape>(
  lesson: T,
  locale: Locale,
): T & { contentLocale: Locale } {
  const text = lessonText(lesson.lessonId, locale)
  if (!text || !lessonTextFits(lesson, text)) {
    return { ...lesson, contentLocale: 'en' }
  }
  return {
    ...lesson,
    title: text.title,
    description: text.description,
    content: text.content,
    examples: lesson.examples.map((example, i) => ({
      ...example,
      ...text.examples[i],
    })),
    quiz: {
      ...lesson.quiz,
      questions: lesson.quiz.questions.map((question, i) => ({
        ...question,
        question: text.questions[i].question,
        options: text.questions[i].options,
        explanation: text.questions[i].explanation,
      })),
    },
    contentLocale: locale,
  }
}

interface FeelingShape {
  word: string
  family: string
  definition: string
  examples: Array<string>
  synonyms: Array<string>
  relatedFeelings: Array<string>
}

/** The word for a feeling (or a family, which is a feeling word) in a language. */
export function feelingLabel(word: string, locale: Locale): string {
  if (locale === 'en') return word
  return FEELINGS_TRANSLATIONS[locale].feelings[word]?.word ?? word
}

/**
 * A feeling as it reads in `locale`. `word` stays the English word, which is
 * the key every saved library, check-in and quiz answer refers to; `label`
 * is what to show, and `familyLabel` names its family.
 */
export function localizeFeeling<T extends FeelingShape>(
  feeling: T,
  locale: Locale,
): T & { label: string; familyLabel: string } {
  const familyLabel = feelingLabel(feeling.family, locale)
  const text =
    locale === 'en'
      ? undefined
      : FEELINGS_TRANSLATIONS[locale].feelings[feeling.word]
  if (!text) return { ...feeling, label: feeling.word, familyLabel }
  return {
    ...feeling,
    label: text.word,
    definition: text.definition,
    examples: text.examples,
    synonyms: text.synonyms,
    relatedFeelings: text.relatedFeelings,
    familyLabel,
  }
}

interface QuizQuestionShape {
  sentence: string
  explanation: string
  correctFeelings?: Array<string>
}

/** A feelings quiz question in `locale`; the right answer never changes. */
export function localizeQuizQuestion<T extends QuizQuestionShape>(
  question: T,
  locale: Locale,
): T {
  if (locale === 'en') return question
  const text = FEELINGS_TRANSLATIONS[locale].quiz[question.sentence]
  if (!text) return question
  return {
    ...question,
    sentence: text.sentence,
    explanation: text.explanation,
    correctFeelings: text.correctFeelings ?? question.correctFeelings,
  }
}

/** A need word (from the weekly patterns) in `locale`. */
export function needLabel(need: string, locale: Locale): string {
  if (locale === 'en') return need
  return NEED_WORDS[locale][need] ?? need
}

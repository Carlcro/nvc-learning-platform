import { describe, expect, it } from 'vitest'
import {
  FEELINGS_TRANSLATIONS,
  LESSON_TRANSLATIONS,
} from '../contentTranslations'
import { NEED_WORDS } from '../contentTranslations/needs'
import { feelingsData, quizQuestionsData } from '../feelings/seed'
import { LESSONS } from '../lessons'
import { LOCALES } from './locale'
import {
  feelingLabel,
  lessonTextFits,
  localizeFeeling,
  localizeLesson,
  localizeQuizQuestion,
} from './localizeContent'
import type { Locale } from './locale'

const DASHES = /[–—]/
const OTHERS = LOCALES.filter((l): l is Exclude<Locale, 'en'> => l !== 'en')

for (const locale of OTHERS) {
  describe(`lessons in ${locale}`, () => {
    const table = LESSON_TRANSLATIONS[locale]

    it('covers every lesson with the same examples, questions and options', () => {
      expect(Object.keys(table).sort()).toEqual(
        LESSONS.map((l) => l.lessonId).sort(),
      )
      for (const lesson of LESSONS) {
        const text = table[lesson.lessonId]
        expect(text, lesson.lessonId).toBeDefined()
        if (text) expect(lessonTextFits(lesson, text), lesson.lessonId).toBe(true)
      }
    })

    it('is free of dashes', () => {
      expect(JSON.stringify(table)).not.toMatch(DASHES)
    })

    it('keeps the answer key: only words change', () => {
      for (const lesson of LESSONS) {
        const read = localizeLesson(lesson, locale)
        expect(read.contentLocale).toBe(locale)
        expect(read.quiz.questions.map((q) => q.correctAnswer)).toEqual(
          lesson.quiz.questions.map((q) => q.correctAnswer),
        )
        expect(read.quiz.passingScore).toBe(lesson.quiz.passingScore)
      }
    })
  })

  describe(`feelings in ${locale}`, () => {
    const { feelings, quiz } = FEELINGS_TRANSLATIONS[locale]

    it('covers every feeling and every quiz sentence', () => {
      expect(Object.keys(feelings).sort()).toEqual(
        feelingsData.map((f) => f.word).sort(),
      )
      expect(Object.keys(quiz).sort()).toEqual(
        quizQuestionsData.map((q) => q.sentence).sort(),
      )
    })

    it('gives every feeling its own word', () => {
      const words = Object.values(feelings).map((f) => f?.word.toLowerCase())
      expect(new Set(words).size).toBe(words.length)
    })

    it('fills every field, without dashes', () => {
      for (const text of Object.values(feelings)) {
        if (!text) continue
        expect(text.word.trim()).not.toBe('')
        expect(text.definition.trim()).not.toBe('')
        expect(text.examples.length).toBeGreaterThan(0)
      }
      for (const text of Object.values(quiz)) {
        if (!text) continue
        expect(text.sentence.trim()).not.toBe('')
        expect(text.explanation.trim()).not.toBe('')
      }
      expect(JSON.stringify({ feelings, quiz })).not.toMatch(DASHES)
    })

    it('names every need the weekly patterns can show', () => {
      for (const need of Object.keys(NEED_WORDS.fr)) {
        expect(NEED_WORDS[locale][need], need).toBeTruthy()
      }
    })
  })
}

describe('localizing a feeling', () => {
  const joyful = { ...feelingsData[0], family: 'joyful' }

  it('keeps the English word as the key and shows the label', () => {
    const fr = localizeFeeling(joyful, 'fr')
    expect(fr.word).toBe('joyful')
    expect(fr.label).not.toBe('joyful')
    expect(fr.familyLabel).toBe(feelingLabel('joyful', 'fr'))
    expect(fr.intensity).toBe(joyful.intensity)
  })

  it('leaves English as it is', () => {
    const en = localizeFeeling(joyful, 'en')
    expect(en.label).toBe('joyful')
    expect(en.familyLabel).toBe('joyful')
  })

  it('keeps the right answer of a quiz question', () => {
    const question = quizQuestionsData[0]
    const sv = localizeQuizQuestion(question, 'sv')
    expect(sv.sentence).not.toBe(question.sentence)
    expect(sv.isRealFeeling).toBe(question.isRealFeeling)
  })
})

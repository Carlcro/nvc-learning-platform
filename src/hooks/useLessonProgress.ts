/**
 * Lesson progress tracking.
 *
 * Signed-in users' progress lives in Convex (lessonProgress table) so it
 * follows the account across devices. localStorage remains as a fallback for
 * anyone browsing lessons signed out, and any local completions are synced up
 * to the account once on sign-in.
 */

import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from 'convex/_generated/api'

interface LessonProgress {
  lessonId: string
  completedAt: number // timestamp
  score: number // percentage, for signed-out display only
  // The chosen answers, kept so a completion earned while signed out can be
  // re-graded by the server on sign-in. The server never trusts `score`.
  answers?: Array<number | null>
}

const STORAGE_KEY = 'nvc_lesson_progress'

function readLocal(): Array<LessonProgress> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Failed to load lesson progress:', error)
    return []
  }
}

export function useLessonProgress() {
  const [localLessons, setLocalLessons] = useState<Array<LessonProgress>>([])
  const [isLoading, setIsLoading] = useState(true)

  const serverProgress = useQuery(api.lessons.getMyProgress)
  const submitQuizToServer = useMutation(api.lessons.submitQuiz)

  // Load local progress on mount
  useEffect(() => {
    setLocalLessons(readLocal())
    setIsLoading(false)
  }, [])

  // One-time sync: push completions done while signed out up to the account.
  const syncedRef = useRef(false)
  useEffect(() => {
    if (syncedRef.current) return
    if (!serverProgress) return // signed out or still loading

    const serverIds = new Set(serverProgress.map((p) => p.lessonId))
    const missing = readLocal().filter((l) => !serverIds.has(l.lessonId))
    syncedRef.current = true

    for (const lesson of missing) {
      // Without the stored answers there is nothing for the server to grade,
      // and a score from this browser is not something it should take.
      if (!lesson.answers) continue
      submitQuizToServer({
        lessonId: lesson.lessonId,
        answers: lesson.answers,
      }).catch((error) => console.error('Failed to sync lesson:', error))
    }
  }, [serverProgress, submitQuizToServer])

  const serverCompleted = (serverProgress ?? []).filter((p) => p.completed)

  const completedLessons: Array<LessonProgress> = serverProgress
    ? serverCompleted.map((p) => ({
        lessonId: p.lessonId,
        completedAt: p.completedAt ?? p._creationTime,
        score: p.score,
      }))
    : localLessons

  /**
   * Submit a passing quiz attempt. The server re-grades the answers and owns
   * the recorded result; localStorage keeps a copy so signed-out progress is
   * not lost and can be synced up later.
   */
  const submitQuiz = (
    lessonId: string,
    answers: Array<number | null>,
    localScore: number,
  ) => {
    try {
      const existing = readLocal()
      const index = existing.findIndex((l) => l.lessonId === lessonId)
      const updated =
        index >= 0
          ? existing.map((l, i) =>
              i === index
                ? { ...l, score: Math.max(l.score, localScore), answers }
                : l,
            )
          : [
              ...existing,
              { lessonId, completedAt: Date.now(), score: localScore, answers },
            ]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      setLocalLessons(updated)
    } catch (error) {
      console.error('Failed to save lesson progress:', error)
    }

    if (serverProgress !== null && serverProgress !== undefined) {
      submitQuizToServer({ lessonId, answers }).catch((error) =>
        console.error('Failed to save lesson progress:', error),
      )
    }
  }

  const isLessonCompleted = (lessonId: string): boolean => {
    return completedLessons.some((l) => l.lessonId === lessonId)
  }

  const getLessonCompletionDate = (lessonId: string): Date | null => {
    const completion = completedLessons.find((l) => l.lessonId === lessonId)
    return completion ? new Date(completion.completedAt) : null
  }

  const getProgressPercentage = (totalLessons: number): number => {
    if (totalLessons === 0) return 0
    return Math.round((completedLessons.length / totalLessons) * 100)
  }

  const getCompletedLessonIds = (): Array<string> => {
    return completedLessons.map((l) => l.lessonId)
  }

  return {
    completedLessons,
    isLoading: isLoading || serverProgress === undefined,
    submitQuiz,
    isLessonCompleted,
    getLessonCompletionDate,
    getProgressPercentage,
    getCompletedLessonIds,
  }
}

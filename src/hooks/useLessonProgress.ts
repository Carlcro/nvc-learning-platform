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
  score: number // percentage
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
  const recordCompletion = useMutation(api.lessons.recordCompletion)

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
      recordCompletion({
        lessonId: lesson.lessonId,
        score: lesson.score,
      }).catch((error) => console.error('Failed to sync lesson:', error))
    }
  }, [serverProgress, recordCompletion])

  const serverCompleted = (serverProgress ?? []).filter((p) => p.completed)

  const completedLessons: Array<LessonProgress> = serverProgress
    ? serverCompleted.map((p) => ({
        lessonId: p.lessonId,
        completedAt: p.completedAt ?? p._creationTime,
        score: p.score,
      }))
    : localLessons

  /**
   * Record a passing quiz result. Persists to the account when signed in,
   * and always to localStorage so signed-out progress is not lost.
   */
  const completeLesson = (lessonId: string, score: number) => {
    try {
      const existing = readLocal()
      const index = existing.findIndex((l) => l.lessonId === lessonId)
      const updated =
        index >= 0
          ? existing.map((l, i) =>
              i === index ? { ...l, score: Math.max(l.score, score) } : l,
            )
          : [...existing, { lessonId, completedAt: Date.now(), score }]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      setLocalLessons(updated)
    } catch (error) {
      console.error('Failed to save lesson progress:', error)
    }

    if (serverProgress !== null && serverProgress !== undefined) {
      recordCompletion({ lessonId, score }).catch((error) =>
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
    completeLesson,
    isLessonCompleted,
    getLessonCompletionDate,
    getProgressPercentage,
    getCompletedLessonIds,
  }
}

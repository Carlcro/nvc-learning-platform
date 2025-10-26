/**
 * Custom hook for managing lesson progress using localStorage
 * Allows users to track completed lessons without requiring login
 */

import { useEffect, useState } from 'react'

interface LessonProgress {
  lessonId: string
  completedAt: number // timestamp
  score: number // percentage
}

interface LessonProgressState {
  completedLessons: Array<LessonProgress>
  isLoading: boolean
}

const STORAGE_KEY = 'nvc_lesson_progress'

export function useLessonProgress() {
  const [state, setState] = useState<LessonProgressState>({
    completedLessons: [],
    isLoading: true,
  })

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const completedLessons = stored ? JSON.parse(stored) : []
      setState({
        completedLessons,
        isLoading: false,
      })
    } catch (error) {
      console.error('Failed to load lesson progress:', error)
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }))
    }
  }, [])

  /**
   * Mark a lesson as completed
   * Only saves if the score is 100% (all correct answers)
   */
  const completeLesson = (lessonId: string, score: number) => {
    try {
      setState((prev) => {
        // Check if lesson already completed
        const existingIndex = prev.completedLessons.findIndex(
          (l) => l.lessonId === lessonId,
        )

        let updatedLessons: Array<LessonProgress>

        if (existingIndex >= 0) {
          // Update existing completion (keep the original completion time)
          updatedLessons = [...prev.completedLessons]
          updatedLessons[existingIndex] = {
            ...updatedLessons[existingIndex],
            score,
          }
        } else {
          // Add new completion
          updatedLessons = [
            ...prev.completedLessons,
            {
              lessonId,
              completedAt: Date.now(),
              score,
            },
          ]
        }

        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLessons))

        return {
          ...prev,
          completedLessons: updatedLessons,
        }
      })
    } catch (error) {
      console.error('Failed to save lesson progress:', error)
    }
  }

  /**
   * Check if a specific lesson is completed
   */
  const isLessonCompleted = (lessonId: string): boolean => {
    return state.completedLessons.some((l) => l.lessonId === lessonId)
  }

  /**
   * Get the completion date for a lesson
   */
  const getLessonCompletionDate = (lessonId: string): Date | null => {
    const completion = state.completedLessons.find(
      (l) => l.lessonId === lessonId,
    )
    return completion ? new Date(completion.completedAt) : null
  }

  /**
   * Get progress as a percentage (completed lessons / total lessons)
   */
  const getProgressPercentage = (totalLessons: number): number => {
    if (totalLessons === 0) return 0
    return Math.round((state.completedLessons.length / totalLessons) * 100)
  }

  /**
   * Get all completed lesson IDs
   */
  const getCompletedLessonIds = (): Array<string> => {
    return state.completedLessons.map((l) => l.lessonId)
  }

  /**
   * Clear all progress (for testing or reset)
   */
  const clearProgress = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      setState({
        completedLessons: [],
        isLoading: false,
      })
    } catch (error) {
      console.error('Failed to clear lesson progress:', error)
    }
  }

  return {
    completedLessons: state.completedLessons,
    isLoading: state.isLoading,
    completeLesson,
    isLessonCompleted,
    getLessonCompletionDate,
    getProgressPercentage,
    getCompletedLessonIds,
    clearProgress,
  }
}

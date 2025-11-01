/**
 * Development Hook: useDevUser
 *
 * This hook manages the development user for testing without an auth system.
 * It automatically creates a dev user on first use and stores it in state.
 *
 * IMPORTANT: This is for development only. Remove when implementing real auth.
 */

import { useState, useEffect } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'

export function useDevUser() {
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getOrCreateDevUser = useMutation(api.devHelpers.getOrCreateDevUser)

  useEffect(() => {
    const initDevUser = async () => {
      try {
        const id = await getOrCreateDevUser()
        setUserId(id)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize dev user')
        console.error('Dev user initialization error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    initDevUser()
  }, [getOrCreateDevUser])

  return { userId, isLoading, error }
}

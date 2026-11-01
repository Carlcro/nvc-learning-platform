import { useEffect } from 'react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { useConvexAuth, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import {
  WELCOME_PATH,
  safeReturnPath,
  skipsOnboardingRedirect,
} from '~/lib/onboarding'

/**
 * Send a new account to the welcome tour once, wherever sign-up lands it
 * (email or GitHub), remembering where it was headed.
 */
export function OnboardingRedirect() {
  const { isAuthenticated } = useConvexAuth()
  const needsOnboarding = useQuery(
    api.users.needsOnboarding,
    isAuthenticated ? {} : 'skip',
  )
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (needsOnboarding !== true) return
    if (skipsOnboardingRedirect(pathname)) return
    navigate({
      to: WELCOME_PATH,
      search: { from: safeReturnPath(pathname) },
      replace: true,
    })
  }, [needsOnboarding, pathname, navigate])

  return null
}

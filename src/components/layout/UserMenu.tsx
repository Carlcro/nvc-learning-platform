import { useState } from 'react'
import { useAuthActions } from '@convex-dev/auth/react'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'

/**
 * User menu component that displays user info and logout button
 * Appears in the header for authenticated users
 * Uses giraffe colors and NVC-aligned, encouraging language
 */
export function UserMenu() {
  const { signOut } = useAuthActions()
  const userProfile = useQuery(api.users.getUserProfile)
  const [isOpen, setIsOpen] = useState(false)

  // Still loading user profile data
  if (userProfile === undefined) {
    return <div className="text-cream text-sm">Loading...</div>
  }

  // No user profile returned (shouldn't happen if authenticated)
  if (!userProfile?.user) {
    return null
  }

  const { user, profile } = userProfile

  return (
    <div className="relative z-20">
      {/* User Menu Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen)
        }}
        className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-giraffe-100 active:bg-giraffe-200 transition-colors text-cream cursor-pointer whitespace-nowrap"
        type="button"
      >
        <div className="text-right text-black">
          <div className="text-sm font-medium">{user.name || 'Learner'}</div>
          <div className="text-xs">Level {profile?.level || 1}</div>
        </div>
        <div className="w-8 h-8 rounded-full bg-giraffe-300 flex items-center justify-center text-sm font-bold text-brown-800 flex-shrink-0">
          {(user.name?.charAt(0) || 'L').toUpperCase()}
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div className="absolute right-0 mt-2 w-56 bg-cream rounded-lg shadow-lg border-2 border-giraffe-200 py-1 z-50">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-giraffe-200">
              <p className="text-sm font-medium text-brown-800">
                {user.name || 'Learner'}
              </p>
              <p className="text-xs text-brown-600">{user.email}</p>
            </div>

            {/* Stats Section */}
            <div className="px-4 py-3 border-b border-giraffe-200 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-brown-700 font-medium">
                  Your Level
                </span>
                <span className="text-sm font-bold text-giraffe-600">
                  {profile?.level || 1}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-brown-700 font-medium">
                  Total Points
                </span>
                <span className="text-sm font-bold text-giraffe-600">
                  {profile?.totalPoints || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-brown-700 font-medium">
                  Current Streak
                </span>
                <span className="text-sm font-bold text-giraffe-600">
                  {profile?.currentStreak || 0} days
                </span>
              </div>
            </div>

            {/* Sign Out Button - Encouraging language */}
            <button
              onClick={async () => {
                setIsOpen(false)
                await signOut()
              }}
              type="button"
              className="w-full px-4 py-3 text-left text-sm text-brown-700 hover:bg-giraffe-50 active:bg-giraffe-100 transition-colors font-medium border-t border-giraffe-200 cursor-pointer"
            >
              Log out
            </button>
          </div>

          {/* Close menu when clicking outside */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        </>
      )}
    </div>
  )
}

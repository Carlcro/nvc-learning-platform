import { Link, useLocation } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuthActions } from '@convex-dev/auth/react'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'

interface NavLink {
  to: string
  label: string
  icon: string
}

const navLinks: Array<NavLink> = [
  { to: '/', label: 'Home', icon: 'H' },
  { to: '/learn', label: 'Lessons', icon: 'L' },
  { to: '/practice', label: 'Practice', icon: 'P' },
  { to: '/progress', label: 'Progress', icon: 'G' },
  { to: '/profile', label: 'Profile', icon: 'U' },
]

/**
 * Floating navigation pill component
 * Displays at top center of screen with navigation links
 * Shows user menu on the right for authenticated users
 * Mobile-first responsive design
 */
export function FloatingNav() {
  const location = useLocation()
  const { signOut } = useAuthActions()
  const userProfile = useQuery(api.users.getUserProfile)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Determine if a route is active
  const isActive = (to: string): boolean => {
    if (to === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(to)
  }

  // Still loading user profile
  if (userProfile === undefined) {
    return null
  }

  const user = userProfile?.user
  const profile = userProfile?.profile

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <nav className="bg-white/80 backdrop-blur-md rounded-full border border-giraffe-200 shadow-lg px-2 py-2 flex items-center gap-1">
        {/* Brand/Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 rounded-full text-brown-700 font-bold text-sm hover:bg-giraffe-50 transition-colors whitespace-nowrap flex-shrink-0"
        >
          <span className="text-lg">G</span>
          <span className="hidden sm:inline">NVC Learn</span>
        </Link>

        {/* Divider */}
        <div className="h-6 w-px bg-giraffe-200 hidden sm:block" />

        {/* Navigation Links */}
        <div className="flex items-center gap-1 hidden sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`
                px-3 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap
                ${
                  isActive(link.to)
                    ? 'bg-giraffe-400 text-brown-700'
                    : 'text-slate-600 hover:bg-giraffe-50 hover:text-brown-700'
                }
              `}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Navigation Icons */}
        <div className="flex items-center gap-1 sm:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`
                w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-colors
                ${
                  isActive(link.to)
                    ? 'bg-giraffe-400 text-brown-700'
                    : 'text-slate-600 hover:bg-giraffe-50'
                }
              `}
            >
              {link.icon}
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-giraffe-200 ml-auto" />

        {/* User Menu */}
        {user ? (
          <div className="relative ml-2 flex-shrink-0">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-giraffe-50 transition-colors"
            >
              {/* Avatar */}
              <div className="w-7 h-7 rounded-full bg-giraffe-100 flex items-center justify-center text-xs font-bold text-brown-700 flex-shrink-0">
                {(user.name?.charAt(0) || 'L').toUpperCase()}
              </div>

              {/* User Info - Hidden on mobile */}
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-xs font-semibold text-brown-700 leading-tight">
                  {user.name || 'Learner'}
                </span>
                <span className="text-xs text-slate-600 leading-tight">
                  Level {profile?.level || 1}
                </span>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-giraffe-200 py-1 z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-giraffe-100">
                    <p className="text-sm font-medium text-brown-800">
                      {user.name || 'Learner'}
                    </p>
                    <p className="text-xs text-brown-600">{user.email}</p>
                  </div>

                  {/* Stats */}
                  <div className="px-4 py-3 border-b border-giraffe-100 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-brown-700 font-medium">Level</span>
                      <span className="text-giraffe-600 font-bold">
                        {profile?.level || 1}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-brown-700 font-medium">Points</span>
                      <span className="text-giraffe-600 font-bold">
                        {profile?.totalPoints || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-brown-700 font-medium">Streak</span>
                      <span className="text-giraffe-600 font-bold">
                        {profile?.currentStreak || 0}
                      </span>
                    </div>
                  </div>

                  {/* Sign Out */}
                  <button
                    onClick={async () => {
                      setIsMenuOpen(false)
                      await signOut()
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-brown-700 hover:bg-giraffe-50 transition-colors font-medium border-t border-giraffe-100"
                    type="button"
                  >
                    Log out
                  </button>
                </div>

                {/* Backdrop to close menu */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMenuOpen(false)}
                />
              </>
            )}
          </div>
        ) : null}
      </nav>
    </div>
  )
}

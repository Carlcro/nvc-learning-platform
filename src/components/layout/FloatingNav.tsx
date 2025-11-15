import { Link, useLocation } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useAuthActions } from '@convex-dev/auth/react'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

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

export function FloatingNav() {
  const location = useLocation()
  const { signOut } = useAuthActions()
  const userProfile = useQuery(api.users.getUserProfile)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Prevent scrollbar from disappearing when dropdown opens
  useEffect(() => {
    if (isDropdownOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isDropdownOpen])

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
    <div className="fixed top-6 right-6 z-50 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2">
      <nav className="bg-white/80 backdrop-blur-md rounded-full border border-giraffe-200 shadow-lg px-2 py-2 flex items-center gap-1 sm:gap-2">
        {/* Desktop Navigation Links */}
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

        {/* Mobile Burger Menu */}
        <div className="flex items-center sm:hidden relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex flex-col gap-1.5 p-2 hover:bg-giraffe-50 rounded-full transition-colors"
            aria-label="Toggle menu"
          >
            <span
              className={`block h-0.5 w-5 bg-brown-700 transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}
            />
            <span
              className={`block h-0.5 w-5 bg-brown-700 transition-all ${isMenuOpen ? 'opacity-0' : ''}`}
            />
            <span
              className={`block h-0.5 w-5 bg-brown-700 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}
            />
          </button>

          {/* Mobile Menu Dropdown */}
          {isMenuOpen && (
            <>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-giraffe-200 py-1 z-50">
                {/* Navigation Links */}
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    className={`
                      block px-4 py-2 text-sm font-medium transition-colors
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

              {/* Backdrop to close menu */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsMenuOpen(false)}
              />
            </>
          )}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-giraffe-200 ml-auto" />

        {/* User Menu - Radix UI Dropdown */}
        {user ? (
          <DropdownMenu.Root open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenu.Trigger asChild>
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-giraffe-50 transition-colors ml-2 flex-shrink-0"
                aria-label="User menu"
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
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="w-48 bg-white rounded-lg shadow-xl border border-giraffe-200 py-1 z-50"
                align="end"
                sideOffset={8}
              >
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
                <DropdownMenu.Item asChild>
                  <button
                    onClick={async () => {
                      await signOut()
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-brown-700 hover:bg-giraffe-50 active:bg-giraffe-100 transition-colors font-medium border-t border-giraffe-100 cursor-pointer"
                    type="button"
                  >
                    Log out
                  </button>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        ) : null}
      </nav>
    </div>
  )
}

import { Link, useLocation } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuthActions } from '@convex-dev/auth/react'
import { useConvexAuth, useQuery } from 'convex/react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { api } from '../../../convex/_generated/api'

interface NavLink {
  to: string
  label: string
  icon: string
  /** Hidden from signed-out visitors, who would only hit a redirect. */
  requiresAuth?: boolean
}

const navLinks: Array<NavLink> = [
  { to: '/', label: 'Home', icon: 'H' },
  { to: '/learn', label: 'Lessons', icon: 'L' },
  { to: '/practice', label: 'Practice', icon: 'P', requiresAuth: true },
  { to: '/challenges/daily', label: 'Daily', icon: 'D', requiresAuth: true },
  { to: '/feelings', label: 'Feelings', icon: 'F', requiresAuth: true },
  { to: '/profile', label: 'Profile', icon: 'U', requiresAuth: true },
]

export function FloatingNav() {
  const location = useLocation()
  const { isAuthenticated } = useConvexAuth()
  const { signOut } = useAuthActions()
  const userProfile = useQuery(api.users.getUserProfile)
  const isAdmin = useQuery(api.admin.amIAdmin)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // The nav renders for signed-out visitors too, since the lessons are open to
  // them. Without it they had no way out of a lesson page but the back button.
  const links = navLinks.filter((link) => isAuthenticated || !link.requiresAuth)

  // Determine if a route is active
  const isActive = (to: string): boolean => {
    if (to === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(to)
  }

  // Render the nav shell immediately (even while the profile query loads) so
  // navigation never pops in late on a hard load; the user chip appears once
  // the profile arrives.
  const user = userProfile?.user
  const profile = userProfile?.profile

  return (
    <div className="fixed top-6 right-6 z-50 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2">
      <nav className="bg-white/80 backdrop-blur-md rounded-full border border-giraffe-200 shadow-lg px-2 py-2 flex items-center gap-1 sm:gap-2">
        {/* Desktop Navigation Links */}
        <div className="flex items-center gap-1 hidden sm:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`
                px-3 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap
                ${
                  isActive(link.to)
                    ? 'bg-giraffe-400 text-brown-700'
                    : 'text-brown-400 hover:bg-giraffe-50 hover:text-brown-700'
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
            aria-expanded={isMenuOpen}
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
                {links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    className={`
                      block px-4 py-2 text-sm font-medium transition-colors
                      ${
                        isActive(link.to)
                          ? 'bg-giraffe-400 text-brown-700'
                          : 'text-brown-400 hover:bg-giraffe-50 hover:text-brown-700'
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
          <DropdownMenu.Root>
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
                  <span className="text-xs text-brown-400 leading-tight">
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

                {/* Admin panel, for the few accounts allowed to open it */}
                {isAdmin && (
                  <DropdownMenu.Item asChild>
                    <Link
                      to="/admin"
                      search={{ tab: undefined, days: undefined }}
                      className="block w-full px-4 py-2 text-left text-sm text-brown-700 hover:bg-giraffe-50 active:bg-giraffe-100 transition-colors font-medium cursor-pointer"
                    >
                      Admin
                    </Link>
                  </DropdownMenu.Item>
                )}

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
        ) : (
          <Link
            to="/auth"
            className="px-3 py-2 ml-2 rounded-full text-sm font-semibold bg-giraffe-400 text-brown-800 hover:bg-giraffe-500 transition-colors whitespace-nowrap shrink-0"
          >
            Sign in
          </Link>
        )}
      </nav>
    </div>
  )
}

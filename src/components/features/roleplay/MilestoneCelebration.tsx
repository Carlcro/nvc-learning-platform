/**
 * MilestoneCelebration Component
 *
 * A brief, non-blocking celebration that pops in when the user reaches a new
 * milestone in a roleplay conversation (naming a feeling, uncovering a need,
 * making a clear request, or reaching a breakthrough with the character).
 *
 * It auto-dismisses after a few seconds and respects reduced-motion.
 */

import { useEffect, useState } from 'react'

export interface Celebration {
  id: number
  title: string
  message: string
}

interface MilestoneCelebrationProps {
  celebration: Celebration | null
  onDismiss: () => void
}

function SparkIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  )
}

export function MilestoneCelebration({
  celebration,
  onDismiss,
}: MilestoneCelebrationProps) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (!celebration) return

    setLeaving(false)
    const leaveTimer = setTimeout(() => setLeaving(true), 2600)
    const dismissTimer = setTimeout(() => onDismiss(), 3000)

    return () => {
      clearTimeout(leaveTimer)
      clearTimeout(dismissTimer)
    }
  }, [celebration, onDismiss])

  if (!celebration) return null

  return (
    <div className="fixed top-24 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <div
        key={celebration.id}
        className={`pointer-events-auto flex items-center gap-3 rounded-full bg-white shadow-lg border-2 border-giraffe-300 pl-3 pr-5 py-2.5 ${
          leaving ? 'animate-celebrate-out' : 'animate-celebrate-in'
        }`}
      >
        <span className="flex-shrink-0 w-9 h-9 rounded-full bg-giraffe-400 text-brown-800 flex items-center justify-center">
          <SparkIcon />
        </span>
        <div className="text-left">
          <p className="text-sm font-bold text-brown-800 leading-tight">
            {celebration.title}
          </p>
          <p className="text-xs text-brown-600 leading-tight">
            {celebration.message}
          </p>
        </div>
      </div>
    </div>
  )
}

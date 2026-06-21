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
        role="status"
        aria-live="polite"
        className={`pointer-events-auto max-w-[calc(100vw-2rem)] rounded-full bg-white shadow-lg border-2 border-giraffe-300 px-5 py-2.5 text-center ${
          leaving ? 'animate-celebrate-out' : 'animate-celebrate-in'
        }`}
      >
        <p className="text-sm font-bold text-brown-800 leading-tight">
          {celebration.title}
        </p>
        <p className="text-xs text-brown-600 leading-tight">
          {celebration.message}
        </p>
      </div>
    </div>
  )
}

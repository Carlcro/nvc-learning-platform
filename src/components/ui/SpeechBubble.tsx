import React from 'react'

export interface SpeechBubbleProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  /** Which edge the tail points from. Defaults to the bottom. */
  tail?: 'bottom' | 'left' | 'right'
}

/**
 * The guide's speech bubble — a warm white card with a tail that shares the
 * bubble's border (a rotated square), so the outline stays continuous instead
 * of the borderless triangle the landing page used before.
 */
export function SpeechBubble({
  children,
  tail = 'bottom',
  className = '',
  ...props
}: SpeechBubbleProps) {
  const tailPosition = {
    bottom:
      'left-1/2 -bottom-2 -translate-x-1/2 border-b-2 border-r-2',
    left: 'top-1/2 -left-2 -translate-y-1/2 border-b-2 border-l-2',
    right: 'top-1/2 -right-2 -translate-y-1/2 border-t-2 border-r-2',
  }[tail]

  return (
    <div
      className={`relative bg-white rounded-2xl p-6 shadow-sm border-2 border-giraffe-200 ${className}`}
      {...props}
    >
      {children}
      <span
        aria-hidden="true"
        className={`absolute h-4 w-4 rotate-45 bg-white border-giraffe-200 ${tailPosition}`}
      />
    </div>
  )
}

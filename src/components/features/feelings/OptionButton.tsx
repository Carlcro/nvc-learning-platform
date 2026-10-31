import { focusRing } from './FeelingsPage'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface OptionButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  pressed: boolean
  children: ReactNode
}

/**
 * The one selectable control in the feelings area: a feeling word, a family,
 * a filter. It is a real toggle button, so keyboards and screen readers can
 * use it, and every page shows the chosen state the same way.
 */
export function OptionButton({
  pressed,
  className = '',
  children,
  ...props
}: OptionButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={`min-h-11 px-4 py-2 rounded-lg border-2 text-left font-medium transition-colors duration-150 cursor-pointer ${focusRing} ${
        pressed
          ? 'border-brown-700 bg-giraffe-100 text-brown-900'
          : 'border-giraffe-200 bg-white text-brown-800 hover:border-giraffe-400'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

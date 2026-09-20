import { Link } from '@tanstack/react-router'

interface BackButtonProps {
  to: string
  label?: string
  /** Query parameters for the destination, for example the tab to return to. */
  search?: Record<string, string>
}

export function BackButton({ to, label = 'Back', search }: BackButtonProps) {
  return (
    <Link
      to={to}
      search={search}
      className="inline-flex items-center gap-2 px-4 py-2 text-base font-medium text-giraffe-600 hover:bg-giraffe-100 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-giraffe-300 focus:ring-offset-2"
    >
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
          d="M15 19l-7-7 7-7"
        />
      </svg>
      {label}
    </Link>
  )
}

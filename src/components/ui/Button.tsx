import React from 'react'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
}

const variantStyles = {
  primary:
    'bg-giraffe-400 text-brown-800 hover:bg-giraffe-500 disabled:bg-giraffe-200 focus:ring-2 focus:ring-giraffe-300 focus:ring-offset-2 font-semibold shadow-sm',
  secondary:
    'bg-brown-600 text-cream hover:bg-brown-700 disabled:bg-brown-400 focus:ring-2 focus:ring-brown-500 focus:ring-offset-2 font-semibold shadow-sm',
  outline:
    'border-2 border-giraffe-400 text-brown-700 hover:bg-giraffe-50 disabled:border-giraffe-300 disabled:text-giraffe-700 focus:ring-2 focus:ring-giraffe-300 focus:ring-offset-2',
  ghost:
    'text-giraffe-600 hover:bg-giraffe-100 disabled:text-giraffe-200 focus:ring-2 focus:ring-giraffe-300 focus:ring-offset-2',
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center
        rounded-lg font-medium
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className || ''}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  )
}

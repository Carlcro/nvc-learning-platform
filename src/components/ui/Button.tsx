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
    'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  secondary:
    'bg-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-400 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
  outline:
    'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 disabled:border-blue-300 disabled:text-blue-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  ghost:
    'text-blue-600 hover:bg-blue-50 disabled:text-blue-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
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

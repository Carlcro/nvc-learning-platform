import React from 'react'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
  children: React.ReactNode
}

const variantStyles = {
  default:
    'bg-gray-100 text-gray-800 border border-gray-300',
  success:
    'bg-green-100 text-green-800 border border-green-300',
  warning:
    'bg-yellow-100 text-yellow-800 border border-yellow-300',
  error:
    'bg-red-100 text-red-800 border border-red-300',
  info:
    'bg-blue-100 text-blue-800 border border-blue-300',
}

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs font-medium',
  md: 'px-3 py-1 text-sm font-medium',
}

export function Badge({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center
        rounded-full
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className || ''}
      `}
      {...props}
    >
      {children}
    </span>
  )
}

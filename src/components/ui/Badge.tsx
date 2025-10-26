import React from 'react'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
  children: React.ReactNode
}

const variantStyles = {
  default:
    'bg-giraffe-100 text-brown-800 border border-giraffe-200',
  success:
    'bg-empathy-high/20 text-empathy-high border border-empathy-high/40',
  warning:
    'bg-giraffe-50 text-brown-700 border border-giraffe-200',
  error:
    'bg-empathy-low/20 text-empathy-low border border-empathy-low/40',
  info:
    'bg-giraffe-100 text-brown-800 border border-giraffe-200',
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

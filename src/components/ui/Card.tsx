import React from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hoverable?: boolean
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Card({
  children,
  hoverable = false,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-lg border-2 border-giraffe-100 shadow-sm
        ${hoverable ? 'hover:shadow-md hover:border-giraffe-200 transition-all duration-200' : ''}
        ${className || ''}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  children,
  className,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={`
        px-6 py-4 border-b border-giraffe-100 bg-giraffe-50
        ${className || ''}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardBody({
  children,
  className,
  ...props
}: CardBodyProps) {
  return (
    <div
      className={`
        px-6 py-4
        ${className || ''}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardFooter({
  children,
  className,
  ...props
}: CardFooterProps) {
  return (
    <div
      className={`
        px-6 py-4 border-t border-giraffe-100 bg-giraffe-50
        ${className || ''}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

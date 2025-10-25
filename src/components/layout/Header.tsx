import React, { type HTMLAttributes } from 'react'

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  sticky?: boolean
  sticky_class?: string
}

export interface HeaderNavProps extends HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

export interface HeaderBrandProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export interface HeaderMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Header({
  children,
  sticky = false,
  sticky_class,
  className,
  ...props
}: HeaderProps) {
  return (
    <header
      className={`
        w-full bg-white border-b border-gray-200 shadow-sm
        ${sticky ? 'sticky top-0 z-50' : ''}
        ${sticky_class || ''}
        ${className || ''}
      `}
      {...props}
    >
      {children}
    </header>
  )
}

export function HeaderNav({
  children,
  className,
  ...props
}: HeaderNavProps) {
  return (
    <nav
      className={`
        max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
        ${className || ''}
      `}
      {...props}
    >
      {children}
    </nav>
  )
}

export function HeaderBrand({
  children,
  className,
  ...props
}: HeaderBrandProps) {
  return (
    <div
      className={`
        flex items-center gap-2
        text-xl font-bold text-gray-900
        ${className || ''}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

export function HeaderMenu({
  children,
  className,
  ...props
}: HeaderMenuProps) {
  return (
    <div
      className={`
        flex items-center gap-4
        ${className || ''}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

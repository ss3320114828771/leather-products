'use client'

import { ReactNode } from 'react'
import Link from 'next/link'

interface CardProps {
  children: ReactNode
  className?: string
  href?: string
  onClick?: () => void
  padding?: 'none' | 'sm' | 'md' | 'lg'
  variant?: 'default' | 'glass' | 'outline' | 'gradient'
  hover?: boolean
}

export default function Card({
  children,
  className = '',
  href,
  onClick,
  padding = 'md',
  variant = 'glass',
  hover = true
}: CardProps) {
  const getVariantClasses = () => {
    switch(variant) {
      case 'glass':
        return 'bg-white/5 backdrop-blur-sm border border-white/10'
      case 'outline':
        return 'bg-transparent border border-white/10'
      case 'gradient':
        return 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20'
      default:
        return 'bg-white/5 border border-white/10'
    }
  }

  const getPaddingClasses = () => {
    switch(padding) {
      case 'none':
        return ''
      case 'sm':
        return 'p-3'
      case 'md':
        return 'p-4 md:p-6'
      case 'lg':
        return 'p-6 md:p-8'
      default:
        return 'p-4 md:p-6'
    }
  }

  const baseClasses = `
    rounded-xl transition-all duration-300
    ${getVariantClasses()}
    ${getPaddingClasses()}
    ${hover ? 'hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/50' : ''}
    ${onClick || href ? 'cursor-pointer' : ''}
    ${className}
  `

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {children}
      </Link>
    )
  }

  if (onClick) {
    return (
      <div onClick={onClick} className={baseClasses}>
        {children}
      </div>
    )
  }

  return (
    <div className={baseClasses}>
      {children}
    </div>
  )
}

// Card subcomponents for consistent structure
Card.Header = function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  )
}

Card.Body = function CardBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

Card.Footer = function CardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mt-4 pt-4 border-t border-white/10 ${className}`}>
      {children}
    </div>
  )
}

Card.Title = function CardTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={`text-lg font-bold text-purple-400 ${className}`}>
      {children}
    </h3>
  )
}
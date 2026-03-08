'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  fullWidth?: boolean
  loading?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const getVariantClasses = () => {
    switch(variant) {
      case 'primary':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/50 disabled:from-purple-500/50 disabled:to-pink-500/50'
      case 'secondary':
        return 'bg-white/10 text-white hover:bg-white/20 border border-white/10 disabled:bg-white/5'
      case 'outline':
        return 'bg-transparent text-white border border-white/20 hover:border-white/40 disabled:border-white/10'
      case 'ghost':
        return 'bg-transparent text-white hover:bg-white/5 disabled:hover:bg-transparent'
      case 'danger':
        return 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-lg hover:shadow-red-500/50 disabled:from-red-500/50 disabled:to-pink-500/50'
      default:
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
    }
  }

  const getSizeClasses = () => {
    switch(size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm rounded-lg'
      case 'md':
        return 'px-4 py-2 text-base rounded-xl'
      case 'lg':
        return 'px-6 py-3 text-lg rounded-xl'
      default:
        return 'px-4 py-2 text-base rounded-xl'
    }
  }

  const baseClasses = `
    inline-flex items-center justify-center gap-2 font-semibold
    transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
    ${getVariantClasses()}
    ${getSizeClasses()}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `

  const content = (
    <>
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {icon && iconPosition === 'left' && !loading && <span>{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && !loading && <span>{icon}</span>}
    </>
  )

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    )
  }

  return (
    <button
      className={baseClasses}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </button>
  )
}

// Button variants for quick access
export function PrimaryButton(props: ButtonProps) {
  return <Button variant="primary" {...props} />
}

export function SecondaryButton(props: ButtonProps) {
  return <Button variant="secondary" {...props} />
}

export function DangerButton(props: ButtonProps) {
  return <Button variant="danger" {...props} />
}
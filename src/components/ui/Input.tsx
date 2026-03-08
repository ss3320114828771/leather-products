'use client'

import { InputHTMLAttributes, forwardRef, useState } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  helper?: string
  containerClassName?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon,
  iconPosition = 'left',
  helper,
  containerClassName = '',
  className = '',
  type = 'text',
  disabled,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  const getInputClasses = () => {
    const baseClasses = 'w-full px-4 py-3 bg-white/5 border rounded-xl focus:outline-none transition text-white'
    const focusClasses = isFocused ? 'border-purple-500 ring-2 ring-purple-500/20' : ''
    const errorClasses = error ? 'border-red-500' : 'border-white/10'
    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : ''
    const iconPadding = icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''
    
    return `${baseClasses} ${focusClasses} ${errorClasses} ${disabledClasses} ${iconPadding} ${className}`
  }

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-400">
          {label}
        </label>
      )}

      <div className="relative">
        {icon && iconPosition === 'left' && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}

        <input
          ref={ref}
          type={inputType}
          className={getInputClasses()}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        )}

        {icon && iconPosition === 'right' && !isPassword && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-400 flex items-center gap-1">
          <span>⚠️</span>
          {error}
        </p>
      )}

      {helper && !error && (
        <p className="text-sm text-gray-500">{helper}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input

// Specialized input variants
export function SearchInput(props: InputProps) {
  return (
    <Input
      icon="🔍"
      placeholder="Search..."
      {...props}
    />
  )
}

export function EmailInput(props: InputProps) {
  return (
    <Input
      type="email"
      icon="📧"
      placeholder="sajid.syed@leather.com"
      {...props}
    />
  )
}

export function PasswordInput(props: InputProps) {
  return (
    <Input
      type="password"
      icon="🔒"
      placeholder="••••••••"
      {...props}
    />
  )
}
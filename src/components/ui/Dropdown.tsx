'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'

interface DropdownProps {
  trigger: ReactNode
  children: ReactNode
  position?: 'left' | 'right' | 'center'
  width?: 'auto' | 'sm' | 'md' | 'lg'
  className?: string
  closeOnClick?: boolean
}

export default function Dropdown({
  trigger,
  children,
  position = 'left',
  width = 'auto',
  className = '',
  closeOnClick = true
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getPositionClasses = () => {
    switch(position) {
      case 'left':
        return 'left-0'
      case 'right':
        return 'right-0'
      case 'center':
        return 'left-1/2 -translate-x-1/2'
      default:
        return 'left-0'
    }
  }

  const getWidthClasses = () => {
    switch(width) {
      case 'sm':
        return 'w-32'
      case 'md':
        return 'w-48'
      case 'lg':
        return 'w-64'
      default:
        return 'w-auto min-w-[160px]'
    }
  }

  const handleItemClick = () => {
    if (closeOnClick) {
      setIsOpen(false)
    }
  }

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {isOpen && (
        <div className={`
          absolute z-50 mt-2 ${getPositionClasses()} ${getWidthClasses()}
          bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl
          shadow-[0_10px_40px_rgba(0,0,0,0.5)]
          animate-in fade-in slide-in-from-top-2 duration-200
          ${className}
        `}>
          <div className="py-1" onClick={handleItemClick}>
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

// Dropdown items
export function DropdownItem({
  children,
  onClick,
  icon,
  disabled = false,
  className = ''
}: {
  children: ReactNode
  onClick?: () => void
  icon?: ReactNode
  disabled?: boolean
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center gap-2 w-full px-4 py-2 text-sm text-left
        hover:bg-white/5 transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        first:rounded-t-xl last:rounded-b-xl
        ${className}
      `}
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span className="flex-1">{children}</span>
    </button>
  )
}

// Dropdown divider
export function DropdownDivider() {
  return <div className="my-1 border-t border-white/10" />
}

// Dropdown header
export function DropdownHeader({ children }: { children: ReactNode }) {
  return (
    <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
      {children}
    </div>
  )
}
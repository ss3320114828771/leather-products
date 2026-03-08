'use client'

import { useState, useEffect } from 'react'

interface BismillahProps {
  showOnScroll?: boolean
  variant?: 'default' | 'simple' | 'elegant'
  className?: string
}

export default function Bismillah({ 
  showOnScroll = true, 
  variant = 'default',
  className = ''
}: BismillahProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!showOnScroll) return

    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsVisible(scrollPosition < 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [showOnScroll])

  const getVariantClasses = () => {
    switch(variant) {
      case 'simple':
        return 'text-emerald-400 text-lg md:text-xl font-arabic'
      case 'elegant':
        return 'text-3xl md:text-5xl font-arabic text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300'
      default:
        return 'text-2xl md:text-4xl font-arabic bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent'
    }
  }

  if (!isVisible) return null

  return (
    <div className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 pointer-events-none ${className}`}>
      <div className="container mx-auto px-4">
        <div className={`
          text-center py-3 md:py-4
          transform transition-all duration-500
          ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
        `}>
          <div className={`
            inline-block px-4 md:px-6 py-2 rounded-full
            bg-black/30 backdrop-blur-sm border border-emerald-500/20
            shadow-[0_0_30px_rgba(16,185,129,0.3)]
            hover:shadow-[0_0_50px_rgba(16,185,129,0.5)]
            transition-all duration-300
            ${getVariantClasses()}
          `}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
        </div>
      </div>
    </div>
  )
}

// Simple version for pages that don't need the full component
export function SimpleBismillah({ className = '' }: { className?: string }) {
  return (
    <div className={`text-center py-4 ${className}`}>
      <p className="text-emerald-400 text-xl md:text-2xl font-arabic">
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </p>
    </div>
  )
}
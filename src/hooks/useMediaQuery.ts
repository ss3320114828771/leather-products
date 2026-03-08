'use client'

import { useState, useEffect, useCallback } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    media.addEventListener('change', listener)
    
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}

// Common media query hooks
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 640px)')
}

export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 641px) and (max-width: 1024px)')
}

export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1025px)')
}

export function useIsDarkMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)')
}

export function useIsReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

// Orientation hooks
export function useIsPortrait(): boolean {
  return useMediaQuery('(orientation: portrait)')
}

export function useIsLandscape(): boolean {
  return useMediaQuery('(orientation: landscape)')
}

// Resolution hooks
export function useIsHighDPI(): boolean {
  return useMediaQuery('(min-resolution: 2dppx)')
}

// Breakpoint hooks
export function useBreakpoint() {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const isDesktop = useIsDesktop()

  return {
    isMobile,
    isTablet,
    isDesktop,
    breakpoint: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
  }
}

// Responsive value hook
export function useResponsiveValue<T>(values: {
  base?: T
  mobile?: T
  tablet?: T
  desktop?: T
  [key: string]: T | undefined
}): T | undefined {
  const { isMobile, isTablet, isDesktop } = useBreakpoint()

  if (isMobile && values.mobile !== undefined) return values.mobile
  if (isTablet && values.tablet !== undefined) return values.tablet
  if (isDesktop && values.desktop !== undefined) return values.desktop
  return values.base
}

// Viewport dimensions hook
export function useViewport() {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0
  })

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return dimensions
}

// Scroll position hook
export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState({
    x: 0,
    y: 0
  })

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition({
        x: window.scrollX,
        y: window.scrollY
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return scrollPosition
}

// Element visibility hook
export function useElementVisibility(
  elementRef: React.RefObject<HTMLElement>,
  options?: IntersectionObserverInit
) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!elementRef.current) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting)
    }, options)

    observer.observe(elementRef.current)

    return () => {
      observer.disconnect()
    }
  }, [elementRef, options])

  return isVisible
}

// Hover hook
export function useHover() {
  const [isHovered, setIsHovered] = useState(false)

  const hoverProps = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false)
  }

  return [isHovered, hoverProps] as const
}

// Focus hook
export function useFocus() {
  const [isFocused, setIsFocused] = useState(false)

  const focusProps = {
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false)
  }

  return [isFocused, focusProps] as const
}

// Active hook (for touch devices)
export function useActive() {
  const [isActive, setIsActive] = useState(false)

  const activeProps = {
    onTouchStart: () => setIsActive(true),
    onTouchEnd: () => setIsActive(false),
    onMouseDown: () => setIsActive(true),
    onMouseUp: () => setIsActive(false),
    onMouseLeave: () => setIsActive(false)
  }

  return [isActive, activeProps] as const
}
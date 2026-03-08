'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  navItems?: NavItem[]
  showAuth?: boolean
  showCart?: boolean
  position?: 'left' | 'right'
  variant?: 'default' | 'shop' | 'dashboard'
}

interface NavItem {
  name: string
  href: string
  icon: string
  badge?: number
}

export default function MobileMenu({
  isOpen,
  onClose,
  navItems = defaultNavItems,
  showAuth = true,
  showCart = true,
  position = 'right',
  variant = 'default'
}: MobileMenuProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()

  useEffect(() => {
    // Check login status
    setIsLoggedIn(false)
    // Get cart count
    setCartCount(3)
  }, [])

  useEffect(() => {
    // Close menu when route changes
    onClose()
  }, [pathname, onClose])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === href
    return pathname?.startsWith(href)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div 
        className={`
          fixed top-0 bottom-0 w-80 bg-black/95 backdrop-blur-xl border-r border-white/10
          transition-transform duration-300 ease-out
          ${position === 'left' ? 'left-0' : 'right-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <Link href="/" className="text-xl font-bold" onClick={onClose}>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Leather Store
              </span>
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-white/10">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 pl-10 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition text-white"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </form>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1 px-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                    ${isActive(item.href)
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/50'
                      : 'text-gray-300 hover:bg-white/5'
                    }
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="flex-1 font-medium">{item.name}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Cart Section */}
            {showCart && (
              <div className="mt-4 px-2">
                <div className="border-t border-white/10 pt-4">
                  <Link
                    href="/cart"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <span className="text-xl">🛒</span>
                    <span className="flex-1 font-medium">Shopping Cart</span>
                    {cartCount > 0 && (
                      <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            )}

            {/* Auth Section */}
            {showAuth && (
              <div className="mt-4 px-2">
                <div className="border-t border-white/10 pt-4">
                  {isLoggedIn ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-all"
                      >
                        <span className="text-xl">👤</span>
                        <span className="flex-1 font-medium">Dashboard</span>
                      </Link>
                      <button
                        onClick={() => {
                          // Handle logout
                          onClose()
                        }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all w-full mt-2"
                      >
                        <span className="text-xl">🚪</span>
                        <span className="flex-1 font-medium">Logout</span>
                      </button>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        href="/auth/login"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                      >
                        <span className="text-xl">🔐</span>
                        <span className="flex-1 font-medium">Login</span>
                      </Link>
                      <Link
                        href="/auth/register"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium"
                      >
                        <span className="text-xl">📝</span>
                        <span className="flex-1 font-medium">Sign Up</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <div className="text-center">
              <p className="text-xs text-gray-400">Admin: Hafiz Sajid Syed</p>
              <p className="text-xs text-purple-400">sajid.syed@leather.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Default navigation items
const defaultNavItems: NavItem[] = [
  { name: 'Home', href: '/', icon: '🏠' },
  { name: 'Products', href: '/products', icon: '🛍️' },
  { name: 'About', href: '/about', icon: '📖' },
  { name: 'Contact', href: '/contact', icon: '📞' },
  { name: 'Directions', href: '/directions', icon: '🗺️' }
]

// Usage example in a layout
export function LayoutWithMobileMenu() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold text-purple-400">
              Logo
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        position="right"
        variant="shop"
        showAuth={true}
        showCart={true}
      />

      <main className="pt-16">
        {/* Page content */}
      </main>
    </>
  )
}
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

interface HeaderProps {
  logoText?: string
  logoImage?: string
  navItems?: NavItem[]
  showCart?: boolean
  showAuth?: boolean
  onCartClick?: () => void
}

interface NavItem {
  name: string
  href: string
  icon?: string
}

export default function Header({
  logoText = 'Leather Store',
  logoImage,
  navItems = defaultNavItems,
  showCart = true,
  showAuth = true,
  onCartClick
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const pathname = usePathname()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Get cart count from localStorage or context
  useEffect(() => {
    const updateCartCount = () => {
      // This would come from your cart context/state
      setCartItemCount(3)
    }
    updateCartCount()
  }, [])

  // Check login status
  useEffect(() => {
    // This would check your auth state
    setIsLoggedIn(false)
  }, [])

  const isActive = (href: string) => {
    if (href === '/') return pathname === href
    return pathname?.startsWith(href)
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-black/90 backdrop-blur-xl py-2 shadow-[0_0_30px_rgba(168,85,247,0.3)]' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative group">
            {logoImage ? (
              <div className="relative h-10 w-32">
                <Image
                  src={logoImage}
                  alt={logoText}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:animate-glow">
                  {logoText}
                </span>
              </div>
            )}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-300"></div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 relative group ${
                  isActive(item.href)
                    ? 'text-purple-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {item.icon && <span>{item.icon}</span>}
                  {item.name}
                </span>
                {isActive(item.href) && (
                  <span className="absolute inset-0 bg-purple-500/20 rounded-xl border border-purple-500/50"></span>
                )}
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            {showCart && (
              <button
                onClick={onCartClick}
                className="relative p-2 text-gray-300 hover:text-white transition-colors group"
                aria-label="Cart"
              >
                <span className="text-2xl">🛒</span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs flex items-center justify-center animate-pulse">
                    {cartItemCount}
                  </span>
                )}
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </button>
            )}

            {/* Auth Buttons */}
            {showAuth && (
              <>
                {isLoggedIn ? (
                  <Link
                    href="/dashboard"
                    className="hidden md:flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-xl text-purple-400 hover:bg-purple-500/30 transition-all"
                  >
                    <span>👤</span>
                    <span>Dashboard</span>
                  </Link>
                ) : (
                  <div className="hidden md:flex items-center gap-2">
                    <Link
                      href="/auth/login"
                      className="px-4 py-2 text-gray-300 hover:text-white transition-colors relative group"
                    >
                      <span>Login</span>
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    </Link>
                    <Link
                      href="/auth/register"
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
              aria-label="Toggle menu"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 space-y-1.5">
                <span className={`block w-5 h-0.5 bg-white transition-transform duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}></span>
                <span className={`block w-5 h-0.5 bg-white transition-opacity duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}></span>
                <span className={`block w-5 h-0.5 bg-white transition-transform duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <MobileMenu 
          navItems={navItems}
          isLoggedIn={isLoggedIn}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      )}
    </header>
  )
}

// Mobile Menu Component (used by Header)
function MobileMenu({ 
  navItems, 
  isLoggedIn, 
  onClose 
}: { 
  navItems: NavItem[]
  isLoggedIn: boolean
  onClose: () => void
}) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === href
    return pathname?.startsWith(href)
  }

  return (
    <div className="md:hidden fixed inset-0 top-[72px] bg-black/95 backdrop-blur-xl z-40 animate-slideDown">
      <div className="container mx-auto px-4 py-6">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                isActive(item.href)
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/50'
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              {item.icon && <span className="text-xl">{item.icon}</span>}
              <span>{item.name}</span>
              {isActive(item.href) && (
                <span className="ml-auto w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"></span>
              )}
            </Link>
          ))}

          {/* Mobile Auth Links */}
          <div className="pt-4 mt-4 border-t border-white/10">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-500/20 text-purple-400 font-medium"
              >
                <span className="text-xl">👤</span>
                <span>Dashboard</span>
              </Link>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/auth/login"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 text-gray-300 font-medium hover:bg-white/10 transition-all"
                >
                  <span className="text-xl">🔐</span>
                  <span>Login</span>
                </Link>
                <Link
                  href="/auth/register"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium"
                >
                  <span className="text-xl">📝</span>
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>

          {/* Admin Info */}
          <div className="pt-4 mt-4 border-t border-white/10">
            <div className="px-4 py-3 bg-white/5 rounded-xl">
              <p className="text-xs text-gray-400">Admin</p>
              <p className="text-sm font-medium">Hafiz Sajid Syed</p>
              <p className="text-xs text-purple-400">sajid.syed@leather.com</p>
            </div>
          </div>
        </nav>
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
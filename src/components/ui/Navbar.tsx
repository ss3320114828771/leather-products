'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Directions', path: '/directions' },
    { name: 'Cart', path: '/cart' },
  ]

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${
      scrolled ? 'bg-black/80 backdrop-blur-xl py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="relative group">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent animate-glow">
              Leather E-Commerce
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-300"></div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 button-glow
                  ${pathname === item.path 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_30px_rgba(168,85,247,0.5)]' 
                    : 'glass-morphism hover:from-purple-500/50 hover:to-pink-500/50 hover:text-white'
                  }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Admin Link */}
            <Link
              href="/admin"
              className="px-4 py-2 rounded-xl font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 text-white button-glow"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative w-12 h-12 rounded-xl glass-morphism flex items-center justify-center group button-glow"
          >
            <div className="space-y-2">
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                isOpen ? 'rotate-45 translate-y-2.5' : ''
              }`}></span>
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                isOpen ? 'opacity-0' : ''
              }`}></span>
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                isOpen ? '-rotate-45 -translate-y-2.5' : ''
              }`}></span>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-300"></div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden fixed inset-x-4 top-20 transition-all duration-500 transform ${
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
        }`}>
          <div className="bg-black/95 backdrop-blur-xl rounded-2xl border border-white/20 p-4 shadow-[0_0_50px_rgba(168,85,247,0.3)]">
            <div className="space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-xl font-semibold transition-all duration-300
                    ${pathname === item.path
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-white/5 hover:bg-white/10'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{item.name}</span>
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"></div>
                  </div>
                </Link>
              ))}
              
              {/* Admin Link Mobile */}
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-xl font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
              >
                <div className="flex items-center justify-between">
                  <span>Admin Dashboard</span>
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
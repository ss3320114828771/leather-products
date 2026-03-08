'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  name: string
  href: string
  icon: string
}

export default function AdminNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems: NavItem[] = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Orders', href: '/admin/orders', icon: '📦' },
    { name: 'Products', href: '/admin/products', icon: '🛍️' },
    { name: 'Users', href: '/admin/users', icon: '👥' },
    { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
  ]

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/')
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-black/90 backdrop-blur-md border-r border-white/10">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 px-4 mb-5">
              <Link href="/admin" className="text-xl font-bold">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Admin Panel
                </span>
              </Link>
            </div>

            {/* Admin Profile */}
            <div className="px-4 mb-5">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <span className="text-lg">👑</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Hafiz Sajid</p>
                    <p className="text-xs text-gray-400 truncate">Super Admin</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="px-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                    isActive(item.href)
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="mr-3 text-xl">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Bottom Links */}
          <div className="flex-shrink-0 flex border-t border-white/10 p-4">
            <Link
              href="/"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-400 rounded-lg hover:bg-white/5 hover:text-white transition w-full"
            >
              <span className="mr-3 text-xl">🏠</span>
              Back to Site
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between h-16 px-4">
          <Link href="/admin" className="text-xl font-bold text-purple-400">
            Admin Panel
          </Link>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-white hover:text-purple-400 transition"
          >
            <span className="text-2xl">{isMobileMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-md pt-16">
          <div className="p-4">
            {/* Admin Profile */}
            <div className="bg-white/5 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <span className="text-xl">👑</span>
                </div>
                <div>
                  <p className="font-medium">Hafiz Sajid Syed</p>
                  <p className="text-sm text-gray-400">Super Administrator</p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 text-base font-medium rounded-lg transition ${
                    isActive(item.href)
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <span className="mr-3 text-xl">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
              
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-4 py-3 text-base font-medium text-gray-400 rounded-lg hover:bg-white/5 transition"
              >
                <span className="mr-3 text-xl">🏠</span>
                Back to Site
              </Link>
            </nav>

            {/* Logout Button */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false)
                alert('Logout clicked')
              }}
              className="w-full mt-6 px-4 py-3 bg-red-500/20 text-red-400 rounded-lg font-medium hover:bg-red-500/30 transition flex items-center justify-center gap-2"
            >
              <span>🚪</span>
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/10 z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.slice(0, 4).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center ${
                isActive(item.href) ? 'text-purple-400' : 'text-gray-400'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
          <Link
            href="/admin/settings"
            className={`flex flex-col items-center justify-center ${
              isActive('/admin/settings') ? 'text-purple-400' : 'text-gray-400'
            }`}
          >
            <span className="text-xl">⚙️</span>
            <span className="text-xs mt-1">More</span>
          </Link>
        </div>
      </div>
    </>
  )
}
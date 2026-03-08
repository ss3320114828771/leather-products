'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
  variant?: 'dashboard' | 'admin' | 'shop'
  position?: 'left' | 'right'
}

interface NavSection {
  title: string
  items: NavItem[]
}

interface NavItem {
  name: string
  href: string
  icon: string
  badge?: number
  disabled?: boolean
}

export default function Sidebar({ 
  isOpen = true, 
  onClose, 
  variant = 'dashboard',
  position = 'left'
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  const getNavSections = (): NavSection[] => {
    switch(variant) {
      case 'admin':
        return adminNavSections
      case 'shop':
        return shopNavSections
      default:
        return dashboardNavSections
    }
  }

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + '/')
  }

  if (!mounted) return null

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && onClose && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 bottom-0 z-50 flex flex-col bg-black/90 backdrop-blur-xl border-r border-white/10
          transition-all duration-300 ease-in-out
          ${position === 'left' ? 'left-0' : 'right-0'}
          ${isOpen ? 'translate-x-0' : position === 'left' ? '-translate-x-full' : 'translate-x-full'}
          ${isCollapsed ? 'w-20' : 'w-64'}
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
          {!isCollapsed ? (
            <Link href="/" className="text-xl font-bold">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {variant === 'admin' ? 'Admin Panel' : variant === 'shop' ? 'Leather Store' : 'Dashboard'}
              </span>
            </Link>
          ) : (
            <span className="text-2xl mx-auto">👜</span>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            aria-label={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* User Info */}
        <div className={`p-4 border-b border-white/10 ${isCollapsed ? 'text-center' : ''}`}>
          <div className={`flex ${isCollapsed ? 'flex-col' : 'items-center'} gap-3`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto">
              <span className="text-lg">👤</span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Hafiz Sajid</p>
                <p className="text-xs text-gray-400 truncate">Administrator</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {getNavSections().map((section, idx) => (
            <div key={idx} className="mb-6">
              {!isCollapsed && (
                <h3 className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.disabled ? '#' : item.href}
                    className={`
                      flex items-center gap-3 mx-2 px-3 py-2 rounded-lg transition-all
                      ${isCollapsed ? 'justify-center' : ''}
                      ${isActive(item.href)
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/50'
                        : 'text-gray-300 hover:bg-white/5'
                      }
                      ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    onClick={(e) => item.disabled && e.preventDefault()}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-sm font-medium">{item.name}</span>
                        {item.badge && (
                          <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                    {isCollapsed && item.badge && (
                      <span className="absolute top-0 right-0 w-4 h-4 bg-purple-500 rounded-full text-xs flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => {
              // Handle logout
            }}
            className={`
              flex items-center gap-3 w-full px-3 py-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <span className="text-xl">🚪</span>
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  )
}

// Navigation sections for different variants
const dashboardNavSections: NavSection[] = [
  {
    title: 'Main',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: '📊' },
      { name: 'Projects', href: '/dashboard/projects', icon: '📁', badge: 5 },
      { name: 'Tasks', href: '/dashboard/tasks', icon: '✅', badge: 12 }
    ]
  },
  {
    title: 'Management',
    items: [
      { name: 'Team', href: '/dashboard/team', icon: '👥' },
      { name: 'Calendar', href: '/dashboard/calendar', icon: '📅' },
      { name: 'Reports', href: '/dashboard/reports', icon: '📈' }
    ]
  },
  {
    title: 'Settings',
    items: [
      { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
      { name: 'Profile', href: '/dashboard/profile', icon: '👤' }
    ]
  }
]

const adminNavSections: NavSection[] = [
  {
    title: 'Main',
    items: [
      { name: 'Dashboard', href: '/admin', icon: '📊' },
      { name: 'Orders', href: '/admin/orders', icon: '📦', badge: 8 },
      { name: 'Products', href: '/admin/products', icon: '🛍️' },
      { name: 'Users', href: '/admin/users', icon: '👥' }
    ]
  },
  {
    title: 'Management',
    items: [
      { name: 'Categories', href: '/admin/categories', icon: '🏷️' },
      { name: 'Inventory', href: '/admin/inventory', icon: '📦' },
      { name: 'Discounts', href: '/admin/discounts', icon: '🏷️' }
    ]
  },
  {
    title: 'Settings',
    items: [
      { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
      { name: 'Analytics', href: '/admin/analytics', icon: '📊' }
    ]
  }
]

const shopNavSections: NavSection[] = [
  {
    title: 'Shop',
    items: [
      { name: 'Home', href: '/', icon: '🏠' },
      { name: 'Products', href: '/products', icon: '🛍️' },
      { name: 'Categories', href: '/categories', icon: '📑' },
      { name: 'Deals', href: '/deals', icon: '🏷️', badge: 3 }
    ]
  },
  {
    title: 'Account',
    items: [
      { name: 'Profile', href: '/profile', icon: '👤' },
      { name: 'Orders', href: '/orders', icon: '📦' },
      { name: 'Wishlist', href: '/wishlist', icon: '❤️', badge: 2 },
      { name: 'Cart', href: '/cart', icon: '🛒', badge: 3 }
    ]
  },
  {
    title: 'Support',
    items: [
      { name: 'Help', href: '/help', icon: '❓' },
      { name: 'Contact', href: '/contact', icon: '📞' }
    ]
  }
]
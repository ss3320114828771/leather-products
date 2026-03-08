import Link from 'next/link'
import { ReactNode } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-black">
      {/* Simple Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-black/90 backdrop-blur-md border-r border-white/10 hidden md:block">
        <div className="p-6">
          {/* Logo */}
          <Link href="/dashboard" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-8 inline-block">
            Leather Store
          </Link>

          {/* Admin Info */}
          <div className="flex items-center gap-3 mb-8 p-3 bg-white/5 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <span className="text-sm">👤</span>
            </div>
            <div>
              <p className="text-sm font-medium">Hafiz Sajid</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition"
            >
              <span>📊</span>
              <span>Dashboard</span>
            </Link>
            <Link 
              href="/dashboard/projects" 
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition"
            >
              <span>📁</span>
              <span>Projects</span>
            </Link>
            <Link 
              href="/dashboard/settings" 
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition"
            >
              <span>⚙️</span>
              <span>Settings</span>
            </Link>
          </nav>

          {/* Bottom Links */}
          <div className="absolute bottom-6 left-6 right-6">
            <Link 
              href="/" 
              className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition"
            >
              <span>🏠</span>
              <span>Back to Site</span>
            </Link>
            <button 
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition mt-2"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-md border-b border-white/10 z-50">
        <div className="flex justify-between items-center px-4 h-16">
          <Link href="/dashboard" className="text-xl font-bold text-purple-400">
            Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Hafiz Sajid</span>
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
              <span className="text-sm">👤</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/10 z-50">
        <div className="flex justify-around items-center h-16">
          <Link href="/dashboard" className="flex flex-col items-center text-gray-400 hover:text-purple-400">
            <span className="text-xl">📊</span>
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/dashboard/projects" className="flex flex-col items-center text-gray-400 hover:text-purple-400">
            <span className="text-xl">📁</span>
            <span className="text-xs">Projects</span>
          </Link>
          <Link href="/dashboard/settings" className="flex flex-col items-center text-gray-400 hover:text-purple-400">
            <span className="text-xl">⚙️</span>
            <span className="text-xs">Settings</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="md:pl-64 pt-16 md:pt-0 pb-16 md:pb-0 min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
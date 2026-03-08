'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15),transparent_50%)]"></div>
      </div>

      {/* Form */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Reset Password
            </span>
          </h1>
          <p className="text-gray-400">Enter your email to receive reset instructions</p>
        </div>

        <div className="glass-morphism rounded-2xl p-8">
          {isSubmitted ? (
            <div className="text-center">
              <div className="text-5xl mb-4">✉️</div>
              <h2 className="text-xl font-bold mb-2">Check Your Email</h2>
              <p className="text-gray-400 mb-6">
                We've sent password reset instructions to {email}
              </p>
              <Link
                href="/admin/login"
                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  placeholder="admin@leather.com"
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed button-glow"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  'Send Reset Instructions'
                )}
              </button>
            </form>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/admin/login"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
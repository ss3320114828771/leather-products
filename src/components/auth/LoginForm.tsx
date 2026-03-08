'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface LoginFormProps {
  redirectTo?: string
  onSuccess?: () => void
  showRegisterLink?: boolean
  showForgotPassword?: boolean
}

export default function LoginForm({ 
  redirectTo = '/dashboard',
  onSuccess,
  showRegisterLink = true,
  showForgotPassword = true
}: LoginFormProps) {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error when user types
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    try {
      // Call login API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          remember: formData.remember
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      // Success
      if (onSuccess) {
        onSuccess()
      } else {
        router.push(redirectTo)
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  // Demo credentials
  const fillDemoCredentials = () => {
    setFormData({
      email: 'sajid.syed@leather.com',
      password: 'admin123',
      remember: true
    })
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Form Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Welcome Back
          </span>
        </h2>
        <p className="text-gray-400">Sign in to your account</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-500 text-sm flex items-start gap-2">
          <span className="mt-0.5">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm text-gray-400 mb-2">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400">📧</span>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="sajid.syed@leather.com"
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 transition text-white"
              disabled={loading}
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm text-gray-400 mb-2">
            Password
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400">🔒</span>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 transition text-white"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-white transition"
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-gray-400">
            <input
              type="checkbox"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
              className="rounded border-white/10 bg-white/5 focus:ring-purple-500"
              disabled={loading}
            />
            <span>Remember me</span>
          </label>
          
          {showForgotPassword && (
            <Link 
              href="/auth/forgot-password" 
              className="text-sm text-purple-400 hover:text-purple-300 transition"
            >
              Forgot password?
            </Link>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>🔐</span>
              <span>Sign In</span>
            </>
          )}
        </button>
      </form>

      {/* Demo Credentials Button */}
      <button
        type="button"
        onClick={fillDemoCredentials}
        className="w-full mt-3 py-2 bg-white/5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition flex items-center justify-center gap-2"
      >
        <span>🔄</span>
        <span>Use Demo Credentials</span>
      </button>

      {/* Register Link */}
      {showRegisterLink && (
        <p className="text-center text-gray-400 text-sm mt-6">
          Don't have an account?{' '}
          <Link href="/auth/register" className="text-purple-400 hover:text-purple-300 transition font-medium">
            Sign up
          </Link>
        </p>
      )}

      {/* Admin Info */}
      <div className="mt-6 text-center text-xs text-gray-500">
        <p>Admin: Hafiz Sajid Syed</p>
        <p className="text-purple-400">sajid.syed@leather.com</p>
      </div>
    </div>
  )
}
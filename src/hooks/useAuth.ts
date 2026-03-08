'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'staff' | 'customer'
  avatar?: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
}

interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
    isAuthenticated: false
  })
  const router = useRouter()

  // Check auth status on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/session')
      const data = await response.json()

      if (data.authenticated) {
        setState({
          user: data.user,
          isLoading: false,
          error: null,
          isAuthenticated: true
        })
      } else {
        setState({
          user: null,
          isLoading: false,
          error: null,
          isAuthenticated: false
        })
      }
    } catch (error) {
      setState({
        user: null,
        isLoading: false,
        error: 'Failed to check authentication',
        isAuthenticated: false
      })
    }
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      setState({
        user: data.user,
        isLoading: false,
        error: null,
        isAuthenticated: true
      })

      router.push('/dashboard')
      router.refresh()
      
      return { success: true }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Login failed',
        isAuthenticated: false
      }))
      return { success: false, error: error.message }
    }
  }, [router])

  const register = useCallback(async (data: RegisterData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message || 'Registration failed')
      }

      setState({
        user: responseData.user,
        isLoading: false,
        error: null,
        isAuthenticated: true
      })

      router.push('/dashboard')
      router.refresh()
      
      return { success: true }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Registration failed',
        isAuthenticated: false
      }))
      return { success: false, error: error.message }
    }
  }, [router])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      })

      setState({
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false
      })

      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }, [router])

  const updateProfile = useCallback(async (data: Partial<User>) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // This would be your API call
      // const response = await fetch('/api/user/profile', {
      //   method: 'PUT',
      //   body: JSON.stringify(data),
      // })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...data } : null,
        isLoading: false
      }))

      return { success: true }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to update profile'
      }))
      return { success: false, error: error.message }
    }
  }, [])

  const hasRole = useCallback((roles: string | string[]) => {
    if (!state.user) return false
    
    const allowedRoles = Array.isArray(roles) ? roles : [roles]
    return allowedRoles.includes(state.user.role)
  }, [state.user])

  return {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    hasRole,
    checkAuth
  }
}

// Admin-only hook
export function useAdminAuth() {
  const auth = useAuth()
  
  return {
    ...auth,
    isAdmin: auth.user?.role === 'admin',
    requireAdmin: () => {
      if (!auth.isLoading && !auth.isAuthenticated) {
        window.location.href = '/auth/login'
      } else if (!auth.isLoading && auth.user?.role !== 'admin') {
        window.location.href = '/dashboard'
      }
    }
  }
}

// Protected route hook
export function useRequireAuth(redirectTo: string = '/auth/login') {
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.push(redirectTo)
    }
  }, [auth.isLoading, auth.isAuthenticated, redirectTo, router])

  return auth
}
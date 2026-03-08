import { NextRequest, NextResponse } from 'next/server'

// Types
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'staff' | 'customer'
  avatar?: string
}

// Constants
const SESSION_COOKIE = 'session'
const SESSION_DURATION = 7 * 24 * 60 * 60 // 7 days

// Simple in-memory user store
const users: User[] = [
  {
    id: '1',
    email: 'sajid.syed@leather.com',
    name: 'Hafiz Sajid Syed',
    role: 'admin'
  },
  {
    id: '2',
    email: 'john@example.com',
    name: 'John Smith',
    role: 'customer'
  }
]

// Simple password store
const passwords: Record<string, string> = {
  'sajid.syed@leather.com': 'admin123',
  'john@example.com': 'customer123'
}

// Create session - FIXED
export async function createSession(user: User): Promise<void> {
  const sessionData = JSON.stringify({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  })
  
  // This will be set via response cookie instead
  // Use setSessionCookie function instead
}

// Get session from request (for API routes) - FIXED
export async function getSessionFromRequest(request: NextRequest): Promise<User | null> {
  const session = request.cookies.get(SESSION_COOKIE)?.value
  if (!session) return null
  
  try {
    return JSON.parse(session) as User
  } catch {
    return null
  }
}

// Check if user is authenticated from request
export function isAuthenticatedFromRequest(request: NextRequest): boolean {
  const session = request.cookies.get(SESSION_COOKIE)?.value
  if (!session) return false
  
  try {
    const user = JSON.parse(session) as User
    return !!user
  } catch {
    return false
  }
}

// Check if user is admin from request
export function isAdminFromRequest(request: NextRequest): boolean {
  const session = request.cookies.get(SESSION_COOKIE)?.value
  if (!session) return false
  
  try {
    const user = JSON.parse(session) as User
    return user.role === 'admin'
  } catch {
    return false
  }
}

// Require authentication (for API routes) - FIXED
export function requireAuth(request: NextRequest): User | NextResponse {
  const session = request.cookies.get(SESSION_COOKIE)?.value
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  try {
    const user = JSON.parse(session) as User
    return user
  } catch {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
}

// Require admin (for API routes) - FIXED
export function requireAdmin(request: NextRequest): User | NextResponse {
  const session = request.cookies.get(SESSION_COOKIE)?.value
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  try {
    const user = JSON.parse(session) as User
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }
    return user
  } catch {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
}

// Set session cookie in response (for API routes) - FIXED
export function setSessionCookie(response: NextResponse, user: User): NextResponse {
  const sessionData = JSON.stringify({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  })
  
  response.cookies.set(SESSION_COOKIE, sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION,
    path: '/'
  })
  
  return response
}

// Clear session cookie in response - FIXED
export function clearSessionCookie(response: NextResponse): NextResponse {
  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/'
  })
  
  return response
}

// Login function - FIXED to work with response
export function login(email: string, password: string): User | null {
  const user = users.find(u => u.email === email)
  if (!user) return null
  
  // Simple password check
  if (passwords[email] !== password) return null
  
  return user
}

// Find user by email
export function findUserByEmail(email: string): User | undefined {
  return users.find(u => u.email === email)
}

// Find user by id
export function findUserById(id: string): User | undefined {
  return users.find(u => u.id === id)
}

// Create user
export function createUser(userData: Omit<User, 'id'>, password: string): User {
  const newUser = {
    ...userData,
    id: (users.length + 1).toString()
  }
  
  users.push(newUser)
  passwords[userData.email] = password
  
  return newUser
}
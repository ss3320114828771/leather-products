import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory user store (replace with database in production)
const users = [
  {
    id: '1',
    email: 'sajid.syed@leather.com',
    password: 'admin123', // In production, use hashed passwords
    name: 'Hafiz Sajid Syed',
    role: 'admin'
  },
  {
    id: '2',
    email: 'john@example.com',
    password: 'customer123',
    name: 'John Smith',
    role: 'customer'
  }
]

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    const { email, password, remember } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email and password are required' 
        },
        { status: 400 }
      )
    }

    // Find user (simplified - in production, check hashed password)
    const user = users.find(u => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid email or password' 
        },
        { status: 401 }
      )
    }

    // Set session cookie
    const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 // 30 days or 1 day
    
    // Create response first
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    })

    // Set cookies on the response
    response.cookies.set('session', JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAge,
      path: '/',
    })

    // Set a non-httpOnly cookie for client-side auth check
    response.cookies.set('isAuthenticated', 'true', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAge,
      path: '/',
    })

    // Return the response with cookies
    return response

  } catch (error) {
    console.error('Login error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  })
}
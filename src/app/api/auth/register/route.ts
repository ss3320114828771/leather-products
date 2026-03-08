import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory user store (replace with database in production)
let users = [
  {
    id: '1',
    email: 'sajid.syed@leather.com',
    password: 'admin123', // In production, use hashed passwords
    name: 'Hafiz Sajid Syed',
    role: 'admin',
    createdAt: new Date().toISOString()
  }
]

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    const { name, email, password, confirmPassword } = body

    // Validate input
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'All fields are required' 
        },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid email format' 
        },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      )
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Passwords do not match' 
        },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      )
    }

    // Check password strength
    if (password.length < 6) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Password must be at least 6 characters long' 
        },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      )
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'User with this email already exists' 
        },
        { 
          status: 409, // Conflict
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      )
    }

    // Create new user (in production, hash the password)
    const newUser = {
      id: (users.length + 1).toString(),
      name,
      email: email.toLowerCase(),
      password, // In production: await bcrypt.hash(password, 10)
      role: 'customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Add to users array (in production, save to database)
    users.push(newUser)

    // Don't send password back in response
    const { password: _, ...userWithoutPassword } = newUser

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: userWithoutPassword
    }, {
      status: 201, // Created
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })

    // Automatically log in the user after registration
    const maxAge = 60 * 60 * 24 // 1 day
    
    response.cookies.set('session', JSON.stringify({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAge,
      path: '/',
    })

    response.cookies.set('isAuthenticated', 'true', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAge,
      path: '/',
    })

    return response

  } catch (error) {
    console.error('Registration error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    )
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}
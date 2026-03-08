import { NextRequest, NextResponse } from 'next/server'

// Types
interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'staff' | 'customer'
  status: 'active' | 'inactive' | 'pending'
  avatar?: string
  orders: number
  spent: number
  createdAt: string
  lastActive: string
  phone?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
}

// Mock users database (replace with real database in production)
const users: User[] = [
  {
    id: 'USR-001',
    name: 'Hafiz Sajid Syed',
    email: 'sajid.syed@leather.com',
    role: 'admin',
    status: 'active',
    orders: 156,
    spent: 12499.99,
    createdAt: '2020-01-15T10:30:00Z',
    lastActive: '2024-02-20T14:30:00Z',
    phone: '+1 (234) 567-890',
    address: {
      street: '123 Admin St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    }
  },
  {
    id: 'USR-002',
    name: 'John Smith',
    email: 'john.smith@email.com',
    role: 'customer',
    status: 'active',
    orders: 23,
    spent: 3299.99,
    createdAt: '2023-03-20T09:15:00Z',
    lastActive: '2024-02-19T16:45:00Z',
    phone: '+1 (234) 567-891',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA'
    }
  },
  {
    id: 'USR-003',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    role: 'customer',
    status: 'active',
    orders: 45,
    spent: 5899.99,
    createdAt: '2022-11-10T11:20:00Z',
    lastActive: '2024-02-18T09:30:00Z',
    phone: '+1 (234) 567-892'
  },
  {
    id: 'USR-004',
    name: 'Mike Chen',
    email: 'mike.chen@email.com',
    role: 'staff',
    status: 'active',
    orders: 0,
    spent: 0,
    createdAt: '2024-01-05T13:45:00Z',
    lastActive: '2024-02-19T10:15:00Z',
    phone: '+1 (234) 567-893'
  },
  {
    id: 'USR-005',
    name: 'Emma Wilson',
    email: 'emma.w@email.com',
    role: 'customer',
    status: 'inactive',
    orders: 8,
    spent: 1299.99,
    createdAt: '2023-08-12T15:30:00Z',
    lastActive: '2024-01-15T11:20:00Z',
    phone: '+1 (234) 567-894'
  },
  {
    id: 'USR-006',
    name: 'David Brown',
    email: 'david.b@email.com',
    role: 'customer',
    status: 'active',
    orders: 34,
    spent: 4599.99,
    createdAt: '2022-05-18T08:00:00Z',
    lastActive: '2024-02-17T14:10:00Z',
    phone: '+1 (234) 567-895'
  },
  {
    id: 'USR-007',
    name: 'Lisa Garcia',
    email: 'lisa.g@email.com',
    role: 'staff',
    status: 'pending',
    orders: 0,
    spent: 0,
    createdAt: '2024-02-01T10:00:00Z',
    lastActive: '2024-02-19T09:45:00Z',
    phone: '+1 (234) 567-896'
  },
  {
    id: 'USR-008',
    name: 'James Lee',
    email: 'james.lee@email.com',
    role: 'customer',
    status: 'active',
    orders: 67,
    spent: 8999.99,
    createdAt: '2021-09-22T12:30:00Z',
    lastActive: '2024-02-18T15:20:00Z',
    phone: '+1 (234) 567-897'
  }
]

// Helper function to get paginated users
function getPaginatedUsers(
  page: number = 1,
  limit: number = 10,
  role?: string,
  status?: string,
  search?: string
): { users: User[]; total: number; pages: number } {
  let filteredUsers = [...users]

  // Filter by role
  if (role && role !== 'all') {
    filteredUsers = filteredUsers.filter(u => u.role === role)
  }

  // Filter by status
  if (status && status !== 'all') {
    filteredUsers = filteredUsers.filter(u => u.status === status)
  }

  // Filter by search (name, email, or ID)
  if (search) {
    const searchLower = search.toLowerCase()
    filteredUsers = filteredUsers.filter(
      u => 
        u.name.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower) ||
        u.id.toLowerCase().includes(searchLower)
    )
  }

  // Sort by creation date (newest first)
  filteredUsers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const total = filteredUsers.length
  const pages = Math.ceil(total / limit)
  const start = (page - 1) * limit
  const paginatedUsers = filteredUsers.slice(start, start + limit)

  return { users: paginatedUsers, total, pages }
}

// GET /api/users - Get all users with pagination, filtering, search
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const role = searchParams.get('role') || undefined
    const status = searchParams.get('status') || undefined
    const search = searchParams.get('search') || undefined

    // Validate pagination
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid pagination parameters' 
        },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      )
    }

    // Check authentication and authorization (admin only)
    const session = request.cookies.get('session')
    if (!session) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Unauthorized' 
        },
        { 
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      )
    }

    // Validate user is admin
    try {
      const userData = JSON.parse(session.value)
      if (userData.role !== 'admin') {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Forbidden - Admin access required' 
          },
          { status: 403 }
        )
      }
    } catch {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid session' 
        },
        { status: 401 }
      )
    }

    const { users: paginatedUsers, total, pages } = getPaginatedUsers(page, limit, role, status, search)

    // Calculate summary statistics
    const totalUsers = users.length
    const activeUsers = users.filter(u => u.status === 'active').length
    const inactiveUsers = users.filter(u => u.status === 'inactive').length
    const pendingUsers = users.filter(u => u.status === 'pending').length
    const adminCount = users.filter(u => u.role === 'admin').length
    const staffCount = users.filter(u => u.role === 'staff').length
    const customerCount = users.filter(u => u.role === 'customer').length
    const totalRevenue = users.reduce((sum, u) => sum + u.spent, 0)

    return NextResponse.json({
      success: true,
      users: paginatedUsers,
      pagination: {
        page,
        limit,
        total,
        pages,
        hasNext: page < pages,
        hasPrev: page > 1
      },
      summary: {
        totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        pending: pendingUsers,
        roles: {
          admin: adminCount,
          staff: staffCount,
          customer: customerCount
        },
        totalRevenue: totalRevenue.toFixed(2)
      }
    }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })

  } catch (error) {
    console.error('Users GET error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    )
  }
}

// POST /api/users - Create new user (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, 
      email, 
      role = 'customer', 
      status = 'pending',
      phone,
      address
    } = body

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Name and email are required' 
        },
        { status: 400 }
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
        { status: 400 }
      )
    }

    // Check authentication and authorization (admin only)
    const session = request.cookies.get('session')
    if (!session) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Unauthorized' 
        },
        { status: 401 }
      )
    }

    // Validate user is admin
    try {
      const userData = JSON.parse(session.value)
      if (userData.role !== 'admin') {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Forbidden - Admin access required' 
          },
          { status: 403 }
        )
      }
    } catch {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid session' 
        },
        { status: 401 }
      )
    }

    // Check if email already exists
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'User with this email already exists' 
        },
        { status: 409 }
      )
    }

    // Create new user
    const newUser: User = {
      id: `USR-${String(users.length + 1).padStart(3, '0')}`,
      name,
      email: email.toLowerCase(),
      role: role as 'admin' | 'staff' | 'customer',
      status: status as 'active' | 'inactive' | 'pending',
      orders: 0,
      spent: 0,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      phone,
      address
    }

    // Add to users array (in production, save to database)
    users.push(newUser)

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: newUser
    }, {
      status: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })

  } catch (error) {
    console.error('Users POST error:', error)
    
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
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}
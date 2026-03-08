import { NextRequest, NextResponse } from 'next/server'

// Types
interface OrderItem {
  id: number
  productId: number
  name: string
  price: number
  quantity: number
  image: string
}

interface Order {
  id: string
  userId: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  subtotal: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentMethod: string
  createdAt: string
}

// Mock orders database (replace with real database in production)
const orders: Order[] = [
  {
    id: 'ORD-001',
    userId: '1',
    customerName: 'Hafiz Sajid Syed',
    customerEmail: 'sajid.syed@leather.com',
    items: [
      {
        id: 1,
        productId: 1,
        name: 'Premium Leather Bag',
        price: 299.99,
        quantity: 1,
        image: '/n1.jpeg'
      },
      {
        id: 2,
        productId: 2,
        name: 'Classic Leather Wallet',
        price: 89.99,
        quantity: 2,
        image: '/n2.jpeg'
      }
    ],
    subtotal: 479.97,
    total: 528.37,
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'ORD-002',
    userId: '2',
    customerName: 'John Smith',
    customerEmail: 'john.smith@email.com',
    items: [
      {
        id: 3,
        productId: 3,
        name: 'Handcrafted Leather Belt',
        price: 79.99,
        quantity: 1,
        image: '/n3.jpeg'
      }
    ],
    subtotal: 79.99,
    total: 91.39,
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'online',
    createdAt: '2024-01-14T15:45:00Z'
  },
  {
    id: 'ORD-003',
    userId: '3',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@email.com',
    items: [
      {
        id: 4,
        productId: 4,
        name: 'Leather Card Holder',
        price: 49.99,
        quantity: 3,
        image: '/n4.jpeg'
      }
    ],
    subtotal: 149.97,
    total: 161.97,
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    createdAt: '2024-01-13T09:20:00Z'
  },
  {
    id: 'ORD-004',
    userId: '4',
    customerName: 'Mike Chen',
    customerEmail: 'mike.chen@email.com',
    items: [
      {
        id: 5,
        productId: 5,
        name: 'Messenger Leather Bag',
        price: 349.99,
        quantity: 1,
        image: '/n5.jpeg'
      }
    ],
    subtotal: 349.99,
    total: 377.99,
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'cash_on_delivery',
    createdAt: '2024-01-12T14:10:00Z'
  },
  {
    id: 'ORD-005',
    userId: '5',
    customerName: 'Emma Wilson',
    customerEmail: 'emma.w@email.com',
    items: [
      {
        id: 6,
        productId: 6,
        name: 'Leather Keychain',
        price: 29.99,
        quantity: 2,
        image: '/n6.jpeg'
      }
    ],
    subtotal: 59.98,
    total: 64.78,
    status: 'cancelled',
    paymentStatus: 'refunded',
    paymentMethod: 'online',
    createdAt: '2024-01-11T11:30:00Z'
  }
]

// Helper function to get paginated orders
function getPaginatedOrders(
  page: number = 1,
  limit: number = 10,
  status?: string,
  search?: string
): { orders: Order[]; total: number; pages: number } {
  let filteredOrders = [...orders]

  // Filter by status
  if (status && status !== 'all') {
    filteredOrders = filteredOrders.filter(order => order.status === status)
  }

  // Filter by search (customer name or email)
  if (search) {
    const searchLower = search.toLowerCase()
    filteredOrders = filteredOrders.filter(
      order => 
        order.customerName.toLowerCase().includes(searchLower) ||
        order.customerEmail.toLowerCase().includes(searchLower) ||
        order.id.toLowerCase().includes(searchLower)
    )
  }

  // Sort by date (newest first)
  filteredOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const total = filteredOrders.length
  const pages = Math.ceil(total / limit)
  const start = (page - 1) * limit
  const paginatedOrders = filteredOrders.slice(start, start + limit)

  return { orders: paginatedOrders, total, pages }
}

// GET /api/orders - Get all orders (with pagination, filtering, search)
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
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
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      )
    }

    // Check authentication (simplified - in production, verify admin role)
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
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      )
    }

    const { orders: paginatedOrders, total, pages } = getPaginatedOrders(page, limit, status, search)

    // Calculate summary statistics
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    const pendingOrders = orders.filter(o => o.status === 'pending').length
    const processingOrders = orders.filter(o => o.status === 'processing').length
    const shippedOrders = orders.filter(o => o.status === 'shipped').length
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length

    return NextResponse.json({
      success: true,
      orders: paginatedOrders,
      pagination: {
        page,
        limit,
        total,
        pages,
        hasNext: page < pages,
        hasPrev: page > 1
      },
      summary: {
        totalOrders,
        totalRevenue: totalRevenue.toFixed(2),
        pending: pendingOrders,
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders
      }
    }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })

  } catch (error) {
    console.error('Orders GET error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    )
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      items, 
      customerName, 
      customerEmail, 
      paymentMethod,
      shippingAddress 
    } = body

    // Validate required fields
    if (!items || !items.length || !customerName || !customerEmail || !paymentMethod) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields' 
        },
        { status: 400 }
      )
    }

    // Check authentication (optional - can create order without login)
    const session = request.cookies.get('session')
    let userId = 'guest'
    if (session) {
      try {
        const userData = JSON.parse(session.value)
        userId = userData.id
      } catch {
        // Ignore parsing errors
      }
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
    const tax = subtotal * 0.08 // 8% tax
    const shipping = subtotal > 100 ? 0 : 10 // Free shipping over $100
    const total = subtotal + tax + shipping

    // Create new order
    const newOrder: Order = {
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      userId,
      customerName,
      customerEmail,
      items: items.map((item: any, index: number) => ({
        id: index + 1,
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || '/placeholder.jpg'
      })),
      subtotal,
      total,
      status: 'pending',
      paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid',
      paymentMethod,
      createdAt: new Date().toISOString()
    }

    // Add to orders array (in production, save to database)
    orders.push(newOrder)

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order: newOrder
    }, {
      status: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })

  } catch (error) {
    console.error('Orders POST error:', error)
    
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}
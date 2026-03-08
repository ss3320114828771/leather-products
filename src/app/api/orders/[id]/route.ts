import { NextRequest, NextResponse } from 'next/server'

// Types (same as before)
interface OrderItem {
  id: number
  productId: number
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
  image: string
}

interface Order {
  id: string
  userId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentMethod: 'cash_on_delivery' | 'card' | 'online'
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  billingAddress?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  notes?: string
  createdAt: string
  updatedAt: string
}

// Mock orders database
const orders: Order[] = [
  {
    id: 'ORD-001',
    userId: '1',
    customerName: 'Hafiz Sajid Syed',
    customerEmail: 'sajid.syed@leather.com',
    customerPhone: '+1 (234) 567-890',
    items: [
      {
        id: 1,
        productId: 1,
        name: 'Premium Leather Bag',
        price: 299.99,
        quantity: 1,
        size: 'Large',
        color: 'Black',
        image: '/n1.jpeg'
      },
      {
        id: 2,
        productId: 2,
        name: 'Classic Leather Wallet',
        price: 89.99,
        quantity: 2,
        color: 'Brown',
        image: '/n2.jpeg'
      }
    ],
    subtotal: 479.97,
    tax: 38.40,
    shipping: 10.00,
    total: 528.37,
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    billingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    notes: 'Leave at front door',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:20:00Z'
  },
  {
    id: 'ORD-002',
    userId: '2',
    customerName: 'John Smith',
    customerEmail: 'john.smith@email.com',
    customerPhone: '+1 (234) 567-891',
    items: [
      {
        id: 3,
        productId: 3,
        name: 'Handcrafted Leather Belt',
        price: 79.99,
        quantity: 1,
        size: 'Medium',
        color: 'Black',
        image: '/n3.jpeg'
      }
    ],
    subtotal: 79.99,
    tax: 6.40,
    shipping: 5.00,
    total: 91.39,
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'online',
    shippingAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA'
    },
    createdAt: '2024-01-14T15:45:00Z',
    updatedAt: '2024-01-15T09:30:00Z'
  }
]

// Helper function
function findOrderById(id: string): Order | undefined {
  return orders.find(order => order.id === id)
}

// GET - FIXED for Next.js 15
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const orderId = params.id

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      )
    }

    const order = findOrderById(orderId)

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      )
    }

    // Check authentication
    const session = request.cookies.get('session')
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json({ success: true, order })

  } catch (error) {
    console.error('Order GET error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - FIXED for Next.js 15
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const orderId = params.id
    const body = await request.json()
    const { status, paymentStatus, notes } = body

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      )
    }

    const orderIndex = orders.findIndex(order => order.id === orderId)

    if (orderIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      )
    }

    // Check authentication
    const session = request.cookies.get('session')
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Update order fields
    if (status) {
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { success: false, message: 'Invalid status' },
          { status: 400 }
        )
      }
      orders[orderIndex].status = status as Order['status']
    }

    if (paymentStatus) {
      const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded']
      if (!validPaymentStatuses.includes(paymentStatus)) {
        return NextResponse.json(
          { success: false, message: 'Invalid payment status' },
          { status: 400 }
        )
      }
      orders[orderIndex].paymentStatus = paymentStatus as Order['paymentStatus']
    }

    if (notes !== undefined) {
      orders[orderIndex].notes = notes
    }

    orders[orderIndex].updatedAt = new Date().toISOString()

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order: orders[orderIndex]
    })

  } catch (error) {
    console.error('Order PUT error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - FIXED for Next.js 15
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const orderId = params.id

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      )
    }

    const orderIndex = orders.findIndex(order => order.id === orderId)

    if (orderIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      )
    }

    // Check authentication
    const session = request.cookies.get('session')
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Instead of deleting, mark as cancelled
    if (orders[orderIndex].status !== 'delivered') {
      orders[orderIndex].status = 'cancelled'
      orders[orderIndex].paymentStatus = 'refunded'
      orders[orderIndex].updatedAt = new Date().toISOString()

      return NextResponse.json({
        success: true,
        message: 'Order cancelled successfully',
        order: orders[orderIndex]
      })
    } else {
      return NextResponse.json(
        { success: false, message: 'Cannot cancel delivered order' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Order DELETE error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// OPTIONS
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 })
}
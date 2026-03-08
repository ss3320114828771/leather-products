import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory cart store (replace with database in production)
// In production, this would be stored in a database with user association
let carts: {
  [key: string]: {
    items: CartItem[]
    updatedAt: string
  }
} = {}

// Types
interface CartItem {
  id: number
  productId: number
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
  image: string
}

interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}

// Helper function to get cart from session
function getCartId(request: NextRequest): string {
  // Try to get cart from cookie first
  const cartCookie = request.cookies.get('cartId')
  if (cartCookie) {
    return cartCookie.value
  }
  
  // Generate new cart ID
  return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Helper function to calculate cart totals
function calculateCartTotals(items: CartItem[]): { total: number; itemCount: number } {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const itemCount = items.reduce((count, item) => count + item.quantity, 0)
  return { total, itemCount }
}

// GET /api/cart - Get current cart
export async function GET(request: NextRequest) {
  try {
    const cartId = getCartId(request)
    const cart = carts[cartId] || { items: [], updatedAt: new Date().toISOString() }
    const { total, itemCount } = calculateCartTotals(cart.items)

    const response = NextResponse.json({
      success: true,
      cart: {
        id: cartId,
        items: cart.items,
        total: total.toFixed(2),
        itemCount,
        updatedAt: cart.updatedAt
      }
    }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })

    // Set cart cookie if it doesn't exist
    if (!request.cookies.get('cartId')) {
      response.cookies.set('cartId', cartId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      })
    }

    return response

  } catch (error) {
    console.error('Cart GET error:', error)
    
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

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, name, price, quantity = 1, size, color, image } = body

    // Validate input
    if (!productId || !name || !price) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Product ID, name, and price are required' 
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

    if (quantity < 1) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Quantity must be at least 1' 
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

    const cartId = getCartId(request)
    
    // Initialize cart if it doesn't exist
    if (!carts[cartId]) {
      carts[cartId] = {
        items: [],
        updatedAt: new Date().toISOString()
      }
    }

    // Check if item already exists in cart
    const existingItemIndex = carts[cartId].items.findIndex(
      item => item.productId === productId && item.size === size && item.color === color
    )

    if (existingItemIndex > -1) {
      // Update quantity of existing item
      carts[cartId].items[existingItemIndex].quantity += quantity
    } else {
      // Add new item
      const newItem: CartItem = {
        id: Date.now(),
        productId,
        name,
        price,
        quantity,
        size,
        color,
        image: image || '/placeholder.jpg'
      }
      carts[cartId].items.push(newItem)
    }

    carts[cartId].updatedAt = new Date().toISOString()
    const { total, itemCount } = calculateCartTotals(carts[cartId].items)

    const response = NextResponse.json({
      success: true,
      message: 'Item added to cart',
      cart: {
        id: cartId,
        items: carts[cartId].items,
        total: total.toFixed(2),
        itemCount,
        updatedAt: carts[cartId].updatedAt
      }
    }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })

    // Set cart cookie if it doesn't exist
    if (!request.cookies.get('cartId')) {
      response.cookies.set('cartId', cartId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      })
    }

    return response

  } catch (error) {
    console.error('Cart POST error:', error)
    
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

// PUT /api/cart - Update item quantity
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { itemId, quantity } = body

    if (!itemId || quantity === undefined) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Item ID and quantity are required' 
        },
        { status: 400 }
      )
    }

    if (quantity < 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Quantity cannot be negative' 
        },
        { status: 400 }
      )
    }

    const cartId = getCartId(request)

    if (!carts[cartId]) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Cart not found' 
        },
        { status: 404 }
      )
    }

    const itemIndex = carts[cartId].items.findIndex(item => item.id === itemId)

    if (itemIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Item not found in cart' 
        },
        { status: 404 }
      )
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      carts[cartId].items.splice(itemIndex, 1)
    } else {
      // Update quantity
      carts[cartId].items[itemIndex].quantity = quantity
    }

    carts[cartId].updatedAt = new Date().toISOString()
    const { total, itemCount } = calculateCartTotals(carts[cartId].items)

    return NextResponse.json({
      success: true,
      message: quantity === 0 ? 'Item removed from cart' : 'Cart updated',
      cart: {
        id: cartId,
        items: carts[cartId].items,
        total: total.toFixed(2),
        itemCount,
        updatedAt: carts[cartId].updatedAt
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
    console.error('Cart PUT error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// DELETE /api/cart - Clear cart or remove specific item
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get('itemId')
    
    const cartId = getCartId(request)

    if (!carts[cartId]) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Cart not found' 
        },
        { status: 404 }
      )
    }

    if (itemId) {
      // Remove specific item
      const itemIdNum = parseInt(itemId)
      carts[cartId].items = carts[cartId].items.filter(item => item.id !== itemIdNum)
    } else {
      // Clear entire cart
      carts[cartId].items = []
    }

    carts[cartId].updatedAt = new Date().toISOString()
    const { total, itemCount } = calculateCartTotals(carts[cartId].items)

    return NextResponse.json({
      success: true,
      message: itemId ? 'Item removed from cart' : 'Cart cleared',
      cart: {
        id: cartId,
        items: carts[cartId].items,
        total: total.toFixed(2),
        itemCount,
        updatedAt: carts[cartId].updatedAt
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
    console.error('Cart DELETE error:', error)
    
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
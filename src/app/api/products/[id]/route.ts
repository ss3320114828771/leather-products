import { NextRequest, NextResponse } from 'next/server'

// Types
interface ProductImage {
  id: number
  url: string
  isPrimary: boolean
}

interface Review {
  id: number
  userId: string
  userName: string
  rating: number
  comment: string
  date: string
}

interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: number
  salePrice?: number
  category: string
  categoryId: number
  images: ProductImage[]
  stock: number
  sku: string
  material?: string
  color?: string
  sizes?: string[]
  dimensions?: string
  weight?: string
  featured: boolean
  rating: number
  reviewCount: number
  reviews?: Review[]
  createdAt: string
  updatedAt: string
}

// Mock products database (replace with real database in production)
const products: Product[] = [
  {
    id: 1,
    name: 'Premium Leather Bag',
    slug: 'premium-leather-bag',
    description: 'Handcrafted premium leather bag with modern design. Features multiple compartments and adjustable strap. Made from full-grain leather for durability and style.',
    price: 299.99,
    salePrice: 249.99,
    category: 'Bags',
    categoryId: 1,
    images: [
      { id: 1, url: '/n1.jpeg', isPrimary: true },
      { id: 2, url: '/n2.jpeg', isPrimary: false },
      { id: 3, url: '/n3.jpeg', isPrimary: false }
    ],
    stock: 45,
    sku: 'LB-001-BLK',
    material: 'Full-grain leather',
    color: 'Black',
    sizes: ['Small', 'Medium', 'Large'],
    dimensions: '12" x 10" x 4"',
    weight: '2.5 lbs',
    featured: true,
    rating: 4.8,
    reviewCount: 89,
    reviews: [
      {
        id: 1,
        userId: '2',
        userName: 'John Smith',
        rating: 5,
        comment: 'Excellent quality! The leather is soft and durable.',
        date: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        userId: '3',
        userName: 'Sarah Johnson',
        rating: 4,
        comment: 'Great bag, but shipping took a bit long.',
        date: '2024-01-14T15:45:00Z'
      }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T14:20:00Z'
  },
  {
    id: 2,
    name: 'Classic Leather Wallet',
    slug: 'classic-leather-wallet',
    description: 'Slim and elegant leather wallet with multiple card slots and a bill compartment. Perfect for everyday use.',
    price: 89.99,
    category: 'Wallets',
    categoryId: 2,
    images: [
      { id: 4, url: '/n2.jpeg', isPrimary: true },
      { id: 5, url: '/n3.jpeg', isPrimary: false }
    ],
    stock: 78,
    sku: 'LW-002-BRN',
    material: 'Full-grain leather',
    color: 'Brown',
    dimensions: '4.5" x 3.5" x 0.5"',
    weight: '0.3 lbs',
    featured: true,
    rating: 4.9,
    reviewCount: 256,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-09T10:15:00Z'
  }
]

// Helper function to find product by ID
function findProductById(id: number): Product | undefined {
  return products.find(product => product.id === id)
}

// Helper function to find product by slug
function findProductBySlug(slug: string): Product | undefined {
  return products.find(product => product.slug === slug)
}

// GET /api/products/[id] - Get product by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id

    if (!productId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Product ID is required' 
        },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      )
    }

    // Check if ID is numeric (ID) or string (slug)
    const isNumeric = /^\d+$/.test(productId)
    let product: Product | undefined

    if (isNumeric) {
      product = findProductById(parseInt(productId))
    } else {
      product = findProductBySlug(productId)
    }

    if (!product) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Product not found' 
        },
        { 
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      )
    }

    return NextResponse.json({
      success: true,
      product
    }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })

  } catch (error) {
    console.error('Product GET error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    )
  }
}

// PUT /api/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id)
    const body = await request.json()

    if (isNaN(productId)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid product ID' 
        },
        { status: 400 }
      )
    }

    const productIndex = products.findIndex(p => p.id === productId)

    if (productIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Product not found' 
        },
        { status: 404 }
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

    // Validate user is admin (simplified)
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

    // Update product fields (only allow specific fields)
    const allowedFields = ['name', 'description', 'price', 'salePrice', 'stock', 'category', 'material', 'color', 'featured']
    
    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        (products[productIndex] as any)[field] = body[field]
      }
    })

    // Update slug if name changed
    if (body.name) {
      products[productIndex].slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    }

    products[productIndex].updatedAt = new Date().toISOString()

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: products[productIndex]
    }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })

  } catch (error) {
    console.error('Product PUT error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Delete product (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id)

    if (isNaN(productId)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid product ID' 
        },
        { status: 400 }
      )
    }

    const productIndex = products.findIndex(p => p.id === productId)

    if (productIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Product not found' 
        },
        { status: 404 }
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

    // Remove product from array (in production, soft delete or remove from database)
    const deletedProduct = products[productIndex]
    products.splice(productIndex, 1)

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
      product: deletedProduct
    }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })

  } catch (error) {
    console.error('Product DELETE error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// PATCH /api/products/[id] - Partially update product
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id)
    const body = await request.json()

    if (isNaN(productId)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid product ID' 
        },
        { status: 400 }
      )
    }

    const productIndex = products.findIndex(p => p.id === productId)

    if (productIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Product not found' 
        },
        { status: 404 }
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

    // Update only stock and featured (common quick updates)
    if (body.stock !== undefined) {
      products[productIndex].stock = body.stock
    }
    
    if (body.featured !== undefined) {
      products[productIndex].featured = body.featured
    }

    products[productIndex].updatedAt = new Date().toISOString()

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: products[productIndex]
    }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })

  } catch (error) {
    console.error('Product PATCH error:', error)
    
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
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}
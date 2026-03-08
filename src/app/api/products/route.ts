import { NextRequest, NextResponse } from 'next/server'

// Types
interface ProductImage {
  id: number
  url: string
  isPrimary: boolean
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
  featured: boolean
  rating: number
  reviewCount: number
  createdAt: string
}

// Mock products database (replace with real database in production)
const products: Product[] = [
  {
    id: 1,
    name: 'Premium Leather Bag',
    slug: 'premium-leather-bag',
    description: 'Handcrafted premium leather bag with modern design. Features multiple compartments and adjustable strap.',
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
    featured: true,
    rating: 4.8,
    reviewCount: 89,
    createdAt: '2024-01-01T00:00:00Z'
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
    featured: true,
    rating: 4.9,
    reviewCount: 256,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'Handcrafted Leather Belt',
    slug: 'handcrafted-leather-belt',
    description: 'Premium leather belt with classic design. Features a solid brass buckle and hand-finished edges.',
    price: 79.99,
    salePrice: 69.99,
    category: 'Belts',
    categoryId: 3,
    images: [
      { id: 6, url: '/n3.jpeg', isPrimary: true },
      { id: 7, url: '/n4.jpeg', isPrimary: false }
    ],
    stock: 23,
    sku: 'LB-003-BLK',
    material: 'Full-grain leather',
    color: 'Black',
    featured: false,
    rating: 4.7,
    reviewCount: 89,
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    id: 4,
    name: 'Leather Card Holder',
    slug: 'leather-card-holder',
    description: 'Minimalist card holder perfect for carrying essentials. Fits up to 6 cards.',
    price: 49.99,
    category: 'Wallets',
    categoryId: 2,
    images: [
      { id: 8, url: '/n4.jpeg', isPrimary: true },
      { id: 9, url: '/n5.jpeg', isPrimary: false }
    ],
    stock: 0,
    sku: 'LW-004-BRN',
    material: 'Full-grain leather',
    color: 'Brown',
    featured: false,
    rating: 4.9,
    reviewCount: 312,
    createdAt: '2024-01-03T00:00:00Z'
  },
  {
    id: 5,
    name: 'Messenger Leather Bag',
    slug: 'messenger-leather-bag',
    description: 'Spacious messenger bag perfect for work or travel. Features padded laptop compartment.',
    price: 349.99,
    salePrice: 299.99,
    category: 'Bags',
    categoryId: 1,
    images: [
      { id: 10, url: '/n5.jpeg', isPrimary: true },
      { id: 11, url: '/n6.jpeg', isPrimary: false }
    ],
    stock: 12,
    sku: 'LB-005-BRN',
    material: 'Full-grain leather',
    color: 'Brown',
    featured: true,
    rating: 4.8,
    reviewCount: 67,
    createdAt: '2024-01-04T00:00:00Z'
  },
  {
    id: 6,
    name: 'Leather Keychain',
    slug: 'leather-keychain',
    description: 'Simple and elegant leather keychain. Great gift idea.',
    price: 29.99,
    salePrice: 24.99,
    category: 'Accessories',
    categoryId: 4,
    images: [
      { id: 12, url: '/n6.jpeg', isPrimary: true }
    ],
    stock: 156,
    sku: 'LA-006-BLK',
    material: 'Full-grain leather',
    color: 'Black',
    featured: false,
    rating: 4.9,
    reviewCount: 423,
    createdAt: '2024-01-05T00:00:00Z'
  }
]

// Helper function to get paginated products
function getPaginatedProducts(
  page: number = 1,
  limit: number = 10,
  category?: string,
  search?: string,
  minPrice?: number,
  maxPrice?: number,
  featured?: boolean,
  sort?: string
): { products: Product[]; total: number; pages: number } {
  let filteredProducts = [...products]

  // Filter by category
  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.category.toLowerCase() === category.toLowerCase())
  }

  // Filter by search (name or description)
  if (search) {
    const searchLower = search.toLowerCase()
    filteredProducts = filteredProducts.filter(
      p => p.name.toLowerCase().includes(searchLower) ||
           p.description.toLowerCase().includes(searchLower)
    )
  }

  // Filter by price range
  if (minPrice !== undefined) {
    filteredProducts = filteredProducts.filter(p => p.price >= minPrice)
  }
  if (maxPrice !== undefined) {
    filteredProducts = filteredProducts.filter(p => p.price <= maxPrice)
  }

  // Filter featured
  if (featured !== undefined) {
    filteredProducts = filteredProducts.filter(p => p.featured === featured)
  }

  // Filter in stock
  const inStock = true // This would come from query param
  if (inStock) {
    filteredProducts = filteredProducts.filter(p => p.stock > 0)
  }

  // Sort products
  if (sort) {
    switch(sort) {
      case 'price-asc':
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      default:
        // Default sort by featured then newest
        filteredProducts.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })
    }
  }

  const total = filteredProducts.length
  const pages = Math.ceil(total / limit)
  const start = (page - 1) * limit
  const paginatedProducts = filteredProducts.slice(start, start + limit)

  return { products: paginatedProducts, total, pages }
}

// GET /api/products - Get all products with pagination, filtering, search, sorting
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category') || undefined
    const search = searchParams.get('search') || undefined
    const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined
    const featured = searchParams.get('featured') === 'true' ? true : 
                     searchParams.get('featured') === 'false' ? false : undefined
    const inStock = searchParams.get('inStock') === 'true'
    const sort = searchParams.get('sort') || 'featured'

    // Validate pagination
    if (page < 1 || limit < 1 || limit > 50) {
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

    const { products: paginatedProducts, total, pages } = getPaginatedProducts(
      page, limit, category, search, minPrice, maxPrice, featured, sort
    )

    // Get unique categories for filters
    const categories = [...new Set(products.map(p => p.category))]

    // Calculate price range for filters
    const prices = products.map(p => p.price)
    const minProductPrice = Math.min(...prices)
    const maxProductPrice = Math.max(...prices)

    return NextResponse.json({
      success: true,
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total,
        pages,
        hasNext: page < pages,
        hasPrev: page > 1
      },
      filters: {
        categories,
        priceRange: {
          min: minProductPrice,
          max: maxProductPrice
        }
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
    console.error('Products GET error:', error)
    
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

// POST /api/products - Create new product (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, 
      description, 
      price, 
      category, 
      stock, 
      sku,
      images,
      material,
      color,
      featured
    } = body

    // Validate required fields
    if (!name || !description || !price || !category || stock === undefined || !sku) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields' 
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

    // Check if SKU already exists
    const existingProduct = products.find(p => p.sku === sku)
    if (existingProduct) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Product with this SKU already exists' 
        },
        { status: 409 }
      )
    }

    // Create new product
    const newProduct: Product = {
      id: products.length + 1,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      price,
      salePrice: body.salePrice,
      category,
      categoryId: body.categoryId || 1,
      images: images || [{ id: 1, url: '/placeholder.jpg', isPrimary: true }],
      stock,
      sku,
      material,
      color,
      featured: featured || false,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString()
    }

    // Add to products array (in production, save to database)
    products.push(newProduct)

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product: newProduct
    }, {
      status: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })

  } catch (error) {
    console.error('Products POST error:', error)
    
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
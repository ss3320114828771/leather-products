import { NextRequest, NextResponse } from 'next/server'

// Types
interface ProductImage {
  id: number
  url: string
  isPrimary: boolean
}

interface Review {
  id: number
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
        userName: 'John Smith',
        rating: 5,
        comment: 'Excellent quality! The leather is soft and durable.',
        date: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        userName: 'Sarah Johnson',
        rating: 4,
        comment: 'Great bag, but shipping took a bit long.',
        date: '2024-01-14T15:45:00Z'
      }
    ],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Classic Leather Wallet',
    slug: 'classic-leather-wallet',
    description: 'Slim and elegant leather wallet with multiple card slots and a bill compartment. Perfect for everyday use.',
    price: 89.99,
    category: 'Wallets',
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
    reviews: [
      {
        id: 3,
        userName: 'Mike Chen',
        rating: 5,
        comment: 'Best wallet I\'ve ever owned. Very slim and holds all my cards.',
        date: '2024-01-13T09:20:00Z'
      }
    ],
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
    images: [
      { id: 6, url: '/n3.jpeg', isPrimary: true },
      { id: 7, url: '/n4.jpeg', isPrimary: false }
    ],
    stock: 23,
    sku: 'LB-003-BLK',
    material: 'Full-grain leather',
    color: 'Black',
    sizes: ['30', '32', '34', '36', '38'],
    dimensions: '1.5" width',
    weight: '0.5 lbs',
    featured: false,
    rating: 4.7,
    reviewCount: 89,
    createdAt: '2024-01-02T00:00:00Z'
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

// GET /api/products/[id] - Get product by ID or slug (public endpoint)
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
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      )
    }

    // Get related products (same category, excluding current product)
    const relatedProducts = products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4)
      .map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        salePrice: p.salePrice,
        image: p.images.find(img => img.isPrimary)?.url || p.images[0]?.url,
        rating: p.rating
      }))

    return NextResponse.json({
      success: true,
      product,
      relatedProducts
    }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
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
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}
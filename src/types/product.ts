import { ID, Image, Timestamps } from './index'

export interface Product {
  id: ID
  name: string
  slug: string
  description: string
  price: number
  salePrice?: number
  category: string
  categoryId: number
  images: Image[]
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
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: number
  productCount: number
}

export interface Review {
  id: ID
  productId: ID
  userId: ID
  userName: string
  rating: number
  title?: string
  comment: string
  pros?: string[]
  cons?: string[]
  images?: string[]
  verified: boolean
  helpful: number
  createdAt: string
  updatedAt: string
}

export interface ReviewStats {
  average: number
  total: number
  distribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

export interface InventoryItem {
  productId: ID
  quantity: number
  reserved: number
  available: number
  location?: string
  lastRestocked?: string
}

// Filter types
export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  featured?: boolean
  onSale?: boolean
  colors?: string[]
  sizes?: string[]
  materials?: string[]
  rating?: number
  search?: string
  sortBy?: 'price' | 'rating' | 'newest' | 'name'
  sortOrder?: 'asc' | 'desc'
}

export interface ProductSearchParams {
  q: string
  page?: number
  limit?: number
  filters?: ProductFilters
}

// Create/Update types
export type CreateProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'>
export type UpdateProductInput = Partial<CreateProductInput> & { id: ID }

export type CreateReviewInput = Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'verified' | 'helpful' | 'userName'>
export type UpdateReviewInput = Partial<CreateReviewInput> & { id: ID }
'use client'

import { useState, useEffect, useCallback } from 'react'

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
  sizes?: string[]
  dimensions?: string
  weight?: string
  featured: boolean
  rating: number
  reviewCount: number
  createdAt: string
}

interface ProductsFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  featured?: boolean
  search?: string
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'featured'
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  pages: number
  hasNext: boolean
  hasPrev: boolean
}

export function useProducts(options?: { autoLoad?: boolean }) {
  const [products, setProducts] = useState<Product[]>([])
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ProductsFilters>({
    sort: 'featured'
  })
  const [availableFilters, setAvailableFilters] = useState<{
    categories: string[]
    priceRange: { min: number; max: number }
  }>({
    categories: [],
    priceRange: { min: 0, max: 1000 }
  })
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false
  })

  const loadProducts = useCallback(async (page: number = 1) => {
    setIsLoading(page === 1)
    if (page > 1) setIsLoadingMore(true)
    setError(null)

    try {
      // Build query params
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.category && { category: filters.category }),
        ...(filters.minPrice !== undefined && { minPrice: filters.minPrice.toString() }),
        ...(filters.maxPrice !== undefined && { maxPrice: filters.maxPrice.toString() }),
        ...(filters.inStock && { inStock: 'true' }),
        ...(filters.featured && { featured: 'true' }),
        ...(filters.search && { search: filters.search }),
        ...(filters.sort && { sort: filters.sort })
      })

      const response = await fetch(`/api/products?${params}`)
      const data = await response.json()

      if (data.success) {
        setProducts(prev => page === 1 ? data.products : [...prev, ...data.products])
        setPagination(data.pagination)
        setAvailableFilters(data.filters)
      } else {
        setError(data.message || 'Failed to load products')
      }
    } catch (error) {
      setError('Error loading products')
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }, [pagination.limit, filters])

  const loadProduct = useCallback(async (id: number | string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/products/${id}`)
      const data = await response.json()

      if (data.success) {
        setCurrentProduct(data.product)
      } else {
        setError(data.message || 'Failed to load product')
      }
    } catch (error) {
      setError('Error loading product')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadRelatedProducts = useCallback(async (productId: number, limit: number = 4) => {
    setIsLoading(true)
    setError(null)

    try {
      // This would be your related products API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock related products
      const mockProducts: Product[] = [
        {
          id: 2,
          name: 'Classic Leather Wallet',
          slug: 'classic-leather-wallet',
          description: 'Slim leather wallet',
          price: 89.99,
          category: 'Wallets',
          categoryId: 2,
          images: [{ id: 1, url: '/n2.jpeg', isPrimary: true }],
          stock: 78,
          sku: 'LW-002',
          rating: 4.9,
          reviewCount: 256,
          featured: false,
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Handcrafted Leather Belt',
          slug: 'handcrafted-leather-belt',
          description: 'Premium leather belt',
          price: 79.99,
          salePrice: 69.99,
          category: 'Belts',
          categoryId: 3,
          images: [{ id: 1, url: '/n3.jpeg', isPrimary: true }],
          stock: 23,
          sku: 'LB-003',
          rating: 4.7,
          reviewCount: 89,
          featured: false,
          createdAt: new Date().toISOString()
        }
      ]
      
      return mockProducts
    } catch (error) {
      setError('Error loading related products')
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateFilters = useCallback((newFilters: ProductsFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    // Reset to page 1 when filters change
    loadProducts(1)
  }, [loadProducts])

  const loadMore = useCallback(() => {
    if (pagination.hasNext && !isLoadingMore) {
      loadProducts(pagination.page + 1)
    }
  }, [pagination.hasNext, pagination.page, isLoadingMore, loadProducts])

  // Load products on mount if autoLoad is true
  useEffect(() => {
    if (options?.autoLoad !== false) {
      loadProducts()
    }
  }, [loadProducts, options?.autoLoad])

  return {
    products,
    currentProduct,
    isLoading,
    isLoadingMore,
    error,
    filters,
    availableFilters,
    pagination,
    loadProducts,
    loadProduct,
    loadRelatedProducts,
    updateFilters,
    loadMore
  }
}

// Featured products hook
export function useFeaturedProducts(limit: number = 6) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const response = await fetch(`/api/products?featured=true&limit=${limit}`)
        const data = await response.json()

        if (data.success) {
          setProducts(data.products)
        } else {
          setError(data.message || 'Failed to load featured products')
        }
      } catch (error) {
        setError('Error loading featured products')
      } finally {
        setIsLoading(false)
      }
    }

    loadFeatured()
  }, [limit])

  return { products, isLoading, error }
}

// Category products hook
export function useCategoryProducts(category: string, limit: number = 10) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!category) return

    const loadCategory = async () => {
      try {
        const response = await fetch(`/api/products?category=${category}&limit=${limit}`)
        const data = await response.json()

        if (data.success) {
          setProducts(data.products)
        } else {
          setError(data.message || 'Failed to load category products')
        }
      } catch (error) {
        setError('Error loading category products')
      } finally {
        setIsLoading(false)
      }
    }

    loadCategory()
  }, [category, limit])

  return { products, isLoading, error }
}

// Search products hook
export function useSearchProducts() {
  const [results, setResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setIsSearching(true)
    setError(null)

    try {
      const response = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=20`)
      const data = await response.json()

      if (data.success) {
        setResults(data.products)
      } else {
        setError(data.message || 'Search failed')
      }
    } catch (error) {
      setError('Error searching products')
    } finally {
      setIsSearching(false)
    }
  }, [])

  return { results, isSearching, error, search }
}
'use client'

import { useState } from 'react'
import ProductCard from './ProductCard'

interface Product {
  id: number
  name: string
  price: number
  salePrice?: number
  image: string
  category: string
  rating: number
  reviews: number
  featured?: boolean
  stock?: number
}

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  columns?: 2 | 3 | 4
  variant?: 'default' | 'compact' | 'horizontal'
  onQuickView?: (id: number) => void
  onAddToCart?: (id: number) => void
  onAddToWishlist?: (id: number) => void
  emptyMessage?: string
  showLoadMore?: boolean
  onLoadMore?: () => void
  hasMore?: boolean
}

export default function ProductGrid({
  products,
  loading = false,
  columns = 3,
  variant = 'default',
  onQuickView,
  onAddToCart,
  onAddToWishlist,
  emptyMessage = 'No products found',
  showLoadMore = false,
  onLoadMore,
  hasMore = false
}: ProductGridProps) {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})

  const getGridCols = () => {
    switch(columns) {
      case 2: return 'grid-cols-1 sm:grid-cols-2'
      case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      case 4: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    }
  }

  // Handle image error internally
  const getProductImage = (product: Product) => {
    return imageErrors[product.id] ? '/placeholder.jpg' : product.image
  }

  if (loading) {
    return (
      <div className={`grid ${getGridCols()} gap-6`}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white/5 rounded-xl p-4 animate-pulse">
            <div className="h-48 bg-white/10 rounded-lg mb-4"></div>
            <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-white/10 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-white/10 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-bold mb-2">{emptyMessage}</h3>
        <p className="text-gray-400">Try adjusting your search or filter to find what you're looking for.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className={`grid ${getGridCols()} gap-6`}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            salePrice={product.salePrice}
            image={getProductImage(product)}
            category={product.category}
            rating={product.rating}
            reviews={product.reviews}
            featured={product.featured}
            stock={product.stock}
            onQuickView={onQuickView}
            onAddToCart={onAddToCart}
            onAddToWishlist={onAddToWishlist}
            variant={variant}
          />
        ))}
      </div>

      {/* Load More */}
      {showLoadMore && hasMore && (
        <div className="text-center">
          <button
            onClick={onLoadMore}
            className="px-6 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition font-medium"
          >
            Load More Products
          </button>
        </div>
      )}

      {/* Results Count */}
      <div className="text-center text-sm text-gray-400">
        Showing {products.length} products
      </div>
    </div>
  )
}

// Example usage component
export function ProductGridExample() {
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: 'Premium Leather Bag',
      price: 299.99,
      salePrice: 249.99,
      image: '/n1.jpeg',
      category: 'Bags',
      rating: 4.8,
      reviews: 89,
      featured: true,
      stock: 45
    },
    {
      id: 2,
      name: 'Classic Leather Wallet',
      price: 89.99,
      image: '/n2.jpeg',
      category: 'Wallets',
      rating: 4.9,
      reviews: 256,
      stock: 78
    },
    {
      id: 3,
      name: 'Handcrafted Leather Belt',
      price: 79.99,
      salePrice: 69.99,
      image: '/n3.jpeg',
      category: 'Belts',
      rating: 4.7,
      reviews: 89,
      stock: 23
    },
    {
      id: 4,
      name: 'Leather Card Holder',
      price: 49.99,
      image: '/n4.jpeg',
      category: 'Wallets',
      rating: 4.9,
      reviews: 312,
      stock: 0
    },
    {
      id: 5,
      name: 'Messenger Leather Bag',
      price: 349.99,
      salePrice: 299.99,
      image: '/n5.jpeg',
      category: 'Bags',
      rating: 4.8,
      reviews: 67,
      featured: true,
      stock: 12
    },
    {
      id: 6,
      name: 'Leather Keychain',
      price: 29.99,
      salePrice: 24.99,
      image: '/n6.jpeg',
      category: 'Accessories',
      rating: 4.9,
      reviews: 423,
      stock: 156
    }
  ])

  const handleQuickView = (id: number) => {
    console.log('Quick view:', id)
  }

  const handleAddToCart = (id: number) => {
    console.log('Add to cart:', id)
  }

  const handleAddToWishlist = (id: number) => {
    console.log('Add to wishlist:', id)
  }

  return (
    <div className="p-4 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-purple-400">Default Grid (3 columns)</h2>
        <ProductGrid
          products={products}
          onQuickView={handleQuickView}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 text-purple-400">Compact Grid (4 columns)</h2>
        <ProductGrid
          products={products.slice(0, 4)}
          columns={4}
          variant="compact"
          onAddToCart={handleAddToCart}
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 text-purple-400">Horizontal Variant</h2>
        <div className="space-y-4">
          {products.slice(0, 2).map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              salePrice={product.salePrice}
              image={product.image}
              category={product.category}
              rating={product.rating}
              reviews={product.reviews}
              featured={product.featured}
              stock={product.stock}
              variant="horizontal"
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
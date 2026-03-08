'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface ProductCardProps {
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
  onQuickView?: (id: number) => void
  onAddToCart?: (id: number) => void
  onAddToWishlist?: (id: number) => void
  variant?: 'default' | 'compact' | 'horizontal'
}

export default function ProductCard({
  id,
  name,
  price,
  salePrice,
  image,
  category,
  rating,
  reviews,
  featured = false,
  stock = 10,
  onQuickView,
  onAddToCart,
  onAddToWishlist,
  variant = 'default'
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [isAddedToCart, setIsAddedToCart] = useState(false)

  const handleAddToCart = () => {
    setIsAddedToCart(true)
    if (onAddToCart) onAddToCart(id)
    setTimeout(() => setIsAddedToCart(false), 2000)
  }

  const discountPercentage = salePrice 
    ? Math.round(((price - salePrice) / price) * 100) 
    : 0

  const getRatingStars = () => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    const stars = []

    for (let i = 0; i < fullStars; i++) {
      stars.push('★')
    }
    if (hasHalfStar) {
      stars.push('½')
    }
    while (stars.length < 5) {
      stars.push('☆')
    }

    return stars
  }

  const getStockStatus = () => {
    if (stock === 0) return { text: 'Out of Stock', color: 'text-red-400' }
    if (stock < 5) return { text: 'Low Stock', color: 'text-yellow-400' }
    return { text: 'In Stock', color: 'text-green-400' }
  }

  const stockStatus = getStockStatus()

  // Horizontal variant
  if (variant === 'horizontal') {
    return (
      <div className="bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition border border-white/10 hover:border-purple-500/50">
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="sm:w-48 h-48 relative overflow-hidden">
            <Image
              src={image}
              alt={name}
              fill
              className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
              onLoad={() => setIsImageLoading(false)}
            />
            {isImageLoading && (
              <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
            )}
            {featured && (
              <span className="absolute top-2 left-2 px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                Featured
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            <div className="flex justify-between items-start">
              <div>
                <Link href={`/products/${id}`} className="hover:text-purple-400 transition">
                  <h3 className="font-bold text-lg mb-1">{name}</h3>
                </Link>
                <p className="text-sm text-gray-400 mb-2">{category}</p>
              </div>
              <span className={`text-sm ${stockStatus.color}`}>{stockStatus.text}</span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex text-yellow-400">
                {getRatingStars().map((star, i) => (
                  <span key={i}>{star}</span>
                ))}
              </div>
              <span className="text-xs text-gray-400">({reviews})</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-3">
              {salePrice ? (
                <>
                  <span className="text-2xl font-bold text-purple-400">${salePrice}</span>
                  <span className="text-sm text-gray-400 line-through">${price}</span>
                  <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                    -{discountPercentage}%
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold">${price}</span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                disabled={stock === 0}
                className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50"
              >
                {isAddedToCart ? '✓ Added!' : 'Add to Cart'}
              </button>
              {onQuickView && (
                <button
                  onClick={() => onQuickView(id)}
                  className="px-3 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition"
                >
                  🔍
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <Link href={`/products/${id}`}>
        <div className="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition border border-white/10 hover:border-purple-500/50 group">
          <div className="relative h-32">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {salePrice && (
              <span className="absolute top-1 right-1 px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">
                -{discountPercentage}%
              </span>
            )}
          </div>
          <div className="p-2">
            <h4 className="font-medium text-sm truncate">{name}</h4>
            <div className="flex items-center justify-between mt-1">
              {salePrice ? (
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-purple-400">${salePrice}</span>
                  <span className="text-xs text-gray-400 line-through">${price}</span>
                </div>
              ) : (
                <span className="text-sm font-bold">${price}</span>
              )}
              <div className="flex text-yellow-400 text-xs">
                {'★'.repeat(Math.floor(rating))}
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Default variant
  return (
    <div 
      className="group relative bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition border border-white/10 hover:border-purple-500/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <Link href={`/products/${id}`}>
        <div className="relative h-64 overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className={`object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
            onLoad={() => setIsImageLoading(false)}
          />
          {isImageLoading && (
            <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {featured && (
              <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-semibold">
                Featured
              </span>
            )}
            {salePrice && (
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold border border-green-500/30">
                -{discountPercentage}%
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {onAddToWishlist && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  onAddToWishlist(id)
                }}
                className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-pink-500/50 transition"
              >
                ❤️
              </button>
            )}
            {onQuickView && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  onQuickView(id)
                }}
                className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-purple-500/50 transition"
              >
                👁️
              </button>
            )}
          </div>

          {/* Out of Stock Overlay */}
          {stock === 0 && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm border border-red-500/30">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/products/${id}`}>
          <h3 className="font-bold mb-1 hover:text-purple-400 transition line-clamp-1">{name}</h3>
        </Link>
        
        <p className="text-xs text-gray-400 mb-2">{category}</p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex text-yellow-400">
            {getRatingStars().map((star, i) => (
              <span key={i}>{star}</span>
            ))}
          </div>
          <span className="text-xs text-gray-400">({reviews})</span>
        </div>

        {/* Price and Stock */}
        <div className="flex items-center justify-between mb-3">
          <div>
            {salePrice ? (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-purple-400">${salePrice}</span>
                <span className="text-sm text-gray-400 line-through">${price}</span>
              </div>
            ) : (
              <span className="text-xl font-bold">${price}</span>
            )}
          </div>
          <span className={`text-xs ${stockStatus.color}`}>{stockStatus.text}</span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={stock === 0}
          className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isAddedToCart ? (
            <>
              <span>✓</span>
              <span>Added!</span>
            </>
          ) : (
            <>
              <span>🛒</span>
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
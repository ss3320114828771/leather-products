'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface CartItemProps {
  id: number
  productId: number
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
  image: string
  maxQuantity?: number
  onUpdateQuantity: (id: number, newQuantity: number) => void
  onRemove: (id: number) => void
  onMoveToWishlist?: (id: number) => void
}

export default function CartItem({
  id,
  productId,
  name,
  price,
  quantity,
  size,
  color,
  image,
  maxQuantity = 99,
  onUpdateQuantity,
  onRemove,
  onMoveToWishlist
}: CartItemProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > maxQuantity) return
    setIsLoading(true)
    onUpdateQuantity(id, newQuantity)
    setTimeout(() => setIsLoading(false), 300) // Simulate loading
  }

  const handleRemove = () => {
    if (showDeleteConfirm) {
      onRemove(id)
      setShowDeleteConfirm(false)
    } else {
      setShowDeleteConfirm(true)
      // Auto hide confirmation after 3 seconds
      setTimeout(() => setShowDeleteConfirm(false), 3000)
    }
  }

  const handleMoveToWishlist = () => {
    if (onMoveToWishlist) {
      onMoveToWishlist(id)
    }
  }

  const itemTotal = price * quantity

  return (
    <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition border border-white/10">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Product Image */}
        <Link href={`/products/${productId}`} className="sm:w-24 sm:h-24 relative h-32 w-full rounded-lg overflow-hidden group">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </Link>

        {/* Product Details */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <div>
              <Link href={`/products/${productId}`} className="font-bold hover:text-purple-400 transition">
                {name}
              </Link>
              
              {/* Variants */}
              <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-400">
                {size && (
                  <span className="px-2 py-1 bg-white/5 rounded-full">
                    Size: {size}
                  </span>
                )}
                {color && (
                  <span className="px-2 py-1 bg-white/5 rounded-full">
                    Color: {color}
                  </span>
                )}
              </div>

              {/* Price on mobile */}
              <div className="sm:hidden mt-2">
                <span className="text-lg font-bold text-purple-400">
                  ${itemTotal.toFixed(2)}
                </span>
                <span className="text-xs text-gray-400 ml-2">
                  (${price.toFixed(2)} each)
                </span>
              </div>
            </div>

            {/* Price on desktop */}
            <div className="hidden sm:block text-right">
              <span className="text-lg font-bold text-purple-400">
                ${itemTotal.toFixed(2)}
              </span>
              <p className="text-xs text-gray-400">${price.toFixed(2)} each</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1 || isLoading}
                className="w-8 h-8 bg-white/5 rounded-lg hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                -
              </button>
              
              <span className="w-12 text-center font-medium">{quantity}</span>
              
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= maxQuantity || isLoading}
                className="w-8 h-8 bg-white/5 rounded-lg hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                +
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {onMoveToWishlist && (
                <button
                  onClick={handleMoveToWishlist}
                  disabled={isLoading}
                  className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-lg text-sm hover:bg-pink-500/30 transition disabled:opacity-50"
                >
                  ❤️ Wishlist
                </button>
              )}
              
              <button
                onClick={handleRemove}
                disabled={isLoading}
                className={`px-3 py-1 rounded-lg text-sm transition disabled:opacity-50 ${
                  showDeleteConfirm
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                }`}
              >
                {showDeleteConfirm ? 'Confirm Delete?' : '🗑️ Remove'}
              </button>
            </div>
          </div>

          {/* Stock Warning */}
          {maxQuantity < 10 && (
            <p className="text-xs text-yellow-400 mt-2">
              ⚠️ Only {maxQuantity} left in stock
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
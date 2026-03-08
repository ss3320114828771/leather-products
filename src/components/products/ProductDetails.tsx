'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface ProductDetailsProps {
  product: {
    id: number
    name: string
    description: string
    price: number
    salePrice?: number
    images: { id: number; url: string; isPrimary: boolean }[]
    category: string
    sku: string
    stock: number
    material?: string
    color?: string
    sizes?: string[]
    dimensions?: string
    weight?: string
    rating: number
    reviews: { id: number; userName: string; rating: number; comment: string; date: string }[]
  }
  relatedProducts?: any[]
  onAddToCart?: (quantity: number, size?: string) => void
  onAddToWishlist?: () => void
}

export default function ProductDetails({
  product,
  relatedProducts = [],
  onAddToCart,
  onAddToWishlist
}: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(
    product.images.find(img => img.isPrimary)?.url || product.images[0]?.url
  )
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const handleAddToCart = () => {
    setIsAddingToCart(true)
    if (onAddToCart) {
      onAddToCart(quantity, selectedSize)
    }
    setTimeout(() => setIsAddingToCart(false), 2000)
  }

  const discountPercentage = product.salePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100) 
    : 0

  const getRatingStars = (rating: number) => {
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

  const averageRating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length

  return (
    <div className="space-y-8">
      {/* Product Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative h-96 rounded-xl overflow-hidden bg-white/5">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.salePrice && (
              <span className="absolute top-4 right-4 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">
                -{discountPercentage}% OFF
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(image.url)}
                className={`relative h-20 rounded-lg overflow-hidden transition ${
                  selectedImage === image.url 
                    ? 'ring-2 ring-purple-500' 
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={image.url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          {/* Title & Category */}
          <div>
            <Link 
              href={`/categories/${product.category.toLowerCase()}`}
              className="text-sm text-purple-400 hover:text-purple-300 transition"
            >
              {product.category}
            </Link>
            <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400 text-lg">
                {getRatingStars(averageRating).map((star, i) => (
                  <span key={i}>{star}</span>
                ))}
              </div>
              <span className="text-sm text-gray-400">
                {averageRating.toFixed(1)} ({product.reviews.length} reviews)
              </span>
            </div>
            <span className="text-sm text-gray-400">SKU: {product.sku}</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            {product.salePrice ? (
              <>
                <span className="text-4xl font-bold text-purple-400">${product.salePrice}</span>
                <span className="text-xl text-gray-400 line-through">${product.price}</span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                  Save ${(product.price - product.salePrice).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-4xl font-bold">${product.price}</span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-green-400">In Stock</span>
                <span className="text-sm text-gray-400">({product.stock} available)</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span className="text-red-400">Out of Stock</span>
              </>
            )}
          </div>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <label className="block text-sm text-gray-400 mb-2">Select Size</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border transition ${
                      selectedSize === size
                        ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Quantity</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 bg-white/5 rounded-lg hover:bg-white/10 transition"
                disabled={product.stock === 0}
              >
                -
              </button>
              <span className="w-16 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                className="w-10 h-10 bg-white/5 rounded-lg hover:bg-white/10 transition"
                disabled={quantity >= product.stock || product.stock === 0}
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAddingToCart}
              className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isAddingToCart ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <span>🛒</span>
                  <span>Add to Cart</span>
                </>
              )}
            </button>
            
            <button
              onClick={onAddToWishlist}
              className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition"
            >
              ❤️
            </button>
          </div>

          {/* Materials & Specs Preview */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-white/5 rounded-lg">
            {product.material && (
              <div>
                <p className="text-xs text-gray-400">Material</p>
                <p className="text-sm font-medium">{product.material}</p>
              </div>
            )}
            {product.color && (
              <div>
                <p className="text-xs text-gray-400">Color</p>
                <p className="text-sm font-medium">{product.color}</p>
              </div>
            )}
            {product.dimensions && (
              <div>
                <p className="text-xs text-gray-400">Dimensions</p>
                <p className="text-sm font-medium">{product.dimensions}</p>
              </div>
            )}
            {product.weight && (
              <div>
                <p className="text-xs text-gray-400">Weight</p>
                <p className="text-sm font-medium">{product.weight}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10">
        <div className="flex gap-6">
          {['description', 'specifications', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 font-medium capitalize transition ${
                activeTab === tab 
                  ? 'text-purple-400 border-b-2 border-purple-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {activeTab === 'description' && (
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed">{product.description}</p>
          </div>
        )}

        {activeTab === 'specifications' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between p-2 border-b border-white/10">
                <span className="text-gray-400">Category</span>
                <span>{product.category}</span>
              </div>
              <div className="flex justify-between p-2 border-b border-white/10">
                <span className="text-gray-400">SKU</span>
                <span>{product.sku}</span>
              </div>
              {product.material && (
                <div className="flex justify-between p-2 border-b border-white/10">
                  <span className="text-gray-400">Material</span>
                  <span>{product.material}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              {product.color && (
                <div className="flex justify-between p-2 border-b border-white/10">
                  <span className="text-gray-400">Color</span>
                  <span>{product.color}</span>
                </div>
              )}
              {product.dimensions && (
                <div className="flex justify-between p-2 border-b border-white/10">
                  <span className="text-gray-400">Dimensions</span>
                  <span>{product.dimensions}</span>
                </div>
              )}
              {product.weight && (
                <div className="flex justify-between p-2 border-b border-white/10">
                  <span className="text-gray-400">Weight</span>
                  <span>{product.weight}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="p-4 bg-white/5 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{review.userName}</p>
                    <div className="flex text-yellow-400 text-sm mt-1">
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(5 - review.rating)}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-300 text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
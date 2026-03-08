'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: number
  salePrice?: number
  category: string
  images: string[]
  stock: number
  rating: number
  reviewCount: number
}

export default function ProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // API se product fetch karo
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        const data = await response.json()
        
        if (data.success) {
          setProduct(data.product)
          setSelectedImage(data.product.images[0] || '')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  const handleAddToCart = () => {
    if (!product) return
    alert(`Added ${quantity} ${product.name} to cart!`)
    // Yahan actual cart logic ayegi
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-400 mb-6">The product you're looking for doesn't exist.</p>
          <Link 
            href="/products" 
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:shadow-lg transition"
          >
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Simple Navbar */}
      <nav className="bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-purple-400">
              Leather Store
            </Link>
            <Link href="/products" className="text-white hover:text-purple-400">
              ← Back to Products
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images Section */}
          <div>
            <div className="relative h-96 rounded-xl overflow-hidden mb-4 bg-white/5">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.salePrice && (
                <span className="absolute top-4 right-4 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">
                  Sale
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`relative h-20 rounded-lg overflow-hidden transition ${
                    selectedImage === img ? 'ring-2 ring-purple-500' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-400">{product.category}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {'★'.repeat(Math.floor(product.rating))}
                {'☆'.repeat(5 - Math.floor(product.rating))}
              </div>
              <span className="text-gray-400">({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div>
              {product.salePrice ? (
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold text-purple-400">
                    ${product.salePrice}
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    ${product.price}
                  </span>
                </div>
              ) : (
                <span className="text-4xl font-bold">${product.price}</span>
              )}
            </div>

            {/* Stock Status */}
            <div>
              {product.stock > 0 ? (
                <p className="text-green-400">
                  ✓ In Stock ({product.stock} available)
                </p>
              ) : (
                <p className="text-red-400">✗ Out of Stock</p>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-300 leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Quantity</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-white/5 rounded-lg hover:bg-white/10 transition"
                  disabled={product.stock === 0}
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 bg-white/5 rounded-lg hover:bg-white/10 transition"
                  disabled={quantity >= product.stock || product.stock === 0}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50"
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

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
}

interface ProductsProps {
  title?: string
  subtitle?: string
  products?: Product[]
  viewAllLink?: string
}

export default function Products({
  title = 'Featured Products',
  subtitle = 'Discover our most popular leather creations',
  viewAllLink = '/products',
  products = defaultProducts
}: ProductsProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Auto-play carousel for mobile
  useEffect(() => {
    if (!isAutoPlaying || window.innerWidth >= 1024) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % products.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, products.length])

  // Get rating stars
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

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-purple-950/5 to-black"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          <p className="text-xl text-gray-400">{subtitle}</p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          {products.slice(0, 6).map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              isVisible={isVisible}
              isHovered={hoveredProduct === product.id}
              onHover={() => setHoveredProduct(product.id)}
              onLeave={() => setHoveredProduct(null)}
            />
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="lg:hidden">
          <div 
            className="relative overflow-hidden rounded-2xl"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {products.map((product) => (
                <div key={product.id} className="w-full flex-shrink-0 px-2">
                  <ProductCard
                    product={product}
                    index={0}
                    isVisible={true}
                    isMobile={true}
                  />
                </div>
              ))}
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {products.slice(0, 6).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentSlide
                      ? 'w-8 bg-gradient-to-r from-purple-500 to-pink-500'
                      : 'w-2 bg-white/30'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* View All Button */}
        <div className={`text-center mt-12 transition-all duration-700 delay-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <Link
            href={viewAllLink}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all group"
          >
            <span>View All Products</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

// Product Card Component
function ProductCard({ 
  product, 
  index, 
  isVisible, 
  isHovered = false,
  onHover,
  onLeave,
  isMobile = false
}: { 
  product: Product
  index: number
  isVisible: boolean
  isHovered?: boolean
  onHover?: () => void
  onLeave?: () => void
  isMobile?: boolean
}) {
  const ratingStars = getRatingStars(product.rating)

  return (
    <Link href={`/products/${product.id}`}>
      <div
        className={`group relative rounded-2xl overflow-hidden card-hover ${
          !isMobile && (isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0')
        }`}
        style={!isMobile ? { transitionDelay: `${index * 150}ms` } : undefined}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        {/* Image Container */}
        <div className="relative h-80 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {product.featured && (
              <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-semibold">
                Featured
              </span>
            )}
            {product.salePrice && (
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold border border-green-500/30">
                Sale
              </span>
            )}
          </div>

          {/* Hover Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-300">{product.category}</span>
              <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
              <span className="text-sm text-yellow-400">{product.rating} ★</span>
            </div>
            <Link
              href={`/products/${product.id}`}
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              View Details
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-lg font-bold mb-1">{product.name}</h3>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex text-yellow-400">
              {ratingStars.map((star, i) => (
                <span key={i}>{star}</span>
              ))}
            </div>
            <span className="text-xs text-gray-400">({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            {product.salePrice ? (
              <>
                <span className="text-xl font-bold text-purple-400">${product.salePrice}</span>
                <span className="text-sm text-gray-400 line-through">${product.price}</span>
              </>
            ) : (
              <span className="text-xl font-bold">${product.price}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

// Helper function for rating stars
function getRatingStars(rating: number): string[] {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  const stars: string[] = []

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

// Default products data
const defaultProducts: Product[] = [
  {
    id: 1,
    name: 'Premium Leather Bag',
    price: 299.99,
    salePrice: 249.99,
    image: '/n1.jpeg',
    category: 'Bags',
    rating: 4.8,
    reviews: 89,
    featured: true
  },
  {
    id: 2,
    name: 'Classic Leather Wallet',
    price: 89.99,
    image: '/n2.jpeg',
    category: 'Wallets',
    rating: 4.9,
    reviews: 256,
    featured: true
  },
  {
    id: 3,
    name: 'Handcrafted Leather Belt',
    price: 79.99,
    salePrice: 69.99,
    image: '/n3.jpeg',
    category: 'Belts',
    rating: 4.7,
    reviews: 89
  },
  {
    id: 4,
    name: 'Leather Card Holder',
    price: 49.99,
    image: '/n4.jpeg',
    category: 'Wallets',
    rating: 4.9,
    reviews: 312
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
    featured: true
  },
  {
    id: 6,
    name: 'Leather Keychain',
    price: 29.99,
    salePrice: 24.99,
    image: '/n6.jpeg',
    category: 'Accessories',
    rating: 4.9,
    reviews: 423
  }
]
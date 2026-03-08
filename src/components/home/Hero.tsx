'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface HeroProps {
  title?: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
  images?: string[]
}

export default function Hero({
  title = 'Premium Leather',
  subtitle = 'Crafted for Excellence by Hafiz Sajid Syed',
  ctaText = 'Shop Now',
  ctaLink = '/products',
  secondaryCtaText = 'Learn More',
  secondaryCtaLink = '/about',
  images = ['/n1.jpeg', '/n2.jpeg', '/n3.jpeg', '/n4.jpeg', '/n5.jpeg', '/n6.jpeg']
}: HeroProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Auto-rotate images
  useEffect(() => {
    setIsVisible(true)
    
    if (!isHovering) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isHovering, images.length])

  // Get color based on index for glowing effect
  const getGlowColor = (index: number) => {
    const colors = [
      'rgba(168, 85, 247, 0.5)', // purple
      'rgba(236, 72, 153, 0.5)',  // pink
      'rgba(59, 130, 246, 0.5)',  // blue
      'rgba(34, 197, 94, 0.5)',   // green
      'rgba(234, 179, 8, 0.5)',   // yellow
      'rgba(239, 68, 68, 0.5)'    // red
    ]
    return colors[index % colors.length]
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 z-10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15),transparent_70%)]"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 relative z-20">
        <div className={`text-center transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          {/* Bismillah */}
          <div className="text-emerald-400 text-xl md:text-2xl mb-6 animate-glow">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent animate-gradient">
              {title}
            </span>
            <br />
            <span className="text-3xl md:text-4xl text-gray-300 font-light">
              {subtitle}
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Discover our collection of handcrafted leather products where tradition meets modern elegance. 
            Each piece is meticulously crafted by Hafiz Sajid Syed.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href={ctaLink}
              className="group relative px-8 py-4 rounded-xl font-semibold text-lg overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"></span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-xl group-hover:blur-2xl transition-all"></span>
              <span className="relative flex items-center gap-2">
                {ctaText}
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </Link>
            
            <Link
              href={secondaryCtaLink}
              className="group px-8 py-4 rounded-xl font-semibold text-lg border border-white/20 hover:border-white/40 transition-all"
            >
              <span className="flex items-center gap-2">
                {secondaryCtaText}
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">15+</div>
              <div className="text-sm text-gray-400">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400">10k+</div>
              <div className="text-sm text-gray-400">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">100%</div>
              <div className="text-sm text-gray-400">Handcrafted</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Image Carousel */}
      <div className="absolute bottom-8 left-0 right-0">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-2 md:gap-4 overflow-x-auto pb-4">
            {images.map((image, index) => (
              <div
                key={index}
                className={`relative w-16 h-16 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 transition-all duration-500 transform hover:scale-110 hover:rotate-3 flex-shrink-0 ${
                  index === currentImageIndex 
                    ? 'border-purple-500 scale-110 shadow-[0_0_30px_rgba(168,85,247,0.5)]' 
                    : 'border-white/20 opacity-70'
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                  boxShadow: index === currentImageIndex ? `0 0 30px ${getGlowColor(index)}` : 'none'
                }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onClick={() => setCurrentImageIndex(index)}
              >
                <Image
                  src={image}
                  alt={`Leather Product ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 64px, 96px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentImageIndex
                    ? 'w-8 bg-gradient-to-r from-purple-500 to-pink-500'
                    : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}
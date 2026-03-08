'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'

interface Feature {
  icon: string
  title: string
  description: string
  color: 'purple' | 'pink' | 'blue' | 'green' | 'yellow' | 'red'
  link?: string
}

interface FeaturesProps {
  title?: string
  subtitle?: string
  features?: Feature[]
}

export default function Features({
  title = 'Why Choose Us',
  subtitle = 'Experience the finest leather craftsmanship',
  features = defaultFeatures
}: FeaturesProps) {
  const [isVisible, setIsVisible] = useState(false)
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

  // Get color classes
  const getColorClasses = (color: string) => {
    switch(color) {
      case 'purple':
        return {
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/20',
          text: 'text-purple-400',
          gradient: 'from-purple-500 to-pink-500',
          hover: 'hover:border-purple-500/50 hover:shadow-purple-500/20'
        }
      case 'pink':
        return {
          bg: 'bg-pink-500/10',
          border: 'border-pink-500/20',
          text: 'text-pink-400',
          gradient: 'from-pink-500 to-rose-500',
          hover: 'hover:border-pink-500/50 hover:shadow-pink-500/20'
        }
      case 'blue':
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/20',
          text: 'text-blue-400',
          gradient: 'from-blue-500 to-cyan-500',
          hover: 'hover:border-blue-500/50 hover:shadow-blue-500/20'
        }
      case 'green':
        return {
          bg: 'bg-green-500/10',
          border: 'border-green-500/20',
          text: 'text-green-400',
          gradient: 'from-green-500 to-emerald-500',
          hover: 'hover:border-green-500/50 hover:shadow-green-500/20'
        }
      case 'yellow':
        return {
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/20',
          text: 'text-yellow-400',
          gradient: 'from-yellow-500 to-orange-500',
          hover: 'hover:border-yellow-500/50 hover:shadow-yellow-500/20'
        }
      case 'red':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/20',
          text: 'text-red-400',
          gradient: 'from-red-500 to-pink-500',
          hover: 'hover:border-red-500/50 hover:shadow-red-500/20'
        }
      default:
        return {
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/20',
          text: 'text-purple-400',
          gradient: 'from-purple-500 to-pink-500',
          hover: 'hover:border-purple-500/50 hover:shadow-purple-500/20'
        }
    }
  }

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/5 to-black"></div>
      
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

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const colors = getColorClasses(feature.color)
            
            return (
              <div
                key={index}
                className={`group relative p-8 rounded-2xl border ${colors.border} ${colors.bg} backdrop-blur-sm transition-all duration-500 transform hover:-translate-y-2 ${colors.hover} ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-all duration-500`}></div>
                
                {/* Icon */}
                <div className={`text-5xl mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ${colors.text}`}>
                  {feature.icon}
                </div>
                
                {/* Title */}
                <h3 className={`text-xl font-bold mb-2 ${colors.text}`}>
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-400 mb-4">
                  {feature.description}
                </p>

                {/* Link */}
                {feature.link && (
                  <Link
                    href={feature.link}
                    className={`inline-flex items-center gap-2 text-sm ${colors.text} hover:gap-3 transition-all`}
                  >
                    Learn more
                    <span>→</span>
                  </Link>
                )}

                {/* Decorative Line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-12 transition-all duration-700 delay-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all group"
          >
            <span>View all features</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

// Default features data
const defaultFeatures: Feature[] = [
  {
    icon: '✨',
    title: 'Premium Quality',
    description: 'Handcrafted from the finest full-grain leather materials, ensuring durability and timeless beauty.',
    color: 'purple',
    link: '/about'
  },
  {
    icon: '🌟',
    title: 'Timeless Design',
    description: 'Classic styles that never go out of fashion, blending traditional craftsmanship with modern aesthetics.',
    color: 'pink',
    link: '/about'
  },
  {
    icon: '💪',
    title: 'Durable Craftsmanship',
    description: 'Built to last with superior stitching and reinforced stress points for everyday use.',
    color: 'blue',
    link: '/about'
  },
  {
    icon: '🌱',
    title: 'Sustainable Sourcing',
    description: 'Ethically sourced and eco-friendly materials from certified sustainable suppliers.',
    color: 'green',
    link: '/sustainability'
  },
  {
    icon: '⚡',
    title: 'Quick Delivery',
    description: 'Fast and secure worldwide shipping with real-time tracking and insurance.',
    color: 'yellow',
    link: '/shipping'
  },
  {
    icon: '💯',
    title: 'Satisfaction Guarantee',
    description: '100% satisfaction guarantee with easy returns and dedicated customer support.',
    color: 'red',
    link: '/returns'
  }
]
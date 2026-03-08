'use client'

import { useState, useEffect, useRef } from 'react'

interface HealthNoteProps {
  title?: string
  quote?: string
  quoteAuthor?: string
}

export default function HealthNote({
  title = 'The Importance of Health',
  quote = 'Health is the greatest gift, contentment the greatest wealth, faithfulness the best relationship.',
  quoteAuthor = 'Buddha'
}: HealthNoteProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
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

  // Auto-rotate health tips
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % healthTips.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const healthTips = [
    {
      icon: '💚',
      title: 'Physical Wellbeing',
      tip: 'Take care of your body. It\'s the only place you have to live.'
    },
    {
      icon: '🧠',
      title: 'Mental Health',
      tip: 'A calm mind brings inner strength and self-confidence.'
    },
    {
      icon: '🌿',
      title: 'Natural Living',
      tip: 'Choose natural materials. Your skin and environment will thank you.'
    },
    {
      icon: '💧',
      title: 'Hydration',
      tip: 'Drink water. Just like leather, your body needs hydration.'
    },
    {
      icon: '😊',
      title: 'Happiness',
      tip: 'Happiness is the highest form of health.'
    }
  ]

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* Background with leaves pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/30 via-black to-teal-950/30"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-6xl">🌿</div>
          <div className="absolute bottom-10 right-10 text-6xl">🍃</div>
          <div className="absolute top-1/2 left-1/4 text-4xl">🌱</div>
          <div className="absolute bottom-1/3 right-1/4 text-4xl">🌳</div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main Card */}
          <div
            className={`relative bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-emerald-500/20 transition-all duration-1000 transform ${
              isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
            }`}
          >
            {/* Glowing Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-50"></div>
            
            <div className="relative z-10">
              {/* Title */}
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  {title}
                </span>
              </h2>

              {/* Health Tips Carousel */}
              <div className="mb-8">
                <div className="flex justify-center mb-6">
                  <div className="text-7xl transform transition-all duration-500 hover:scale-110 hover:rotate-3">
                    {healthTips[activeIndex].icon}
                  </div>
                </div>
                
                <div className="text-center transition-all duration-500">
                  <h3 className="text-xl font-bold mb-2 text-emerald-400">
                    {healthTips[activeIndex].title}
                  </h3>
                  <p className="text-lg text-gray-300 italic">
                    "{healthTips[activeIndex].tip}"
                  </p>
                </div>

                {/* Carousel Indicators */}
                <div className="flex justify-center gap-2 mt-6">
                  {healthTips.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === activeIndex
                          ? 'w-8 bg-gradient-to-r from-emerald-400 to-cyan-400'
                          : 'w-2 bg-white/20 hover:bg-white/40'
                      }`}
                      aria-label={`View tip ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Main Content */}
              <div className="space-y-6 text-gray-300 border-t border-white/10 pt-8">
                <p className="text-lg leading-relaxed">
                  At <span className="text-emerald-400 font-semibold">Leather E-Commerce</span>, we believe that true luxury 
                  begins with wellbeing. Our commitment to health extends beyond our products to our community and 
                  environment. Just as we carefully craft each leather piece, we encourage you to craft a healthy lifestyle.
                </p>
                
                <p className="text-lg leading-relaxed">
                  We use only natural, sustainable materials that are safe for you and the planet. Our leather is 
                  processed without harmful chemicals, ensuring that every product you purchase contributes to your 
                  wellbeing and environmental health. The tanning process uses vegetable-based methods that are 
                  gentle on both your skin and the earth.
                </p>
                
                <p className="text-lg leading-relaxed">
                  Remember, taking care of your health is the most important investment you can make. Just as our 
                  leather products are designed to last a lifetime, we encourage you to cultivate habits that support 
                  your long-term health and happiness. A healthy you is a beautiful you.
                </p>
              </div>

              {/* Health Tips Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-8">
                {healthTips.map((tip, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`p-3 rounded-xl text-center transition-all ${
                      index === activeIndex
                        ? 'bg-emerald-500/20 border border-emerald-500/50'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-2xl mb-1">{tip.icon}</div>
                    <div className="text-xs text-gray-400">{tip.title}</div>
                  </button>
                ))}
              </div>

              {/* Quote */}
              <div className="mt-8 p-6 bg-white/5 rounded-xl border border-white/10">
                <p className="text-sm text-gray-400 italic text-center">
                  "{quote}"
                </p>
                <p className="text-xs text-gray-500 text-center mt-2">— {quoteAuthor}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">100%</div>
                  <div className="text-xs text-gray-400">Natural Materials</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-400">15+</div>
                  <div className="text-xs text-gray-400">Health Tips</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">5K+</div>
                  <div className="text-xs text-gray-400">Happy Bodies</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">∞</div>
                  <div className="text-xs text-gray-400">Wellness Journey</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
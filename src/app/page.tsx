'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// Simple Navbar component directly in the file
function SimpleNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Leather Store
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
            <Link href="/" className="px-4 py-2 text-white hover:text-purple-400">Home</Link>
            <Link href="/products" className="px-4 py-2 text-white hover:text-purple-400">Products</Link>
            <Link href="/about" className="px-4 py-2 text-white hover:text-purple-400">About</Link>
            <Link href="/contact" className="px-4 py-2 text-white hover:text-purple-400">Contact</Link>
            <Link href="/cart" className="px-4 py-2 text-white hover:text-purple-400">Cart</Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white text-2xl"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link href="/" className="block px-4 py-2 text-white hover:bg-purple-500/20 rounded">Home</Link>
            <Link href="/products" className="block px-4 py-2 text-white hover:bg-purple-500/20 rounded">Products</Link>
            <Link href="/about" className="block px-4 py-2 text-white hover:bg-purple-500/20 rounded">About</Link>
            <Link href="/contact" className="block px-4 py-2 text-white hover:bg-purple-500/20 rounded">Contact</Link>
            <Link href="/cart" className="block px-4 py-2 text-white hover:bg-purple-500/20 rounded">Cart</Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default function HomePage() {
  const [currentImage, setCurrentImage] = useState(0)

  const images = [
    '/n1.jpeg', '/n2.jpeg', '/n3.jpeg', 
    '/n4.jpeg', '/n5.jpeg', '/n6.jpeg'
  ]

  // Auto rotate images
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [images.length])

  return (
    <div className="min-h-screen bg-black text-white">
      <SimpleNavbar />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
            Premium Leather
          </span>
          <br />
          <span className="text-2xl md:text-4xl text-gray-300">
            by Hafiz Sajid Syed
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8">
          Handcrafted leather products with modern elegance
        </p>

        <div className="flex gap-4 justify-center">
          <Link href="/products" className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition">
            Shop Now
          </Link>
          <Link href="/about" className="px-6 py-3 bg-white/10 rounded-lg font-semibold hover:bg-white/20 transition">
            Learn More
          </Link>
        </div>

        {/* Image Grid */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {images.slice(0, 3).map((src, i) => (
            <div key={i} className="relative h-40 md:h-48 rounded-lg overflow-hidden">
              <Image src={src} alt={`Product ${i+1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-12 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Why Choose Us
          </span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[
            { icon: '✨', title: 'Premium Quality' },
            { icon: '🌟', title: 'Timeless Design' },
            { icon: '💪', title: 'Durable' },
            { icon: '🌱', title: 'Sustainable' }
          ].map((item, i) => (
            <div key={i} className="p-4 bg-white/5 rounded-xl text-center hover:bg-white/10 transition">
              <div className="text-3xl mb-2">{item.icon}</div>
              <h3 className="font-semibold">{item.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Featured Products
          </span>
        </h2>

        {/* Mobile Carousel */}
        <div className="md:hidden max-w-sm mx-auto">
          <div className="relative h-80 rounded-xl overflow-hidden">
            <Image 
              src={images[currentImage]} 
              alt="Product" 
              fill 
              className="object-cover"
            />
            
            {/* Dots */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`w-2 h-2 rounded-full ${
                    i === currentImage ? 'w-6 bg-purple-500' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-3 gap-6 max-w-5xl mx-auto">
          {images.slice(0, 3).map((src, i) => (
            <div key={i} className="group relative h-64 rounded-xl overflow-hidden">
              <Image src={src} alt={`Product ${i+1}`} fill className="object-cover group-hover:scale-110 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                <Link href={`/products/${i+1}`} className="text-purple-400 hover:text-purple-300">
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Health Note */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white/5 rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-green-400">
            The Importance of Health
          </h2>
          <p className="text-gray-300 text-center">
            Health is the foundation of a fulfilling life. We use only natural, 
            sustainable materials safe for you and the planet.
          </p>
        </div>
      </section>

      {/* Admin Info */}
      <section className="py-8 px-4 text-center">
        <div className="bg-purple-500/10 rounded-xl p-4 max-w-2xl mx-auto">
          <p className="text-gray-300">
            <span className="font-bold text-purple-400">Hafiz Sajid Syed</span> | 
            Email: <a href="mailto:sajid.syed@leather.com" className="text-purple-400 hover:underline">sajid.syed@leather.com</a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-5xl mx-auto text-center text-gray-400 text-sm">
          <p>© 2024 Leather E-Commerce. All rights reserved.</p>
          <p className="mt-2">Admin: Hafiz Sajid Syed | sajid.syed@leather.com</p>
        </div>
      </footer>
    </div>
  )
}
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Premium Leather Bag',
      price: 299.99,
      quantity: 1,
      image: '/n1.jpeg',
      size: 'Large'
    },
    {
      id: 2,
      name: 'Classic Leather Wallet',
      price: 89.99,
      quantity: 2,
      image: '/n2.jpeg',
      size: 'Standard'
    }
  ])

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 10
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
                Shopping Cart
              </span>
            </h1>
            <p className="text-xl text-gray-400">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-8xl mb-6">🛒</div>
              <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
              <p className="text-gray-400 mb-8">Looks like you haven't added anything yet</p>
              <Link
                href="/products"
                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all button-glow"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="glass-morphism rounded-2xl p-6 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all"
                  >
                    <div className="flex gap-6">
                      {/* Image */}
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <h3 className="text-lg font-semibold">{item.name}</h3>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                        
                        <p className="text-sm text-gray-400 mb-2">Size: {item.size}</p>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-purple-500/50 transition-all"
                            >
                              -
                            </button>
                            <span className="w-12 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-purple-500/50 transition-all"
                            >
                              +
                            </button>
                          </div>
                          
                          <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Continue Shopping */}
                <Link
                  href="/products"
                  className="inline-block mt-4 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  ← Continue Shopping
                </Link>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="glass-morphism rounded-2xl p-6 sticky top-32">
                  <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Order Summary
                  </h2>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-gray-400">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Tax (8%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-white/10 pt-3">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    href="/checkout"
                    className="block w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-center hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all button-glow"
                  >
                    Proceed to Checkout
                  </Link>
                  
                  <div className="mt-4 text-center text-sm text-gray-500">
                    <p>Secure checkout powered by</p>
                    <p className="text-purple-400">Leather E-Commerce</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
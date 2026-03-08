'use client'

import { useState, useEffect, useCallback } from 'react'

interface CartItem {
  id: number
  productId: number
  name: string
  price: number
  salePrice?: number
  quantity: number
  size?: string
  color?: string
  image: string
  maxQuantity?: number
}

interface Cart {
  id: string
  items: CartItem[]
  subtotal: number
  total: number
  itemCount: number
  shipping: number
  tax: number
  discount: number
  couponCode?: string
}

interface AddToCartParams {
  productId: number
  name: string
  price: number
  salePrice?: number
  quantity?: number
  size?: string
  color?: string
  image: string
  maxQuantity?: number
}

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load cart on mount
  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = useCallback(async () => {
    try {
      const response = await fetch('/api/cart')
      const data = await response.json()
      
      if (data.success) {
        setCart(data.cart)
      } else {
        setError(data.message || 'Failed to load cart')
      }
    } catch (error) {
      setError('Error loading cart')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addToCart = useCallback(async (params: AddToCartParams) => {
    setIsUpdating(true)
    setError(null)

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...params,
          quantity: params.quantity || 1
        }),
      })

      const data = await response.json()

      if (data.success) {
        setCart(data.cart)
        return { success: true }
      } else {
        setError(data.message || 'Failed to add to cart')
        return { success: false, error: data.message }
      }
    } catch (error: any) {
      setError(error.message || 'Error adding to cart')
      return { success: false, error: error.message }
    } finally {
      setIsUpdating(false)
    }
  }, [])

  const updateQuantity = useCallback(async (itemId: number, quantity: number) => {
    if (quantity < 0) return { success: false, error: 'Invalid quantity' }

    setIsUpdating(true)
    setError(null)

    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId, quantity }),
      })

      const data = await response.json()

      if (data.success) {
        setCart(data.cart)
        return { success: true }
      } else {
        setError(data.message || 'Failed to update cart')
        return { success: false, error: data.message }
      }
    } catch (error: any) {
      setError(error.message || 'Error updating cart')
      return { success: false, error: error.message }
    } finally {
      setIsUpdating(false)
    }
  }, [])

  const removeItem = useCallback(async (itemId: number) => {
    setIsUpdating(true)
    setError(null)

    try {
      const response = await fetch(`/api/cart?itemId=${itemId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        setCart(data.cart)
        return { success: true }
      } else {
        setError(data.message || 'Failed to remove item')
        return { success: false, error: data.message }
      }
    } catch (error: any) {
      setError(error.message || 'Error removing item')
      return { success: false, error: error.message }
    } finally {
      setIsUpdating(false)
    }
  }, [])

  const clearCart = useCallback(async () => {
    setIsUpdating(true)
    setError(null)

    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        setCart(data.cart)
        return { success: true }
      } else {
        setError(data.message || 'Failed to clear cart')
        return { success: false, error: data.message }
      }
    } catch (error: any) {
      setError(error.message || 'Error clearing cart')
      return { success: false, error: error.message }
    } finally {
      setIsUpdating(false)
    }
  }, [])

  const applyCoupon = useCallback(async (code: string) => {
    setIsUpdating(true)
    setError(null)

    try {
      // This would be your coupon API
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (code.toUpperCase() === 'SAVE20') {
        setCart(prev => prev ? {
          ...prev,
          discount: prev.subtotal * 0.2,
          couponCode: code,
          total: prev.subtotal + prev.tax + prev.shipping - (prev.subtotal * 0.2)
        } : null)
        return { success: true }
      } else {
        setError('Invalid coupon code')
        return { success: false, error: 'Invalid coupon code' }
      }
    } catch (error: any) {
      setError(error.message || 'Error applying coupon')
      return { success: false, error: error.message }
    } finally {
      setIsUpdating(false)
    }
  }, [])

  const getItemCount = useCallback(() => {
    return cart?.itemCount || 0
  }, [cart])

  const getSubtotal = useCallback(() => {
    return cart?.subtotal || 0
  }, [cart])

  const getTotal = useCallback(() => {
    return cart?.total || 0
  }, [cart])

  const isInCart = useCallback((productId: number) => {
    return cart?.items.some(item => item.productId === productId) || false
  }, [cart])

  const getItemQuantity = useCallback((productId: number) => {
    const item = cart?.items.find(item => item.productId === productId)
    return item?.quantity || 0
  }, [cart])

  return {
    cart,
    isLoading,
    isUpdating,
    error,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    getItemCount,
    getSubtotal,
    getTotal,
    isInCart,
    getItemQuantity,
    refreshCart: loadCart
  }
}

// Local storage cart hook (for guest users)
export function useLocalCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const STORAGE_KEY = 'local_cart'

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(STORAGE_KEY)
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (e) {
        console.error('Failed to parse cart from localStorage')
      }
    }
  }, [])

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  const addItem = useCallback((item: Omit<CartItem, 'id'>) => {
    setCart(prev => {
      const existingItem = prev.find(i => 
        i.productId === item.productId && 
        i.size === item.size && 
        i.color === item.color
      )

      if (existingItem) {
        return prev.map(i =>
          i.productId === item.productId && i.size === item.size && i.color === item.color
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        )
      }

      return [...prev, { ...item, id: Date.now(), quantity: item.quantity || 1 }]
    })
  }, [])

  const updateItemQuantity = useCallback((itemId: number, quantity: number) => {
    if (quantity < 0) return
    if (quantity === 0) {
      setCart(prev => prev.filter(item => item.id !== itemId))
    } else {
      setCart(prev => prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      ))
    }
  }, [])

  const removeItem = useCallback((itemId: number) => {
    setCart(prev => prev.filter(item => item.id !== itemId))
  }, [])

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  const getTotal = useCallback(() => {
    return cart.reduce((sum, item) => {
      const price = item.salePrice || item.price
      return sum + (price * item.quantity)
    }, 0)
  }, [cart])

  const getItemCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }, [cart])

  return {
    cart,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    getTotal,
    getItemCount
  }
}
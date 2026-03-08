'use client'

import { useState, useEffect, useCallback } from 'react'

interface OrderItem {
  id: number
  productId: number
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
  image: string
}

interface Order {
  id: string
  userId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentMethod: string
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  billingAddress?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  notes?: string
  createdAt: string
  updatedAt: string
}

interface OrdersFilters {
  status?: string
  paymentStatus?: string
  startDate?: string
  endDate?: string
  search?: string
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  pages: number
  hasNext: boolean
  hasPrev: boolean
}

export function useOrders(options?: { autoLoad?: boolean }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<OrdersFilters>({})
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false
  })

  const loadOrders = useCallback(async (page: number = 1) => {
    setIsLoading(page === 1)
    if (page > 1) setIsLoadingMore(true)
    setError(null)

    try {
      // Build query params
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.status && { status: filters.status }),
        ...(filters.paymentStatus && { paymentStatus: filters.paymentStatus }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.search && { search: filters.search })
      })

      const response = await fetch(`/api/orders?${params}`)
      const data = await response.json()

      if (data.success) {
        setOrders(prev => page === 1 ? data.orders : [...prev, ...data.orders])
        setPagination(data.pagination)
      } else {
        setError(data.message || 'Failed to load orders')
      }
    } catch (error) {
      setError('Error loading orders')
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }, [pagination.limit, filters])

  const loadOrder = useCallback(async (orderId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/orders/${orderId}`)
      const data = await response.json()

      if (data.success) {
        setCurrentOrder(data.order)
      } else {
        setError(data.message || 'Failed to load order')
      }
    } catch (error) {
      setError('Error loading order')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createOrder = useCallback(async (orderData: Partial<Order>) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      const data = await response.json()

      if (data.success) {
        setOrders(prev => [data.order, ...prev])
        return { success: true, order: data.order }
      } else {
        setError(data.message || 'Failed to create order')
        return { success: false, error: data.message }
      }
    } catch (error: any) {
      setError(error.message || 'Error creating order')
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateOrderStatus = useCallback(async (orderId: string, status: string) => {
    setError(null)

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      const data = await response.json()

      if (data.success) {
        // Update in orders list
        setOrders(prev => prev.map(order =>
          order.id === orderId ? { ...order, status: status as any } : order
        ))
        
        // Update current order if loaded
        if (currentOrder?.id === orderId) {
          setCurrentOrder(prev => prev ? { ...prev, status: status as any } : null)
        }

        return { success: true }
      } else {
        setError(data.message || 'Failed to update order')
        return { success: false, error: data.message }
      }
    } catch (error: any) {
      setError(error.message || 'Error updating order')
      return { success: false, error: error.message }
    }
  }, [currentOrder])

  const cancelOrder = useCallback(async (orderId: string) => {
    setError(null)

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        // Update in orders list
        setOrders(prev => prev.map(order =>
          order.id === orderId ? { ...order, status: 'cancelled' as const } : order
        ))
        
        // Update current order if loaded
        if (currentOrder?.id === orderId) {
          setCurrentOrder(prev => prev ? { ...prev, status: 'cancelled' } : null)
        }

        return { success: true }
      } else {
        setError(data.message || 'Failed to cancel order')
        return { success: false, error: data.message }
      }
    } catch (error: any) {
      setError(error.message || 'Error cancelling order')
      return { success: false, error: error.message }
    }
  }, [currentOrder])

  const updateFilters = useCallback((newFilters: OrdersFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    // Reset to page 1 when filters change
    loadOrders(1)
  }, [loadOrders])

  const loadMore = useCallback(() => {
    if (pagination.hasNext && !isLoadingMore) {
      loadOrders(pagination.page + 1)
    }
  }, [pagination.hasNext, pagination.page, isLoadingMore, loadOrders])

  // Load orders on mount if autoLoad is true
  useEffect(() => {
    if (options?.autoLoad !== false) {
      loadOrders()
    }
  }, [loadOrders, options?.autoLoad])

  // Calculate stats
  const stats = {
    total: pagination.total,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0)
  }

  return {
    orders,
    currentOrder,
    isLoading,
    isLoadingMore,
    error,
    filters,
    pagination,
    stats,
    loadOrders,
    loadOrder,
    createOrder,
    updateOrderStatus,
    cancelOrder,
    updateFilters,
    loadMore
  }
}

// User orders hook (for customers)
export function useUserOrders(userId?: string) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userId) {
      loadUserOrders()
    }
  }, [userId])

  const loadUserOrders = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // This would be your API endpoint for user-specific orders
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      setOrders([
        {
          id: 'ORD-001',
          userId: userId || '',
          customerName: 'John Smith',
          customerEmail: 'john@example.com',
          items: [],
          subtotal: 299.99,
          tax: 24.00,
          shipping: 10,
          total: 333.99,
          status: 'delivered',
          paymentStatus: 'paid',
          paymentMethod: 'card',
          shippingAddress: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ])
    } catch (error) {
      setError('Error loading orders')
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  return {
    orders,
    isLoading,
    error,
    refresh: loadUserOrders
  }
}
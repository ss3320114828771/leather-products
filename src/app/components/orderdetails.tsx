'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

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
  customerName: string
  customerEmail: string
  customerPhone: string
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

export default function OrderDetails() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (params?.id) {
      fetchOrder()
    }
  }, [params?.id])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        setOrder(data.order)
      } else {
        setError(data.message || 'Failed to load order')
      }
    } catch (error) {
      setError('Error loading order')
    } finally {
      setIsLoading(false)
    }
  }

  const updateOrderStatus = async (status: string) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/orders/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })
      const data = await response.json()
      
      if (data.success) {
        setOrder(data.order)
      }
    } catch (error) {
      console.error('Error updating order:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const cancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return
    
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/orders/${params.id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      
      if (data.success) {
        setOrder(data.order)
      }
    } catch (error) {
      console.error('Error cancelling order:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'delivered': return 'text-green-400 bg-green-500/20'
      case 'shipped': return 'text-blue-400 bg-blue-500/20'
      case 'processing': return 'text-yellow-400 bg-yellow-500/20'
      case 'pending': return 'text-orange-400 bg-orange-500/20'
      case 'cancelled': return 'text-red-400 bg-red-500/20'
      default: return 'text-gray-400 bg-white/10'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch(status) {
      case 'paid': return 'text-green-400'
      case 'pending': return 'text-yellow-400'
      case 'failed': return 'text-red-400'
      case 'refunded': return 'text-blue-400'
      default: return 'text-gray-400'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold mb-2">Error</h2>
        <p className="text-gray-400">{error || 'Order not found'}</p>
        <Link href="/orders" className="inline-block mt-4 text-purple-400 hover:text-purple-300">
          Back to Orders
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <Link href="/orders" className="text-sm text-gray-400 hover:text-white mb-2 inline-block">
          ← Back to Orders
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Order {order.id}
              </span>
            </h1>
            <p className="text-gray-400 text-sm">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm ${getPaymentStatusColor(order.paymentStatus)} bg-white/5`}>
              {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white/5 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-bold mb-4 text-purple-400">Order Items</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 border-b border-white/10 pb-4 last:border-0">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-400">
                  ${item.price} x {item.quantity}
                  {item.size && ` • Size: ${item.size}`}
                  {item.color && ` • Color: ${item.color}`}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white/5 rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4 text-purple-400">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Tax (8%)</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Shipping</span>
              <span>${order.shipping.toFixed(2)}</span>
            </div>
            <div className="border-t border-white/10 pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-purple-400">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4 text-purple-400">Payment Information</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Method</span>
              <span>{order.paymentMethod.replace('_', ' ').toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status</span>
              <span className={getPaymentStatusColor(order.paymentStatus)}>
                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white/5 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-bold mb-4 text-purple-400">Shipping Address</h2>
        <div className="space-y-1 text-gray-300">
          <p>{order.customerName}</p>
          <p>{order.shippingAddress.street}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
          <p>{order.shippingAddress.country}</p>
          <p className="mt-2">Phone: {order.customerPhone}</p>
          <p>Email: {order.customerEmail}</p>
        </div>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="bg-white/5 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold mb-2 text-purple-400">Order Notes</h2>
          <p className="text-gray-300">{order.notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {order.status === 'pending' && (
          <>
            <button
              onClick={() => updateOrderStatus('processing')}
              disabled={isUpdating}
              className="px-6 py-3 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition disabled:opacity-50"
            >
              Process Order
            </button>
            <button
              onClick={cancelOrder}
              disabled={isUpdating}
              className="px-6 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition disabled:opacity-50"
            >
              Cancel Order
            </button>
          </>
        )}
        {order.status === 'processing' && (
          <button
            onClick={() => updateOrderStatus('shipped')}
            disabled={isUpdating}
            className="px-6 py-3 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition disabled:opacity-50"
          >
            Mark as Shipped
          </button>
        )}
        {order.status === 'shipped' && (
          <button
            onClick={() => updateOrderStatus('delivered')}
            disabled={isUpdating}
            className="px-6 py-3 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition disabled:opacity-50"
          >
            Mark as Delivered
          </button>
        )}
      </div>
    </div>
  )
}
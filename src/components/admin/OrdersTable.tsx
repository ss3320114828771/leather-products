'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Order {
  id: string
  customer: string
  email: string
  amount: number
  items: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment: 'pending' | 'paid' | 'failed' | 'refunded'
  date: string
}

interface OrdersTableProps {
  orders: Order[]
  onStatusChange?: (orderId: string, newStatus: string) => void
  showActions?: boolean
}

export default function OrdersTable({ orders, onStatusChange, showActions = true }: OrdersTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Filter orders by status
  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus)

  // Get status color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'delivered': return 'bg-green-500/20 text-green-400'
      case 'shipped': return 'bg-blue-500/20 text-blue-400'
      case 'processing': return 'bg-yellow-500/20 text-yellow-400'
      case 'pending': return 'bg-orange-500/20 text-orange-400'
      case 'cancelled': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  // Get payment status color
  const getPaymentColor = (status: string) => {
    switch(status) {
      case 'paid': return 'text-green-400'
      case 'pending': return 'text-yellow-400'
      case 'failed': return 'text-red-400'
      case 'refunded': return 'text-blue-400'
      default: return 'text-gray-400'
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  // Status options for dropdown
  const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

  // Toggle row expansion
  const toggleRow = (orderId: string) => {
    setExpandedRow(expandedRow === orderId ? null : orderId)
  }

  return (
    <div className="w-full">
      {/* Filter Bar */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 rounded-lg text-sm transition ${
            filterStatus === 'all'
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          All Orders
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          className={`px-3 py-1.5 rounded-lg text-sm transition ${
            filterStatus === 'pending'
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilterStatus('processing')}
          className={`px-3 py-1.5 rounded-lg text-sm transition ${
            filterStatus === 'processing'
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          Processing
        </button>
        <button
          onClick={() => setFilterStatus('shipped')}
          className={`px-3 py-1.5 rounded-lg text-sm transition ${
            filterStatus === 'shipped'
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          Shipped
        </button>
        <button
          onClick={() => setFilterStatus('delivered')}
          className={`px-3 py-1.5 rounded-lg text-sm transition ${
            filterStatus === 'delivered'
              ? 'bg-green-500/20 text-green-400 border border-green-500/50'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          Delivered
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/10">
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Order ID</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Customer</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Amount</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Items</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Status</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Payment</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Date</th>
                {showActions && <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={showActions ? 8 : 7} className="text-center py-8 text-gray-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-white/10 hover:bg-white/5 transition">
                    <td className="py-4 px-4">
                      <Link href={`/admin/orders/${order.id}`} className="text-purple-400 hover:text-purple-300 font-medium">
                        {order.id}
                      </Link>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-xs text-gray-400">{order.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold">{formatCurrency(order.amount)}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p>{order.items} items</p>
                    </td>
                    <td className="py-4 px-4">
                      {showActions && onStatusChange ? (
                        <select
                          value={order.status}
                          onChange={(e) => onStatusChange(order.id, e.target.value)}
                          className={`px-2 py-1 rounded-lg text-xs ${getStatusColor(order.status)} border-0 focus:ring-2 focus:ring-purple-500`}
                        >
                          {statusOptions.map(option => (
                            <option key={option} value={option} className="bg-gray-900">
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-xs ${getPaymentColor(order.payment)}`}>
                        {order.payment.charAt(0).toUpperCase() + order.payment.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm">{formatDate(order.date)}</p>
                    </td>
                    {showActions && (
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="px-3 py-1 bg-white/5 rounded-lg text-xs hover:bg-white/10 transition"
                          >
                            View
                          </Link>
                          <button className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-xs hover:bg-purple-500/30 transition">
                            Edit
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8 bg-white/5 rounded-xl text-gray-400">
            No orders found
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white/5 rounded-xl p-4">
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <Link href={`/admin/orders/${order.id}`} className="text-purple-400 hover:text-purple-300 font-medium">
                    {order.id}
                  </Link>
                  <p className="text-sm font-medium mt-1">{order.customer}</p>
                  <p className="text-xs text-gray-400">{order.email}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div>
                  <p className="text-xs text-gray-400">Amount</p>
                  <p className="font-bold">{formatCurrency(order.amount)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Items</p>
                  <p>{order.items} items</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Payment</p>
                  <p className={getPaymentColor(order.payment)}>
                    {order.payment.charAt(0).toUpperCase() + order.payment.slice(1)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Date</p>
                  <p>{formatDate(order.date)}</p>
                </div>
              </div>

              {/* Expandable Section */}
              <button
                onClick={() => toggleRow(order.id)}
                className="w-full text-left text-xs text-gray-400 hover:text-white transition flex items-center justify-between"
              >
                <span>{expandedRow === order.id ? 'Show less' : 'Show more'}</span>
                <span>{expandedRow === order.id ? '▲' : '▼'}</span>
              </button>

              {expandedRow === order.id && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  {showActions && onStatusChange && (
                    <div className="mb-3">
                      <label className="block text-xs text-gray-400 mb-1">Update Status</label>
                      <select
                        value={order.status}
                        onChange={(e) => onStatusChange(order.id, e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg text-sm ${getStatusColor(order.status)} bg-white/5 border-0`}
                      >
                        {statusOptions.map(option => (
                          <option key={option} value={option} className="bg-gray-900">
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="flex-1 px-3 py-2 bg-white/5 rounded-lg text-sm text-center hover:bg-white/10 transition"
                    >
                      View Details
                    </Link>
                    <button className="flex-1 px-3 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm hover:bg-purple-500/30 transition">
                      Edit
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
        <p>Showing {filteredOrders.length} of {orders.length} orders</p>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-white/5 rounded-lg hover:bg-white/10 transition">
            Previous
          </button>
          <button className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition">
            1
          </button>
          <button className="px-3 py-1 bg-white/5 rounded-lg hover:bg-white/10 transition">
            2
          </button>
          <button className="px-3 py-1 bg-white/5 rounded-lg hover:bg-white/10 transition">
            3
          </button>
          <button className="px-3 py-1 bg-white/5 rounded-lg hover:bg-white/10 transition">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
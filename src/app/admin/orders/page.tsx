'use client'

import { useState } from 'react'
import Link from 'next/link'

// Simple Admin Navbar
function AdminNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/admin" className="text-xl font-bold text-purple-400">
            Admin Panel
          </Link>
          
          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm text-gray-400">Hafiz Sajid Syed</span>
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
              <span className="text-sm">👑</span>
            </div>
          </div>

          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white text-2xl"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4">
            <Link href="/admin" className="block py-2 text-white hover:text-purple-400">Dashboard</Link>
            <Link href="/admin/orders" className="block py-2 text-white hover:text-purple-400">Orders</Link>
            <Link href="/admin/products" className="block py-2 text-white hover:text-purple-400">Products</Link>
            <Link href="/admin/users" className="block py-2 text-white hover:text-purple-400">Users</Link>
          </div>
        )}
      </div>
    </nav>
  )
}

// Stats Card Component
function StatsCard({ title, value, icon, color }: { title: string; value: string; icon: string; color: string }) {
  const getColorClass = () => {
    switch(color) {
      case 'purple': return 'from-purple-500 to-pink-500'
      case 'blue': return 'from-blue-500 to-cyan-500'
      case 'green': return 'from-green-500 to-emerald-500'
      case 'yellow': return 'from-yellow-500 to-orange-500'
      default: return 'from-purple-500 to-pink-500'
    }
  }

  return (
    <div className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition border border-white/10">
      <div className="flex justify-between items-start mb-4">
        <div className={`text-3xl bg-gradient-to-r ${getColorClass()} bg-clip-text text-transparent`}>
          {icon}
        </div>
        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">+8%</span>
      </div>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-sm text-gray-400">{title}</p>
    </div>
  )
}

// Filter Bar Component
function FilterBar({ 
  filter, 
  setFilter,
  search,
  setSearch
}: { 
  filter: string
  setFilter: (filter: string) => void
  search: string
  setSearch: (search: string) => void
}) {
  const filters = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search orders by ID, customer, or email..."
          className="w-full px-4 py-2 pl-10 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition text-white"
        />
        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-lg text-sm transition ${
              filter === f 
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  )
}

// Order Row Component
function OrderRow({ order }: { order: any }) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Delivered': return 'text-green-400 bg-green-500/20'
      case 'Shipped': return 'text-blue-400 bg-blue-500/20'
      case 'Processing': return 'text-yellow-400 bg-yellow-500/20'
      case 'Pending': return 'text-orange-400 bg-orange-500/20'
      case 'Cancelled': return 'text-red-400 bg-red-500/20'
      default: return 'text-gray-400 bg-white/10'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch(status) {
      case 'Paid': return 'text-green-400'
      case 'Pending': return 'text-yellow-400'
      case 'Failed': return 'text-red-400'
      case 'Refunded': return 'text-blue-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <tr className="border-b border-white/10 hover:bg-white/5 transition">
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
        <p className="font-medium">${order.total}</p>
        <p className="text-xs text-gray-400">{order.items} items</p>
      </td>
      <td className="py-4 px-4">
        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </td>
      <td className="py-4 px-4">
        <span className={`text-xs ${getPaymentStatusColor(order.payment)}`}>
          {order.payment}
        </span>
      </td>
      <td className="py-4 px-4">
        <p className="text-sm">{order.date}</p>
      </td>
      <td className="py-4 px-4">
        <div className="flex gap-2">
          <Link 
            href={`/admin/orders/${order.id}`}
            className="px-3 py-1 bg-white/5 rounded-lg text-xs hover:bg-white/10 transition"
          >
            View
          </Link>
          <button className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-xs hover:bg-purple-500/30 transition">
            Update
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  // Mock orders data
  const orders = [
    {
      id: '#ORD-001',
      customer: 'John Smith',
      email: 'john.smith@email.com',
      total: '299.99',
      items: 3,
      status: 'Delivered',
      payment: 'Paid',
      date: '2024-01-15',
      address: '123 Main St, New York, NY'
    },
    {
      id: '#ORD-002',
      customer: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      total: '89.99',
      items: 1,
      status: 'Shipped',
      payment: 'Paid',
      date: '2024-01-14',
      address: '456 Oak Ave, Los Angeles, CA'
    },
    {
      id: '#ORD-003',
      customer: 'Mike Chen',
      email: 'mike.chen@email.com',
      total: '459.99',
      items: 4,
      status: 'Processing',
      payment: 'Paid',
      date: '2024-01-13',
      address: '789 Pine St, Chicago, IL'
    },
    {
      id: '#ORD-004',
      customer: 'Emma Wilson',
      email: 'emma.w@email.com',
      total: '129.99',
      items: 2,
      status: 'Pending',
      payment: 'Pending',
      date: '2024-01-12',
      address: '321 Elm Rd, Miami, FL'
    },
    {
      id: '#ORD-005',
      customer: 'David Brown',
      email: 'david.b@email.com',
      total: '199.99',
      items: 2,
      status: 'Cancelled',
      payment: 'Refunded',
      date: '2024-01-11',
      address: '654 Cedar Ln, Dallas, TX'
    },
    {
      id: '#ORD-006',
      customer: 'Lisa Garcia',
      email: 'lisa.g@email.com',
      total: '349.99',
      items: 3,
      status: 'Delivered',
      payment: 'Paid',
      date: '2024-01-10',
      address: '987 Birch Dr, Seattle, WA'
    },
    {
      id: '#ORD-007',
      customer: 'James Lee',
      email: 'james.lee@email.com',
      total: '79.99',
      items: 1,
      status: 'Processing',
      payment: 'Paid',
      date: '2024-01-09',
      address: '147 Spruce Way, Boston, MA'
    },
    {
      id: '#ORD-008',
      customer: 'Hafiz Sajid Syed',
      email: 'sajid.syed@leather.com',
      total: '599.99',
      items: 5,
      status: 'Delivered',
      payment: 'Paid',
      date: '2024-01-08',
      address: 'Admin Office, New York, NY'
    }
  ]

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'All' || order.status === filter
    const matchesSearch = 
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.email.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Calculate stats
  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0).toFixed(2)
  const totalOrders = orders.length
  const pendingOrders = orders.filter(o => o.status === 'Pending').length
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length

  return (
    <div className="min-h-screen bg-black text-white">
      <AdminNavbar />

      <main className="pt-20 pb-10 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Orders Management
                </span>
              </h1>
              <p className="text-gray-400 text-sm">Manage and track all customer orders</p>
            </div>
            
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition">
                📊 Export
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition">
                + New Order
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard title="Total Orders" value={totalOrders.toString()} icon="📦" color="purple" />
            <StatsCard title="Total Revenue" value={`$${totalRevenue}`} icon="💰" color="green" />
            <StatsCard title="Pending Orders" value={pendingOrders.toString()} icon="⏳" color="yellow" />
            <StatsCard title="Delivered" value={deliveredOrders.toString()} icon="✅" color="blue" />
          </div>

          {/* Filters */}
          <div className="mb-6">
            <FilterBar 
              filter={filter}
              setFilter={setFilter}
              search={search}
              setSearch={setSearch}
            />
          </div>

          {/* Orders Table */}
          <div className="bg-white/5 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/10">
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Order ID</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Customer</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Total</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Status</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Payment</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Date</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-400">
                        No orders found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order, index) => (
                      <OrderRow key={index} order={order} />
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center p-4 border-t border-white/10">
              <p className="text-sm text-gray-400">
                Showing {filteredOrders.length} of {orders.length} orders
              </p>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition">
                  Previous
                </button>
                <button className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm hover:bg-purple-500/30 transition">
                  1
                </button>
                <button className="px-3 py-1 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition">
                  2
                </button>
                <button className="px-3 py-1 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition">
                  3
                </button>
                <button className="px-3 py-1 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition">
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Quick Summary */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-2 text-purple-400">Today's Orders</h4>
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-gray-400">↑ 3 from yesterday</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-2 text-purple-400">Average Order Value</h4>
              <p className="text-2xl font-bold">$189.99</p>
              <p className="text-xs text-gray-400">↑ 5% this week</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-2 text-purple-400">Top Product</h4>
              <p className="text-2xl font-bold">Leather Bag</p>
              <p className="text-xs text-gray-400">45 units sold</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
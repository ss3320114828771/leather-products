'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const stats = [
    { label: 'Total Orders', value: '1,234', change: '+12%', icon: '📦', color: 'from-purple-500 to-pink-500' },
    { label: 'Total Revenue', value: '$89,432', change: '+23%', icon: '💰', color: 'from-blue-500 to-cyan-500' },
    { label: 'Total Products', value: '156', change: '+5%', icon: '🛍️', color: 'from-green-500 to-emerald-500' },
    { label: 'Total Users', value: '3,421', change: '+18%', icon: '👥', color: 'from-yellow-500 to-orange-500' },
  ]

  const recentOrders = [
    { id: '#12345', customer: 'John Doe', amount: '$299.99', status: 'Pending', date: '2024-01-15' },
    { id: '#12346', customer: 'Jane Smith', amount: '$89.99', status: 'Shipped', date: '2024-01-14' },
    { id: '#12347', customer: 'Bob Johnson', amount: '$179.99', status: 'Delivered', date: '2024-01-13' },
    { id: '#12348', customer: 'Alice Brown', amount: '$459.99', status: 'Processing', date: '2024-01-12' },
  ]

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
                  Admin Dashboard
                </span>
              </h1>
              <p className="text-gray-400">Welcome back, Hafiz Sajid Syed</p>
            </div>
            
            <div className="flex gap-3">
              <button className="px-4 py-2 glass-morphism rounded-xl hover:bg-white/10 transition-all">
                ⚙️ Settings
              </button>
              <button className="px-4 py-2 glass-morphism rounded-xl hover:bg-white/10 transition-all">
                📊 Reports
              </button>
            </div>
          </div>

          {/* Admin Tabs */}
          <div className="flex flex-wrap gap-4 mb-8">
            {['dashboard', 'orders', 'products', 'users', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 capitalize button-glow ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_30px_rgba(168,85,247,0.5)]'
                    : 'glass-morphism hover:bg-white/20'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`group relative p-6 rounded-2xl glass-morphism hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] transition-all duration-500`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-all duration-500`}></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-3xl">{stat.icon}</div>
                    <div className="px-2 py-1 bg-green-500/20 rounded-lg text-green-500 text-sm">
                      {stat.change}
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                  <p className="text-gray-400">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="glass-morphism rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Recent Orders
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Order ID</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Customer</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">{order.id}</td>
                      <td className="py-3 px-4">{order.customer}</td>
                      <td className="py-3 px-4">{order.amount}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-lg text-sm ${
                          order.status === 'Delivered' ? 'bg-green-500/20 text-green-500' :
                          order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-500' :
                          order.status === 'Processing' ? 'bg-yellow-500/20 text-yellow-500' :
                          'bg-orange-500/20 text-orange-500'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">{order.date}</td>
                      <td className="py-3 px-4">
                        <button className="text-purple-400 hover:text-purple-300 transition-colors">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/admin/products/new"
              className="group p-6 rounded-2xl glass-morphism hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] transition-all"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">➕</div>
              <h3 className="text-lg font-semibold mb-1">Add New Product</h3>
              <p className="text-sm text-gray-400">Create a new product listing</p>
            </Link>
            
            <Link
              href="/admin/orders"
              className="group p-6 rounded-2xl glass-morphism hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] transition-all"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📋</div>
              <h3 className="text-lg font-semibold mb-1">Manage Orders</h3>
              <p className="text-sm text-gray-400">View and update orders</p>
            </Link>
            
            <Link
              href="/admin/users"
              className="group p-6 rounded-2xl glass-morphism hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] transition-all"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">👥</div>
              <h3 className="text-lg font-semibold mb-1">User Management</h3>
              <p className="text-sm text-gray-400">Manage customer accounts</p>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
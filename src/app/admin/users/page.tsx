'use client'

import { useState } from 'react'
import Image from 'next/image'
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
  setSearch,
  roleFilter,
  setRoleFilter
}: { 
  filter: string
  setFilter: (filter: string) => void
  search: string
  setSearch: (search: string) => void
  roleFilter: string
  setRoleFilter: (role: string) => void
}) {
  const filters = ['All', 'Active', 'Inactive', 'New']
  const roles = ['All Roles', 'Admin', 'Customer', 'Staff']

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users by name, email, or ID..."
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

      {/* Role Filter */}
      <div className="flex flex-wrap gap-2">
        {roles.map(role => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`px-3 py-1 rounded-lg text-sm transition ${
              roleFilter === role 
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {role}
          </button>
        ))}
      </div>
    </div>
  )
}

// User Card Component
function UserCard({ user }: { user: any }) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'text-green-400 bg-green-500/20'
      case 'Inactive': return 'text-gray-400 bg-white/10'
      case 'New': return 'text-blue-400 bg-blue-500/20'
      default: return 'text-gray-400 bg-white/10'
    }
  }

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'Admin': return 'text-purple-400 bg-purple-500/20'
      case 'Staff': return 'text-blue-400 bg-blue-500/20'
      case 'Customer': return 'text-green-400 bg-green-500/20'
      default: return 'text-gray-400 bg-white/10'
    }
  }

  return (
    <div className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition border border-white/10 hover:border-purple-500/50">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-purple-500/20 flex items-center justify-center">
            {user.avatar ? (
              <Image src={user.avatar} alt={user.name} fill className="object-cover" />
            ) : (
              <span className="text-2xl">{user.name[0]}</span>
            )}
          </div>
          <div>
            <h3 className="font-bold">{user.name}</h3>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(user.status)}`}>
          {user.status}
        </span>
      </div>

      <div className="space-y-3">
        {/* Role */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Role</span>
          <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(user.role)}`}>
            {user.role}
          </span>
        </div>

        {/* Orders */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Total Orders</span>
          <span className="font-medium">{user.orders}</span>
        </div>

        {/* Spent */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Total Spent</span>
          <span className="font-medium">${user.spent}</span>
        </div>

        {/* Joined */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Joined</span>
          <span className="text-sm text-gray-300">{user.joined}</span>
        </div>

        {/* Last Active */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Last Active</span>
          <span className="text-sm text-gray-300">{user.lastActive}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        <button className="flex-1 px-3 py-2 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition">
          View Details
        </button>
        <button className="flex-1 px-3 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm hover:bg-purple-500/30 transition">
          Edit
        </button>
      </div>
    </div>
  )
}

// User Table Row Component
function UserRow({ user }: { user: any }) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'text-green-400'
      case 'Inactive': return 'text-gray-400'
      case 'New': return 'text-blue-400'
      default: return 'text-gray-400'
    }
  }

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'Admin': return 'text-purple-400'
      case 'Staff': return 'text-blue-400'
      case 'Customer': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <tr className="border-b border-white/10 hover:bg-white/5 transition">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-purple-500/20 flex items-center justify-center">
            {user.avatar ? (
              <Image src={user.avatar} alt={user.name} fill className="object-cover" />
            ) : (
              <span>{user.name[0]}</span>
            )}
          </div>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-gray-400">ID: {user.id}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <p className="text-sm">{user.email}</p>
      </td>
      <td className="py-4 px-4">
        <span className={`text-sm ${getRoleColor(user.role)}`}>{user.role}</span>
      </td>
      <td className="py-4 px-4">
        <span className={`text-sm ${getStatusColor(user.status)}`}>{user.status}</span>
      </td>
      <td className="py-4 px-4">
        <p className="font-medium">{user.orders}</p>
      </td>
      <td className="py-4 px-4">
        <p className="font-medium">${user.spent}</p>
      </td>
      <td className="py-4 px-4">
        <p className="text-sm">{user.joined}</p>
      </td>
      <td className="py-4 px-4">
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-white/5 rounded-lg text-xs hover:bg-white/10 transition">
            View
          </button>
          <button className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-xs hover:bg-purple-500/30 transition">
            Edit
          </button>
          <button className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/30 transition">
            Block
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function AdminUsersPage() {
  const [filter, setFilter] = useState('All')
  const [roleFilter, setRoleFilter] = useState('All Roles')
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'grid' | 'table'>('grid')

  // Mock users data
  const users = [
    {
      id: 'USR-001',
      name: 'Hafiz Sajid Syed',
      email: 'sajid.syed@leather.com',
      role: 'Admin',
      status: 'Active',
      orders: 156,
      spent: '12,499',
      joined: '2020-01-15',
      lastActive: '2 mins ago',
      avatar: null
    },
    {
      id: 'USR-002',
      name: 'John Smith',
      email: 'john.smith@email.com',
      role: 'Customer',
      status: 'Active',
      orders: 23,
      spent: '3,299',
      joined: '2023-03-20',
      lastActive: '1 hour ago',
      avatar: null
    },
    {
      id: 'USR-003',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      role: 'Customer',
      status: 'Active',
      orders: 45,
      spent: '5,899',
      joined: '2022-11-10',
      lastActive: '3 hours ago',
      avatar: null
    },
    {
      id: 'USR-004',
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      role: 'Staff',
      status: 'Active',
      orders: 0,
      spent: '0',
      joined: '2024-01-05',
      lastActive: '5 hours ago',
      avatar: null
    },
    {
      id: 'USR-005',
      name: 'Emma Wilson',
      email: 'emma.w@email.com',
      role: 'Customer',
      status: 'Inactive',
      orders: 8,
      spent: '1,299',
      joined: '2023-08-12',
      lastActive: '2 weeks ago',
      avatar: null
    },
    {
      id: 'USR-006',
      name: 'David Brown',
      email: 'david.b@email.com',
      role: 'Customer',
      status: 'Active',
      orders: 34,
      spent: '4,599',
      joined: '2022-05-18',
      lastActive: '1 day ago',
      avatar: null
    },
    {
      id: 'USR-007',
      name: 'Lisa Garcia',
      email: 'lisa.g@email.com',
      role: 'Staff',
      status: 'New',
      orders: 0,
      spent: '0',
      joined: '2024-02-01',
      lastActive: '30 mins ago',
      avatar: null
    },
    {
      id: 'USR-008',
      name: 'James Lee',
      email: 'james.lee@email.com',
      role: 'Customer',
      status: 'Active',
      orders: 67,
      spent: '8,999',
      joined: '2021-09-22',
      lastActive: '2 days ago',
      avatar: null
    }
  ]

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'All' || user.status === filter
    const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter
    const matchesSearch = 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.id.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesRole && matchesSearch
  })

  // Calculate stats
  const totalUsers = users.length
  const activeUsers = users.filter(u => u.status === 'Active').length
  const newUsers = users.filter(u => u.status === 'New').length
  const totalRevenue = users.reduce((sum, u) => sum + parseInt(u.spent.replace(',', '')), 0).toLocaleString()

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
                  Users Management
                </span>
              </h1>
              <p className="text-gray-400 text-sm">Manage customer accounts and staff</p>
            </div>
            
            <div className="flex gap-2">
              {/* View Toggle */}
              <button
                onClick={() => setView('grid')}
                className={`p-2 rounded-lg transition ${
                  view === 'grid' ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                ⊞
              </button>
              <button
                onClick={() => setView('table')}
                className={`p-2 rounded-lg transition ${
                  view === 'table' ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                ☰
              </button>
              
              {/* Add User Button */}
              <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition">
                + Add User
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard title="Total Users" value={totalUsers.toString()} icon="👥" color="purple" />
            <StatsCard title="Active Users" value={activeUsers.toString()} icon="✅" color="green" />
            <StatsCard title="New This Month" value={newUsers.toString()} icon="🆕" color="blue" />
            <StatsCard title="Total Revenue" value={`$${totalRevenue}`} icon="💰" color="yellow" />
          </div>

          {/* Filters */}
          <div className="mb-6">
            <FilterBar 
              filter={filter}
              setFilter={setFilter}
              search={search}
              setSearch={setSearch}
              roleFilter={roleFilter}
              setRoleFilter={setRoleFilter}
            />
          </div>

          {/* Users Display */}
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-bold mb-2">No users found</h3>
              <p className="text-gray-400">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              {/* Grid View */}
              {view === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredUsers.map(user => (
                    <UserCard key={user.id} user={user} />
                  ))}
                </div>
              )}

              {/* Table View */}
              {view === 'table' && (
                <div className="bg-white/5 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-white/10">
                          <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">User</th>
                          <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Email</th>
                          <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Role</th>
                          <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Status</th>
                          <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Orders</th>
                          <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Spent</th>
                          <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Joined</th>
                          <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map(user => (
                          <UserRow key={user.id} user={user} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Summary */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-2 text-purple-400">User Distribution</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Admin</span>
                  <span className="font-medium">{users.filter(u => u.role === 'Admin').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Staff</span>
                  <span className="font-medium">{users.filter(u => u.role === 'Staff').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Customer</span>
                  <span className="font-medium">{users.filter(u => u.role === 'Customer').length}</span>
                </div>
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-2 text-purple-400">Status Breakdown</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Active</span>
                  <span className="font-medium text-green-400">{users.filter(u => u.status === 'Active').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Inactive</span>
                  <span className="font-medium text-gray-400">{users.filter(u => u.status === 'Inactive').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">New</span>
                  <span className="font-medium text-blue-400">{users.filter(u => u.status === 'New').length}</span>
                </div>
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-2 text-purple-400">Quick Actions</h4>
              <div className="space-y-2">
                <button className="w-full text-left text-sm text-gray-300 hover:text-purple-400 transition">
                  • Send newsletter to all users
                </button>
                <button className="w-full text-left text-sm text-gray-300 hover:text-purple-400 transition">
                  • Export user data
                </button>
                <button className="w-full text-left text-sm text-gray-300 hover:text-purple-400 transition">
                  • View inactive users
                </button>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-between items-center">
            <p className="text-sm text-gray-400">
              Showing {filteredUsers.length} of {users.length} users
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
      </main>
    </div>
  )
}
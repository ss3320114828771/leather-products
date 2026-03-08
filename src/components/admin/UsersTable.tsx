'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'staff' | 'customer'
  status: 'active' | 'inactive' | 'pending'
  avatar?: string
  orders: number
  spent: number
  joined: string
  lastActive: string
  phone?: string
  location?: string
}

interface UsersTableProps {
  users: User[]
  onStatusChange?: (userId: string, newStatus: string) => void
  onRoleChange?: (userId: string, newRole: string) => void
  onDelete?: (userId: string) => void
  showActions?: boolean
}

export default function UsersTable({ 
  users, 
  onStatusChange, 
  onRoleChange,
  onDelete,
  showActions = true 
}: UsersTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [filterRole, setFilterRole] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')

  // Get unique roles
  const roles = ['all', ...new Set(users.map(u => u.role))]

  // Filter and search users
  const filteredUsers = users
    .filter(user => {
      // Filter by role
      if (filterRole !== 'all' && user.role !== filterRole) return false
      
      // Filter by status
      if (filterStatus !== 'all' && user.status !== filterStatus) return false
      
      // Search by name, email, or ID
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        return (
          user.name.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search) ||
          user.id.toLowerCase().includes(search)
        )
      }
      
      return true
    })
    .sort((a, b) => new Date(b.joined).getTime() - new Date(a.joined).getTime())

  // Get role color
  const getRoleColor = (role: string) => {
    switch(role) {
      case 'admin': return 'bg-purple-500/20 text-purple-400'
      case 'staff': return 'bg-blue-500/20 text-blue-400'
      case 'customer': return 'bg-green-500/20 text-green-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'text-green-400'
      case 'inactive': return 'text-gray-400'
      case 'pending': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-500/20 text-green-400'
      case 'inactive': return 'bg-gray-500/20 text-gray-400'
      case 'pending': return 'bg-yellow-500/20 text-yellow-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Toggle row expansion
  const toggleRow = (userId: string) => {
    setExpandedRow(expandedRow === userId ? null : userId)
  }

  // Role options
  const roleOptions = ['admin', 'staff', 'customer']

  // Status options
  const statusOptions = ['active', 'inactive', 'pending']

  return (
    <div className="w-full">
      {/* Search and Filters */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or ID..."
              className="w-full px-4 py-2 pl-10 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition text-white"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Role Filter */}
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition text-white"
        >
          {roles.map(role => (
            <option key={role} value={role} className="bg-gray-900">
              {role === 'all' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition text-white"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/10">
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">User</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Role</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Status</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Orders</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Spent</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Joined</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Last Active</th>
                {showActions && <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={showActions ? 8 : 7} className="text-center py-8 text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-white/10 hover:bg-white/5 transition">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          {user.avatar ? (
                            <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                          ) : (
                            <span className="text-sm font-medium">{getInitials(user.name)}</span>
                          )}
                        </div>
                        <div>
                          <Link href={`/admin/users/${user.id}`} className="font-medium hover:text-purple-400">
                            {user.name}
                          </Link>
                          <p className="text-xs text-gray-400">{user.email}</p>
                          <p className="text-xs text-gray-500">{user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {showActions && onRoleChange ? (
                        <select
                          value={user.role}
                          onChange={(e) => onRoleChange(user.id, e.target.value)}
                          className={`px-2 py-1 rounded-lg text-xs ${getRoleColor(user.role)} border-0 focus:ring-2 focus:ring-purple-500`}
                        >
                          {roleOptions.map(option => (
                            <option key={option} value={option} className="bg-gray-900">
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(user.role)}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {showActions && onStatusChange ? (
                        <select
                          value={user.status}
                          onChange={(e) => onStatusChange(user.id, e.target.value)}
                          className={`px-2 py-1 rounded-lg text-xs ${getStatusBadgeColor(user.status)} border-0 focus:ring-2 focus:ring-purple-500`}
                        >
                          {statusOptions.map(option => (
                            <option key={option} value={option} className="bg-gray-900">
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className={`text-xs ${getStatusColor(user.status)}`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium">{user.orders}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium">{formatCurrency(user.spent)}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm">{formatDate(user.joined)}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-400">{formatDate(user.lastActive)}</p>
                    </td>
                    {showActions && (
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/users/${user.id}`}
                            className="px-3 py-1 bg-white/5 rounded-lg text-xs hover:bg-white/10 transition"
                          >
                            View
                          </Link>
                          <Link
                            href={`/admin/users/${user.id}/edit`}
                            className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-xs hover:bg-purple-500/30 transition"
                          >
                            Edit
                          </Link>
                          {onDelete && (
                            <button
                              onClick={() => onDelete(user.id)}
                              className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/30 transition"
                            >
                              Delete
                            </button>
                          )}
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
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 bg-white/5 rounded-xl text-gray-400">
            No users found
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div key={user.id} className="bg-white/5 rounded-xl p-4">
              {/* Header */}
              <div className="flex gap-3 mb-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  {user.avatar ? (
                    <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                  ) : (
                    <span className="text-sm font-medium">{getInitials(user.name)}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link href={`/admin/users/${user.id}`} className="font-medium hover:text-purple-400">
                        {user.name}
                      </Link>
                      <p className="text-xs text-gray-400">{user.email}</p>
                      <p className="text-xs text-gray-500">{user.id}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-3">
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(user.status)}`}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div>
                  <p className="text-xs text-gray-400">Orders</p>
                  <p className="font-medium">{user.orders}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Spent</p>
                  <p className="font-medium">{formatCurrency(user.spent)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Joined</p>
                  <p className="text-sm">{formatDate(user.joined)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Last Active</p>
                  <p className="text-sm text-gray-400">{formatDate(user.lastActive)}</p>
                </div>
              </div>

              {/* Contact Info */}
              {(user.phone || user.location) && (
                <div className="mb-3 text-xs text-gray-400">
                  {user.phone && <p>📞 {user.phone}</p>}
                  {user.location && <p>📍 {user.location}</p>}
                </div>
              )}

              {/* Expandable Section */}
              <button
                onClick={() => toggleRow(user.id)}
                className="w-full text-left text-xs text-gray-400 hover:text-white transition flex items-center justify-between"
              >
                <span>{expandedRow === user.id ? 'Show less' : 'Show more options'}</span>
                <span>{expandedRow === user.id ? '▲' : '▼'}</span>
              </button>

              {expandedRow === user.id && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  {showActions && (
                    <div className="space-y-3">
                      {onRoleChange && (
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Update Role</label>
                          <select
                            value={user.role}
                            onChange={(e) => onRoleChange(user.id, e.target.value)}
                            className={`w-full px-3 py-2 rounded-lg text-sm ${getRoleColor(user.role)} bg-white/5 border-0`}
                          >
                            {roleOptions.map(option => (
                              <option key={option} value={option} className="bg-gray-900">
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      
                      {onStatusChange && (
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Update Status</label>
                          <select
                            value={user.status}
                            onChange={(e) => onStatusChange(user.id, e.target.value)}
                            className={`w-full px-3 py-2 rounded-lg text-sm ${getStatusBadgeColor(user.status)} bg-white/5 border-0`}
                          >
                            {statusOptions.map(option => (
                              <option key={option} value={option} className="bg-gray-900">
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-3">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="flex-1 px-3 py-2 bg-white/5 rounded-lg text-sm text-center hover:bg-white/10 transition"
                    >
                      View Profile
                    </Link>
                    <Link
                      href={`/admin/users/${user.id}/edit`}
                      className="flex-1 px-3 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm text-center hover:bg-purple-500/30 transition"
                    >
                      Edit
                    </Link>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(user.id)}
                        className="flex-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
        <p>Showing {filteredUsers.length} of {users.length} users</p>
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
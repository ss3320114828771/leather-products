'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: number
  name: string
  sku: string
  price: number
  salePrice?: number
  category: string
  stock: number
  sold: number
  image: string
  status: 'active' | 'draft' | 'archived'
  featured: boolean
}

interface ProductsTableProps {
  products: Product[]
  onStatusChange?: (productId: number, newStatus: string) => void
  onDelete?: (productId: number) => void
  showActions?: boolean
}

export default function ProductsTable({ 
  products, 
  onStatusChange, 
  onDelete,
  showActions = true 
}: ProductsTableProps) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('name')

  // Get unique categories
  const categories = ['all', ...new Set(products.map(p => p.category))]

  // Filter and sort products
  const filteredProducts = products
    .filter(product => filterCategory === 'all' || product.category === filterCategory)
    .sort((a, b) => {
      switch(sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'price-asc':
          return (a.salePrice || a.price) - (b.salePrice || b.price)
        case 'price-desc':
          return (b.salePrice || b.price) - (a.salePrice || a.price)
        case 'stock':
          return b.stock - a.stock
        case 'sold':
          return b.sold - a.sold
        default:
          return 0
      }
    })

  // Get status color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-500/20 text-green-400'
      case 'draft': return 'bg-yellow-500/20 text-yellow-400'
      case 'archived': return 'bg-gray-500/20 text-gray-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  // Get stock color
  const getStockColor = (stock: number) => {
    if (stock > 20) return 'text-green-400'
    if (stock > 5) return 'text-yellow-400'
    if (stock > 0) return 'text-orange-400'
    return 'text-red-400'
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  // Toggle row expansion
  const toggleRow = (productId: number) => {
    setExpandedRow(expandedRow === productId ? null : productId)
  }

  // Status options
  const statusOptions = ['active', 'draft', 'archived']

  return (
    <div className="w-full">
      {/* Filter Bar */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition text-white"
          >
            {categories.map(cat => (
              <option key={cat} value={cat} className="bg-gray-900">
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition text-white"
          >
            <option value="name">Sort by Name</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="stock">Sort by Stock</option>
            <option value="sold">Sort by Sales</option>
          </select>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/10">
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Product</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">SKU</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Category</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Price</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Stock</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Sold</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Status</th>
                {showActions && <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={showActions ? 8 : 7} className="text-center py-8 text-gray-400">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-white/10 hover:bg-white/5 transition">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <Link href={`/admin/products/${product.id}`} className="font-medium hover:text-purple-400">
                            {product.name}
                          </Link>
                          {product.featured && (
                            <span className="ml-2 text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-300">{product.sku}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {product.salePrice ? (
                        <div>
                          <p className="font-bold text-purple-400">{formatCurrency(product.salePrice)}</p>
                          <p className="text-xs text-gray-400 line-through">{formatCurrency(product.price)}</p>
                        </div>
                      ) : (
                        <p className="font-bold">{formatCurrency(product.price)}</p>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <p className={`font-medium ${getStockColor(product.stock)}`}>
                        {product.stock} units
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium">{product.sold}</p>
                    </td>
                    <td className="py-4 px-4">
                      {showActions && onStatusChange ? (
                        <select
                          value={product.status}
                          onChange={(e) => onStatusChange(product.id, e.target.value)}
                          className={`px-2 py-1 rounded-lg text-xs ${getStatusColor(product.status)} border-0 focus:ring-2 focus:ring-purple-500`}
                        >
                          {statusOptions.map(option => (
                            <option key={option} value={option} className="bg-gray-900">
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(product.status)}`}>
                          {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                        </span>
                      )}
                    </td>
                    {showActions && (
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="px-3 py-1 bg-white/5 rounded-lg text-xs hover:bg-white/10 transition"
                          >
                            View
                          </Link>
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-xs hover:bg-purple-500/30 transition"
                          >
                            Edit
                          </Link>
                          {onDelete && (
                            <button
                              onClick={() => onDelete(product.id)}
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
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8 bg-white/5 rounded-xl text-gray-400">
            No products found
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="bg-white/5 rounded-xl p-4">
              {/* Header */}
              <div className="flex gap-3 mb-3">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link href={`/admin/products/${product.id}`} className="font-medium hover:text-purple-400">
                        {product.name}
                      </Link>
                      <p className="text-xs text-gray-400">SKU: {product.sku}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(product.status)}`}>
                      {product.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div>
                  <p className="text-xs text-gray-400">Category</p>
                  <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                    {product.category}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Price</p>
                  {product.salePrice ? (
                    <div>
                      <span className="font-bold text-purple-400">{formatCurrency(product.salePrice)}</span>
                      <span className="text-xs text-gray-400 line-through ml-1">{formatCurrency(product.price)}</span>
                    </div>
                  ) : (
                    <span className="font-bold">{formatCurrency(product.price)}</span>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-400">Stock</p>
                  <p className={`font-medium ${getStockColor(product.stock)}`}>{product.stock} units</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Sold</p>
                  <p className="font-medium">{product.sold}</p>
                </div>
              </div>

              {/* Featured Badge */}
              {product.featured && (
                <div className="mb-3">
                  <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full">
                    Featured Product
                  </span>
                </div>
              )}

              {/* Expandable Section */}
              <button
                onClick={() => toggleRow(product.id)}
                className="w-full text-left text-xs text-gray-400 hover:text-white transition flex items-center justify-between"
              >
                <span>{expandedRow === product.id ? 'Show less' : 'Show more options'}</span>
                <span>{expandedRow === product.id ? '▲' : '▼'}</span>
              </button>

              {expandedRow === product.id && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  {showActions && onStatusChange && (
                    <div className="mb-3">
                      <label className="block text-xs text-gray-400 mb-1">Update Status</label>
                      <select
                        value={product.status}
                        onChange={(e) => onStatusChange(product.id, e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg text-sm ${getStatusColor(product.status)} bg-white/5 border-0`}
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
                      href={`/admin/products/${product.id}`}
                      className="flex-1 px-3 py-2 bg-white/5 rounded-lg text-sm text-center hover:bg-white/10 transition"
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="flex-1 px-3 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm text-center hover:bg-purple-500/30 transition"
                    >
                      Edit
                    </Link>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(product.id)}
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
        <p>Showing {filteredProducts.length} of {products.length} products</p>
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
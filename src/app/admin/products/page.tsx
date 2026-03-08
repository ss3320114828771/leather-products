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
        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">+12%</span>
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
  const filters = ['All', 'Bags', 'Wallets', 'Belts', 'Accessories']

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products by name, SKU, or category..."
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

// Product Card Component
function ProductCard({ product }: { product: any }) {
  const getStockColor = (stock: number) => {
    if (stock > 20) return 'text-green-400'
    if (stock > 5) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <Link href={`/admin/products/${product.id}`}>
      <div className="bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition cursor-pointer border border-white/10 hover:border-purple-500/50">
        {/* Product Image */}
        <div className="relative h-48">
          <Image 
            src={product.image} 
            alt={product.name}
            fill
            className="object-cover"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold">{product.name}</h3>
            <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full">
              {product.category}
            </span>
          </div>

          <p className="text-xs text-gray-400 mb-2">SKU: {product.sku}</p>

          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="text-lg font-bold">${product.price}</span>
              {product.salePrice && (
                <span className="text-xs text-gray-400 line-through ml-2">${product.salePrice}</span>
              )}
            </div>
            <span className={`text-sm ${getStockColor(product.stock)}`}>
              {product.stock} in stock
            </span>
          </div>

          {/* Progress Bar for Sales */}
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Sales</span>
              <span className="text-purple-400">{product.sold} units</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                style={{ width: `${(product.sold / product.target) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <button className="flex-1 px-3 py-1.5 bg-white/5 rounded-lg text-xs hover:bg-white/10 transition">
              Edit
            </button>
            <button className="flex-1 px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg text-xs hover:bg-purple-500/30 transition">
              View
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

// Product Table Row Component (for list view)
function ProductRow({ product }: { product: any }) {
  const getStockColor = (stock: number) => {
    if (stock > 20) return 'text-green-400'
    if (stock > 5) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <tr className="border-b border-white/10 hover:bg-white/5 transition">
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
            <p className="text-xs text-gray-400">SKU: {product.sku}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full">
          {product.category}
        </span>
      </td>
      <td className="py-4 px-4">
        <p className="font-bold">${product.price}</p>
        {product.salePrice && (
          <p className="text-xs text-gray-400 line-through">${product.salePrice}</p>
        )}
      </td>
      <td className="py-4 px-4">
        <span className={getStockColor(product.stock)}>{product.stock} units</span>
      </td>
      <td className="py-4 px-4">
        <p className="font-medium">{product.sold}</p>
        <p className="text-xs text-gray-400">sold</p>
      </td>
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
        </div>
      </td>
    </tr>
  )
}

export default function AdminProductsPage() {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'grid' | 'table'>('grid')

  // Mock products data
  const products = [
    {
      id: 1,
      name: 'Premium Leather Bag',
      category: 'Bags',
      price: 299.99,
      salePrice: 249.99,
      stock: 45,
      sku: 'LB-001-BLK',
      image: '/n1.jpeg',
      sold: 128,
      target: 200,
      rating: 4.8
    },
    {
      id: 2,
      name: 'Classic Leather Wallet',
      category: 'Wallets',
      price: 89.99,
      salePrice: null,
      stock: 78,
      sku: 'LW-002-BRN',
      image: '/n2.jpeg',
      sold: 256,
      target: 300,
      rating: 4.9
    },
    {
      id: 3,
      name: 'Handcrafted Leather Belt',
      category: 'Belts',
      price: 79.99,
      salePrice: 69.99,
      stock: 23,
      sku: 'LB-003-BLK',
      image: '/n3.jpeg',
      sold: 89,
      target: 150,
      rating: 4.7
    },
    {
      id: 4,
      name: 'Leather Card Holder',
      category: 'Wallets',
      price: 49.99,
      salePrice: null,
      stock: 0,
      sku: 'LW-004-BRN',
      image: '/n4.jpeg',
      sold: 312,
      target: 300,
      rating: 4.9
    },
    {
      id: 5,
      name: 'Messenger Leather Bag',
      category: 'Bags',
      price: 349.99,
      salePrice: 299.99,
      stock: 12,
      sku: 'LB-005-BRN',
      image: '/n5.jpeg',
      sold: 67,
      target: 100,
      rating: 4.8
    },
    {
      id: 6,
      name: 'Leather Keychain',
      category: 'Accessories',
      price: 29.99,
      salePrice: 24.99,
      stock: 156,
      sku: 'LA-006-BLK',
      image: '/n6.jpeg',
      sold: 423,
      target: 500,
      rating: 4.9
    },
    {
      id: 7,
      name: 'Leather Briefcase',
      category: 'Bags',
      price: 399.99,
      salePrice: null,
      stock: 8,
      sku: 'LB-007-BLK',
      image: '/n1.jpeg',
      sold: 34,
      target: 50,
      rating: 4.9
    },
    {
      id: 8,
      name: 'Leather Money Clip',
      category: 'Accessories',
      price: 39.99,
      salePrice: 34.99,
      stock: 67,
      sku: 'LA-008-SLV',
      image: '/n2.jpeg',
      sold: 189,
      target: 200,
      rating: 4.8
    }
  ]

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesFilter = filter === 'All' || product.category === filter
    const matchesSearch = 
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Calculate stats
  const totalProducts = products.length
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
  const totalSold = products.reduce((sum, p) => sum + p.sold, 0)
  const outOfStock = products.filter(p => p.stock === 0).length
  const totalRevenue = products.reduce((sum, p) => sum + (p.sold * p.price), 0).toFixed(2)

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
                  Products Management
                </span>
              </h1>
              <p className="text-gray-400 text-sm">Manage your product inventory</p>
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
              
              {/* New Product Button */}
              <Link
                href="/admin/products/new"
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition"
              >
                + New Product
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard title="Total Products" value={totalProducts.toString()} icon="📦" color="purple" />
            <StatsCard title="Total Stock" value={totalStock.toString()} icon="📊" color="blue" />
            <StatsCard title="Units Sold" value={totalSold.toString()} icon="💰" color="green" />
            <StatsCard title="Out of Stock" value={outOfStock.toString()} icon="⚠️" color="yellow" />
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

          {/* Products Display */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold mb-2">No products found</h3>
              <p className="text-gray-400">Try adjusting your filters or create a new product</p>
            </div>
          ) : (
            <>
              {/* Grid View */}
              {view === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
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
                          <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Product</th>
                          <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Category</th>
                          <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Price</th>
                          <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Stock</th>
                          <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Sold</th>
                          <th className="text-left py-4 px-4 text-sm font-semibold text-gray-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map(product => (
                          <ProductRow key={product.id} product={product} />
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
              <h4 className="text-sm font-semibold mb-2 text-purple-400">Inventory Value</h4>
              <p className="text-2xl font-bold">${(totalStock * 150).toLocaleString()}</p>
              <p className="text-xs text-gray-400">Based on average product value</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-2 text-purple-400">Total Revenue</h4>
              <p className="text-2xl font-bold">${totalRevenue}</p>
              <p className="text-xs text-gray-400">From all sales</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-2 text-purple-400">Top Category</h4>
              <p className="text-2xl font-bold">Bags</p>
              <p className="text-xs text-gray-400">45% of inventory</p>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-between items-center">
            <p className="text-sm text-gray-400">
              Showing {filteredProducts.length} of {products.length} products
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
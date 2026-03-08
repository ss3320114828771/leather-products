'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

// Types
interface Product {
  id: string | string[] | undefined
  name: string
  price: number
  salePrice: number | null
  stock: number
  category: string
  sku: string
  description: string
  material: string
  color: string
  dimensions: string
  weight: string
  sales: number
  revenue: string
  rating: number
  reviews: number
  images: string[]
}

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

// Tab Component
function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
        active 
          ? 'bg-purple-500/20 text-purple-400 border-b-2 border-purple-500' 
          : 'text-gray-400 hover:text-white'
      }`}
    >
      {label}
    </button>
  )
}

// Overview Tab
function OverviewTab({ product }: { product: Product }) {
  return (
    <div className="space-y-6">
      {/* Product Info */}
      <div className="bg-white/5 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 text-purple-400">Product Information</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-400">Price</p>
            <p className="text-2xl font-bold">${product.price}</p>
            {product.salePrice && (
              <p className="text-sm text-green-400">Sale: ${product.salePrice}</p>
            )}
          </div>
          <div>
            <p className="text-xs text-gray-400">Stock</p>
            <p className={`text-2xl font-bold ${product.stock > 10 ? 'text-green-400' : product.stock > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
              {product.stock} units
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <p className="text-xs text-gray-400">Category</p>
            <p>{product.category}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">SKU</p>
            <p className="text-sm text-gray-300">{product.sku}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Description</p>
            <p className="text-sm text-gray-300">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{product.sales}</p>
          <p className="text-xs text-gray-400">Total Sales</p>
        </div>
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">${product.revenue}</p>
          <p className="text-xs text-gray-400">Revenue</p>
        </div>
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{product.rating} ⭐</p>
          <p className="text-xs text-gray-400">{product.reviews} reviews</p>
        </div>
      </div>

      {/* Materials */}
      <div className="bg-white/5 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 text-purple-400">Materials & Specifications</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Material</span>
            <span>{product.material}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Color</span>
            <span>{product.color}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Dimensions</span>
            <span>{product.dimensions}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Weight</span>
            <span>{product.weight}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Images Tab - FIXED: Added proper typing
function ImagesTab({ product }: { product: Product }) {
  return (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-purple-400">Product Images</h3>
          <button className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm hover:bg-purple-500/30 transition">
            + Add Image
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {product.images && product.images.length > 0 ? (
            product.images.map((image: string, i: number) => (
              <div key={i} className="relative group">
                <div className="relative h-32 rounded-lg overflow-hidden">
                  <Image 
                    src={image} 
                    alt={`Product ${i+1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                {i === 0 && (
                  <span className="absolute top-2 left-2 text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full">
                    Primary
                  </span>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <button className="p-1 bg-white/20 rounded-lg text-xs">Edit</button>
                  <button className="p-1 bg-red-500/20 rounded-lg text-xs">Delete</button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-4 text-center py-8 text-gray-400">
              No images available
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Reviews Tab - FIXED: Added proper typing
function ReviewsTab({ product }: { product: Product }) {
  interface Review {
    user: string
    rating: number
    comment: string
    date: string
  }

  const reviews: Review[] = [
    { user: 'John Smith', rating: 5, comment: 'Excellent quality! The leather is soft and durable.', date: '2024-01-15' },
    { user: 'Sarah Johnson', rating: 4, comment: 'Great product, but shipping took a bit long.', date: '2024-01-14' },
    { user: 'Mike Chen', rating: 5, comment: 'Best leather bag I\'ve ever owned. Highly recommended!', date: '2024-01-12' },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-purple-400">Customer Reviews</h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{product.rating}</span>
            <span className="text-gray-400">/ 5</span>
            <span className="text-sm text-gray-400">({product.reviews} reviews)</span>
          </div>
        </div>

        <div className="space-y-4">
          {reviews.map((review, i) => (
            <div key={i} className="border-b border-white/10 last:border-0 pb-4 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{review.user}</p>
                  <div className="flex gap-1 text-yellow-400">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                  </div>
                </div>
                <span className="text-xs text-gray-400">{review.date}</span>
              </div>
              <p className="text-sm text-gray-300">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Edit Tab - FIXED: Added proper typing
function EditTab({ product, onSave }: { product: Product; onSave: (data: Product) => void }) {
  const [formData, setFormData] = useState<Product>(product)
  const [saving, setSaving] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    setSaving(true)
    setTimeout(() => {
      onSave(formData)
      setSaving(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 text-purple-400">Edit Product</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">SKU</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Sale Price ($)</label>
              <input
                type="number"
                name="salePrice"
                value={formData.salePrice || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition text-white"
              >
                <option value="Bags">Bags</option>
                <option value="Wallets">Wallets</option>
                <option value="Belts">Belts</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Material</label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Color</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition text-white"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id

  const [activeTab, setActiveTab] = useState('overview')
  const [product, setProduct] = useState<Product>({
    id: productId,
    name: 'Premium Leather Bag',
    price: 299.99,
    salePrice: 249.99,
    stock: 45,
    category: 'Bags',
    sku: 'LB-001-BLK',
    description: 'Handcrafted premium leather bag with modern design. Features multiple compartments and adjustable strap.',
    material: 'Full-grain leather',
    color: 'Black',
    dimensions: '12" x 10" x 4"',
    weight: '2.5 lbs',
    sales: 128,
    revenue: '31,872',
    rating: 4.8,
    reviews: 89,
    images: ['/n1.jpeg', '/n2.jpeg', '/n3.jpeg', '/n4.jpeg']
  })

  const handleSave = (updatedProduct: Product) => {
    setProduct(updatedProduct)
    setActiveTab('overview')
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <AdminNavbar />

      <main className="pt-20 pb-10 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <Link 
                  href="/admin/products" 
                  className="text-sm text-gray-400 hover:text-white mb-2 inline-block"
                >
                  ← Back to Products
                </Link>
                <h1 className="text-3xl font-bold">
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {product.name}
                  </span>
                </h1>
                <p className="text-gray-400 text-sm mt-1">Product ID: {productId} | SKU: {product.sku}</p>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveTab('edit')}
                  className="px-4 py-2 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition"
                >
                  Edit
                </button>
                <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition">
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <Tab label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
            <Tab label="Images" active={activeTab === 'images'} onClick={() => setActiveTab('images')} />
            <Tab label="Reviews" active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} />
            <Tab label="Edit" active={activeTab === 'edit'} onClick={() => setActiveTab('edit')} />
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'overview' && <OverviewTab product={product} />}
            {activeTab === 'images' && <ImagesTab product={product} />}
            {activeTab === 'reviews' && <ReviewsTab product={product} />}
            {activeTab === 'edit' && <EditTab product={product} onSave={handleSave} />}
          </div>
        </div>
      </main>
    </div>
  )
}
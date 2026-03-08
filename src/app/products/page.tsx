'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// Simple Navbar
function SimpleNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-purple-400">
            Leather Store
          </Link>
          
          <div className="hidden md:flex items-center gap-4">
            <Link href="/" className="text-white hover:text-purple-400">Home</Link>
            <Link href="/products" className="text-purple-400">Products</Link>
            <Link href="/about" className="text-white hover:text-purple-400">About</Link>
            <Link href="/contact" className="text-white hover:text-purple-400">Contact</Link>
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
            <Link href="/" className="block py-2 text-white hover:text-purple-400">Home</Link>
            <Link href="/products" className="block py-2 text-purple-400">Products</Link>
            <Link href="/about" className="block py-2 text-white hover:text-purple-400">About</Link>
            <Link href="/contact" className="block py-2 text-white hover:text-purple-400">Contact</Link>
          </div>
        )}
      </div>
    </nav>
  )
}

// Product Card Component
function ProductCard({ product }: { product: any }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link href={`/products/${product.id}`}>
      <div 
        className="bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition cursor-pointer border border-white/10 hover:border-purple-500/50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-2">
            {product.featured && (
              <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                Featured
              </span>
            )}
            {product.salePrice && (
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                Sale
              </span>
            )}
          </div>

          {/* Out of Stock Overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-bold mb-1">{product.name}</h3>
          <p className="text-xs text-gray-400 mb-2 line-clamp-2">{product.description}</p>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex text-yellow-400 text-xs">
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
            </div>
            <span className="text-xs text-gray-400">({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            {product.salePrice ? (
              <>
                <span className="text-lg font-bold text-purple-400">${product.salePrice}</span>
                <span className="text-sm text-gray-400 line-through">${product.price}</span>
              </>
            ) : (
              <span className="text-lg font-bold">${product.price}</span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button 
            onClick={(e) => {
              e.preventDefault()
              alert(`Added ${product.name} to cart!`)
            }}
            className="w-full mt-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  )
}

// Filter Sidebar Component
function FilterSidebar({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  priceRange,
  onPriceChange,
  sortBy,
  onSortChange
}: {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  priceRange: [number, number]
  onPriceChange: (range: [number, number]) => void
  sortBy: string
  onSortChange: (sort: string) => void
}) {
  return (
    <div className="bg-white/5 rounded-xl p-6">
      <h3 className="text-lg font-bold mb-4 text-purple-400">Filters</h3>
      
      {/* Sort */}
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-2">Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition text-white"
        >
          <option value="featured">Featured</option>
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-2">Categories</label>
        <div className="space-y-2">
          <button
            onClick={() => onCategoryChange('all')}
            className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition ${
              selectedCategory === 'all' 
                ? 'bg-purple-500/20 text-purple-400' 
                : 'hover:bg-white/5'
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                selectedCategory === cat 
                  ? 'bg-purple-500/20 text-purple-400' 
                  : 'hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-2">Price Range</label>
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="500"
            value={priceRange[1]}
            onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value)])}
            className="w-full"
          />
          <div className="flex justify-between text-sm">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* In Stock Only */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="rounded border-white/10 bg-white/5" />
          <span>In Stock Only</span>
        </label>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => {
          onCategoryChange('all')
          onPriceChange([0, 500])
          onSortChange('featured')
        }}
        className="w-full py-2 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition"
      >
        Clear Filters
      </button>
    </div>
  )
}

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [sortBy, setSortBy] = useState('featured')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 9

  // Mock products data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockProducts = [
        {
          id: 1,
          name: 'Premium Leather Bag',
          description: 'Handcrafted premium leather bag with modern design',
          price: 299.99,
          salePrice: 249.99,
          category: 'Bags',
          image: '/n1.jpeg',
          stock: 45,
          rating: 4.8,
          reviews: 89,
          featured: true
        },
        {
          id: 2,
          name: 'Classic Leather Wallet',
          description: 'Slim and elegant leather wallet for everyday use',
          price: 89.99,
          category: 'Wallets',
          image: '/n2.jpeg',
          stock: 78,
          rating: 4.9,
          reviews: 256,
          featured: true
        },
        {
          id: 3,
          name: 'Handcrafted Leather Belt',
          description: 'Premium leather belt with brass buckle',
          price: 79.99,
          salePrice: 69.99,
          category: 'Belts',
          image: '/n3.jpeg',
          stock: 23,
          rating: 4.7,
          reviews: 89,
          featured: false
        },
        {
          id: 4,
          name: 'Leather Card Holder',
          description: 'Minimalist card holder for essentials',
          price: 49.99,
          category: 'Wallets',
          image: '/n4.jpeg',
          stock: 0,
          rating: 4.9,
          reviews: 312,
          featured: false
        },
        {
          id: 5,
          name: 'Messenger Leather Bag',
          description: 'Spacious messenger bag for work or travel',
          price: 349.99,
          salePrice: 299.99,
          category: 'Bags',
          image: '/n5.jpeg',
          stock: 12,
          rating: 4.8,
          reviews: 67,
          featured: true
        },
        {
          id: 6,
          name: 'Leather Keychain',
          description: 'Simple and elegant leather keychain',
          price: 29.99,
          salePrice: 24.99,
          category: 'Accessories',
          image: '/n6.jpeg',
          stock: 156,
          rating: 4.9,
          reviews: 423,
          featured: false
        },
        {
          id: 7,
          name: 'Leather Briefcase',
          description: 'Professional leather briefcase for business',
          price: 399.99,
          category: 'Bags',
          image: '/n1.jpeg',
          stock: 8,
          rating: 4.9,
          reviews: 34,
          featured: true
        },
        {
          id: 8,
          name: 'Leather Money Clip',
          description: 'Sleek money clip with card holder',
          price: 39.99,
          salePrice: 34.99,
          category: 'Accessories',
          image: '/n2.jpeg',
          stock: 67,
          rating: 4.8,
          reviews: 189,
          featured: false
        },
        {
          id: 9,
          name: 'Leather Backpack',
          description: 'Stylish leather backpack for daily use',
          price: 279.99,
          category: 'Bags',
          image: '/n3.jpeg',
          stock: 15,
          rating: 4.7,
          reviews: 56,
          featured: false
        }
      ]
      setProducts(mockProducts)
      setFilteredProducts(mockProducts)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = [...products]

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    // Filter by price
    filtered = filtered.filter(p => {
      const price = p.salePrice || p.price
      return price >= priceRange[0] && price <= priceRange[1]
    })

    // Apply sorting
    switch(sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price))
        break
      case 'price-high':
        filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price))
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        filtered.sort((a, b) => b.id - a.id)
        break
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }

    setFilteredProducts(filtered)
    setCurrentPage(1)
  }, [selectedCategory, priceRange, sortBy, products])

  // Get unique categories
  const categories = [...new Set(products.map(p => p.category))]

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <SimpleNavbar />
        <div className="pt-20 container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <SimpleNavbar />

      <main className="pt-20 pb-10 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Our Products
              </span>
            </h1>
            <p className="text-gray-400">Discover our collection of premium leather goods</p>
          </div>

          {/* Mobile Filter Button */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full py-2 bg-white/5 rounded-lg hover:bg-white/10 transition"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Main Content */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar - Filters */}
            <div className={`md:w-64 ${showFilters ? 'block' : 'hidden md:block'}`}>
              <FilterSidebar
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Results Count */}
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-400">
                  Showing {currentProducts.length} of {filteredProducts.length} products
                </p>
              </div>

              {/* Products */}
              {currentProducts.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-xl">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold mb-2">No products found</h3>
                  <p className="text-gray-400">Try adjusting your filters</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-10 h-10 rounded-lg transition ${
                            currentPage === i + 1
                              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                              : 'bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-sm text-gray-400">
        <p>© 2024 Leather Store. All rights reserved.</p>
      </footer>
    </div>
  )
}
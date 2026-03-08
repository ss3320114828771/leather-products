// lib/db.ts

// Types
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'staff' | 'customer'
  password: string
  avatar?: string
  phone?: string
  address?: string
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: number
  salePrice?: number
  category: string
  categoryId: number
  images: string[]
  stock: number
  sku: string
  material?: string
  color?: string
  sizes?: string[]
  featured: boolean
  rating: number
  reviewCount: number
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  userId: string
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
  shippingAddress: Address
  billingAddress?: Address
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: number
  productId: number
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
  image: string
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  image?: string
  productCount: number
}

// ============================================
// IN-MEMORY DATABASE (Replace with real DB)
// ============================================

// Users table
export const users: User[] = [
  {
    id: '1',
    email: 'sajid.syed@leather.com',
    name: 'Hafiz Sajid Syed',
    role: 'admin',
    password: 'admin123', // In production, use hashed passwords
    avatar: '/avatars/admin.jpg',
    phone: '+1 (234) 567-890',
    address: '123 Admin St, New York, NY 10001',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    email: 'john@example.com',
    name: 'John Smith',
    role: 'customer',
    password: 'customer123',
    phone: '+1 (234) 567-891',
    address: '456 Oak Ave, Los Angeles, CA 90001',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// Products table
export const products: Product[] = [
  {
    id: 1,
    name: 'Premium Leather Bag',
    slug: 'premium-leather-bag',
    description: 'Handcrafted premium leather bag with modern design. Features multiple compartments and adjustable strap.',
    price: 299.99,
    salePrice: 249.99,
    category: 'Bags',
    categoryId: 1,
    images: ['/n1.jpeg', '/n2.jpeg', '/n3.jpeg'],
    stock: 45,
    sku: 'LB-001-BLK',
    material: 'Full-grain leather',
    color: 'Black',
    sizes: ['Small', 'Medium', 'Large'],
    featured: true,
    rating: 4.8,
    reviewCount: 89,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Classic Leather Wallet',
    slug: 'classic-leather-wallet',
    description: 'Slim and elegant leather wallet with multiple card slots.',
    price: 89.99,
    category: 'Wallets',
    categoryId: 2,
    images: ['/n2.jpeg', '/n3.jpeg'],
    stock: 78,
    sku: 'LW-002-BRN',
    material: 'Full-grain leather',
    color: 'Brown',
    featured: true,
    rating: 4.9,
    reviewCount: 256,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Handcrafted Leather Belt',
    slug: 'handcrafted-leather-belt',
    description: 'Premium leather belt with brass buckle.',
    price: 79.99,
    salePrice: 69.99,
    category: 'Belts',
    categoryId: 3,
    images: ['/n3.jpeg', '/n4.jpeg'],
    stock: 23,
    sku: 'LB-003-BLK',
    material: 'Full-grain leather',
    color: 'Black',
    sizes: ['30', '32', '34', '36', '38'],
    featured: false,
    rating: 4.7,
    reviewCount: 89,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// Orders table
export const orders: Order[] = [
  {
    id: 'ORD-001',
    userId: '1',
    customerName: 'Hafiz Sajid Syed',
    customerEmail: 'sajid.syed@leather.com',
    customerPhone: '+1 (234) 567-890',
    items: [
      {
        id: 1,
        productId: 1,
        name: 'Premium Leather Bag',
        price: 249.99,
        quantity: 1,
        size: 'Medium',
        color: 'Black',
        image: '/n1.jpeg'
      }
    ],
    subtotal: 249.99,
    tax: 20.00,
    shipping: 10,
    total: 279.99,
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    shippingAddress: {
      street: '123 Admin St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// Categories table
export const categories: Category[] = [
  { id: 1, name: 'Bags', slug: 'bags', description: 'Premium leather bags', productCount: 15 },
  { id: 2, name: 'Wallets', slug: 'wallets', description: 'Leather wallets and card holders', productCount: 23 },
  { id: 3, name: 'Belts', slug: 'belts', description: 'Handcrafted leather belts', productCount: 12 },
  { id: 4, name: 'Accessories', slug: 'accessories', description: 'Leather accessories', productCount: 8 }
]

// ============================================
// USER FUNCTIONS
// ============================================

export function getUserById(id: string): User | undefined {
  return users.find(u => u.id === id)
}

export function getUserByEmail(email: string): User | undefined {
  return users.find(u => u.email === email)
}

export function createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
  const newUser: User = {
    ...userData,
    id: (users.length + 1).toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  users.push(newUser)
  return newUser
}

export function updateUser(id: string, userData: Partial<User>): User | undefined {
  const index = users.findIndex(u => u.id === id)
  if (index === -1) return undefined
  
  users[index] = {
    ...users[index],
    ...userData,
    updatedAt: new Date().toISOString()
  }
  return users[index]
}

export function deleteUser(id: string): boolean {
  const index = users.findIndex(u => u.id === id)
  if (index === -1) return false
  
  users.splice(index, 1)
  return true
}

export function getAllUsers(): User[] {
  return [...users]
}

// ============================================
// PRODUCT FUNCTIONS
// ============================================

export function getProductById(id: number): Product | undefined {
  return products.find(p => p.id === id)
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(p => p.category === category)
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.featured)
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase()
  return products.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.category.toLowerCase().includes(lowerQuery)
  )
}

export function createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
  const newProduct: Product = {
    ...productData,
    id: products.length + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  products.push(newProduct)
  return newProduct
}

export function updateProduct(id: number, productData: Partial<Product>): Product | undefined {
  const index = products.findIndex(p => p.id === id)
  if (index === -1) return undefined
  
  products[index] = {
    ...products[index],
    ...productData,
    updatedAt: new Date().toISOString()
  }
  return products[index]
}

export function deleteProduct(id: number): boolean {
  const index = products.findIndex(p => p.id === id)
  if (index === -1) return false
  
  products.splice(index, 1)
  return true
}

export function updateProductStock(id: number, quantity: number): Product | undefined {
  const product = getProductById(id)
  if (!product) return undefined
  
  product.stock += quantity
  product.updatedAt = new Date().toISOString()
  return product
}

export function getAllProducts(): Product[] {
  return [...products]
}

export function getProductsPaginated(page: number = 1, limit: number = 10): { 
  products: Product[]; 
  total: number; 
  pages: number 
} {
  const start = (page - 1) * limit
  const paginated = products.slice(start, start + limit)
  
  return {
    products: paginated,
    total: products.length,
    pages: Math.ceil(products.length / limit)
  }
}

// ============================================
// ORDER FUNCTIONS
// ============================================

export function getOrderById(id: string): Order | undefined {
  return orders.find(o => o.id === id)
}

export function getOrdersByUser(userId: string): Order[] {
  return orders.filter(o => o.userId === userId)
}

export function createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order {
  const newOrder: Order = {
    ...orderData,
    id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  orders.push(newOrder)
  return newOrder
}

export function updateOrderStatus(id: string, status: Order['status']): Order | undefined {
  const order = getOrderById(id)
  if (!order) return undefined
  
  order.status = status
  order.updatedAt = new Date().toISOString()
  return order
}

export function updatePaymentStatus(id: string, paymentStatus: Order['paymentStatus']): Order | undefined {
  const order = getOrderById(id)
  if (!order) return undefined
  
  order.paymentStatus = paymentStatus
  order.updatedAt = new Date().toISOString()
  return order
}

export function getAllOrders(): Order[] {
  return [...orders]
}

export function getOrdersByStatus(status: Order['status']): Order[] {
  return orders.filter(o => o.status === status)
}

// ============================================
// CATEGORY FUNCTIONS
// ============================================

export function getCategoryById(id: number): Category | undefined {
  return categories.find(c => c.id === id)
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug)
}

export function getAllCategories(): Category[] {
  return [...categories]
}

// ============================================
// STATS FUNCTIONS
// ============================================

export function getDashboardStats() {
  const totalUsers = users.length
  const totalProducts = products.length
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  
  const ordersByStatus = {
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  }
  
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock < 10).length
  const outOfStockProducts = products.filter(p => p.stock === 0).length
  
  return {
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
    ordersByStatus,
    lowStockProducts,
    outOfStockProducts
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function calculateOrderTotal(items: OrderItem[]): {
  subtotal: number
  tax: number
  shipping: number
  total: number
} {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.08 // 8% tax
  const shipping = subtotal > 100 ? 0 : 10 // Free shipping over $100
  const total = subtotal + tax + shipping
  
  return { subtotal, tax, shipping, total }
}
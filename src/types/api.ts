import { User } from './user'
import { Product, Category } from './product'
import { Order } from './order'

// ============================================
// CORE API TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  errors?: Record<string, string>
  timestamp?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ApiError {
  code: string
  message: string
  field?: string
}

export interface ApiRequest<T = any> {
  data: T
}

// ============================================
// AUTH API
// ============================================

export namespace Auth {
  export interface Login {
    email: string
    password: string
    remember?: boolean
  }

  export interface Register {
    name: string
    email: string
    password: string
    confirmPassword: string
  }

  export interface ForgotPassword {
    email: string
  }

  export interface ResetPassword {
    token: string
    password: string
    confirmPassword: string
  }

  export interface Session {
    authenticated: boolean
    user?: User
  }

  export interface Response {
    user: User
    token?: string
  }
}

// ============================================
// USER API
// ============================================

export namespace Users {
  export interface GetParams {
    page?: number
    limit?: number
    role?: string
    status?: string
    search?: string
  }

  export interface UpdateProfile {
    name?: string
    email?: string
    phone?: string
    avatar?: string
    address?: {
      street?: string
      city?: string
      state?: string
      zipCode?: string
      country?: string
    }
  }

  export interface ChangePassword {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }
}

// ============================================
// PRODUCT API
// ============================================

export namespace Products {
  export interface GetParams {
    page?: number
    limit?: number
    category?: string
    minPrice?: number
    maxPrice?: number
    inStock?: boolean
    featured?: boolean
    search?: string
    sortBy?: 'price' | 'rating' | 'newest' | 'name'
    sortOrder?: 'asc' | 'desc'
  }

  export interface Create {
    name: string
    description: string
    price: number
    salePrice?: number
    category: string
    categoryId: number
    sku: string
    stock: number
    images: string[]
    material?: string
    color?: string
    sizes?: string[]
    featured?: boolean
  }

  export interface Update {
    id: number
    name?: string
    description?: string
    price?: number
    salePrice?: number
    category?: string
    stock?: number
    images?: string[]
    material?: string
    color?: string
    sizes?: string[]
    featured?: boolean
  }

  export interface Review {
    productId: number
    rating: number
    title?: string
    comment: string
    pros?: string[]
    cons?: string[]
  }
}

// ============================================
// ORDER API
// ============================================

export namespace Orders {
  export interface GetParams {
    page?: number
    limit?: number
    status?: string
    paymentStatus?: string
    dateFrom?: string
    dateTo?: string
    search?: string
  }

  export interface Create {
    email: string
    shippingAddress: {
      firstName: string
      lastName: string
      address: string
      apartment?: string
      city: string
      state: string
      zipCode: string
      country: string
      phone: string
    }
    billingAddress?: {
      firstName: string
      lastName: string
      address: string
      apartment?: string
      city: string
      state: string
      zipCode: string
      country: string
    }
    sameAsShipping?: boolean
    items: {
      productId: number
      quantity: number
      size?: string
      color?: string
    }[]
    paymentMethod: 'card' | 'cash_on_delivery' | 'online'
    notes?: string
    couponCode?: string
  }

  export interface UpdateStatus {
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    notes?: string
  }

  export interface UpdatePayment {
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
    transactionId?: string
  }

  export interface ApplyCoupon {
    code: string
    subtotal: number
  }
}

// ============================================
// CART API
// ============================================

export namespace Cart {
  export interface Item {
    productId: number
    quantity: number
    size?: string
    color?: string
  }

  export interface Add extends Item {}

  export interface Update {
    itemId: number
    quantity: number
  }

  export interface Response {
    id: string
    items: Array<{
      id: number
      productId: number
      name: string
      price: number
      quantity: number
      size?: string
      color?: string
      image: string
    }>
    subtotal: number
    total: number
    itemCount: number
  }
}

// ============================================
// DASHBOARD API
// ============================================

export namespace Dashboard {
  export interface Stats {
    users: {
      total: number
      active: number
      new: number
    }
    products: {
      total: number
      lowStock: number
      outOfStock: number
    }
    orders: {
      total: number
      pending: number
      processing: number
      shipped: number
      delivered: number
      cancelled: number
      revenue: number
    }
    revenue: {
      today: number
      week: number
      month: number
      year: number
    }
  }

  export interface Activity {
    id: string
    type: 'order' | 'user' | 'product' | 'review'
    action: string
    user: string
    target: string
    time: string
  }
}

// ============================================
// CATEGORY API
// ============================================

export namespace Categories {
  export interface Create {
    name: string
    slug: string
    description?: string
    image?: string
    parentId?: number
  }

  export interface Update {
    id: number
    name?: string
    slug?: string
    description?: string
    image?: string
    parentId?: number
  }
}

// ============================================
// SEARCH API
// ============================================

export namespace Search {
  export interface Query {
    q: string
    page?: number
    limit?: number
    type?: 'products' | 'categories' | 'all'
  }

  export interface Response {
    products?: Product[]
    categories?: Category[]
    total: number
  }
}

// ============================================
// COUPON API
// ============================================

export namespace Coupons {
  export interface Apply {
    code: string
    subtotal: number
    items?: Array<{
      productId: number
      price: number
      quantity: number
    }>
  }

  export interface Result {
    valid: boolean
    discount: number
    message?: string
  }
}

// ============================================
// PAYMENT API
// ============================================

export namespace Payment {
  export interface Process {
    orderId: string
    paymentMethod: string
    cardDetails?: {
      number: string
      expiry: string
      cvc: string
      name: string
    }
  }

  export interface Response {
    success: boolean
    transactionId?: string
    error?: string
  }
}

// ============================================
// SHIPPING API
// ============================================

export namespace Shipping {
  export interface Calculate {
    country: string
    zipCode: string
    items: Array<{
      weight?: number
      quantity: number
    }>
  }

  export interface Response {
    cost: number
    estimatedDays: number
    methods: Array<{
      id: string
      name: string
      cost: number
      estimatedDays: string
    }>
  }
}

// ============================================
// UPLOAD API
// ============================================

export namespace Upload {
  export interface Request {
    file: File
    type: 'image' | 'document'
    folder?: string
  }

  export interface Response {
    url: string
    filename: string
    size: number
  }
}

// ============================================
// WEBHOOK API
// ============================================

export namespace Webhook {
  export interface Payment {
    event: 'payment.succeeded' | 'payment.failed' | 'payment.refunded'
    data: {
      orderId: string
      transactionId: string
      amount: number
      status: string
    }
  }

  export interface Shipping {
    event: 'tracking.updated' | 'delivery.confirmed'
    data: {
      orderId: string
      trackingNumber: string
      status: string
      location?: string
    }
  }
}

// ============================================
// HELPER TYPES
// ============================================

// Generic params for list endpoints
export interface ListParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Generic ID params
export interface IdParams {
  id: string | number
}

// Generic slug params
export interface SlugParams {
  slug: string
}

// Date range filter
export interface DateRange {
  from?: string
  to?: string
}

// Price range filter
export interface PriceRange {
  min?: number
  max?: number
}
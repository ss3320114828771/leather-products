// ============================================
// APP CONSTANTS
// ============================================

export const APP_NAME = 'Leather E-Commerce'
export const APP_DESCRIPTION = 'Premium leather products crafted with excellence'
export const APP_VERSION = '1.0.0'

// Admin info
export const ADMIN = {
  name: 'Hafiz Sajid Syed',
  email: 'sajid.syed@leather.com',
  phone: '+1 (234) 567-890'
}

// ============================================
// ROUTES
// ============================================

export const ROUTES = {
  home: '/',
  products: '/products',
  product: (id: number | string) => `/products/${id}`,
  category: (slug: string) => `/categories/${slug}`,
  about: '/about',
  contact: '/contact',
  directions: '/directions',
  cart: '/cart',
  checkout: '/checkout',
  login: '/auth/login',
  register: '/auth/register',
  forgotPassword: '/auth/forgot-password',
  dashboard: '/dashboard',
  admin: '/admin',
  adminOrders: '/admin/orders',
  adminProducts: '/admin/products',
  adminUsers: '/admin/users'
}

// ============================================
// API ENDPOINTS
// ============================================

export const API = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    session: '/api/auth/session',
    forgotPassword: '/api/auth/forgot-password',
    resetPassword: '/api/auth/reset-password'
  },
  users: {
    list: '/api/users',
    detail: (id: string) => `/api/users/${id}`,
    profile: '/api/users/profile',
    update: (id: string) => `/api/users/${id}`
  },
  products: {
    list: '/api/products',
    detail: (id: number) => `/api/products/${id}`,
    bySlug: (slug: string) => `/api/products/${slug}`,
    search: '/api/products/search',
    featured: '/api/products/featured',
    related: (id: number) => `/api/products/${id}/related`
  },
  orders: {
    list: '/api/orders',
    detail: (id: string) => `/api/orders/${id}`,
    user: (userId: string) => `/api/orders/user/${userId}`
  },
  cart: {
    get: '/api/cart',
    add: '/api/cart',
    update: '/api/cart',
    remove: (id: number) => `/api/cart?itemId=${id}`,
    clear: '/api/cart'
  },
  categories: {
    list: '/api/categories',
    detail: (id: number) => `/api/categories/${id}`
  }
}

// ============================================
// PAGINATION
// ============================================

export const PAGINATION = {
  defaultPage: 1,
  defaultLimit: 10,
  maxLimit: 100,
  productLimit: 12,
  orderLimit: 10,
  userLimit: 10
}

// ============================================
// PRODUCT CONSTANTS
// ============================================

export const CATEGORIES = [
  { id: 1, name: 'Bags', slug: 'bags' },
  { id: 2, name: 'Wallets', slug: 'wallets' },
  { id: 3, name: 'Belts', slug: 'belts' },
  { id: 4, name: 'Accessories', slug: 'accessories' }
]

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' }
]

export const PRODUCT_STATUS = {
  active: 'active',
  draft: 'draft',
  archived: 'archived'
}

export const STOCK_STATUS = {
  inStock: 'in_stock',
  lowStock: 'low_stock',
  outOfStock: 'out_of_stock'
}

// ============================================
// ORDER CONSTANTS
// ============================================

export const ORDER_STATUS = {
  pending: 'pending',
  processing: 'processing',
  shipped: 'shipped',
  delivered: 'delivered',
  cancelled: 'cancelled'
}

export const PAYMENT_STATUS = {
  pending: 'pending',
  paid: 'paid',
  failed: 'failed',
  refunded: 'refunded'
}

export const PAYMENT_METHODS = [
  { value: 'card', label: 'Credit Card', icon: '💳' },
  { value: 'cash_on_delivery', label: 'Cash on Delivery', icon: '💰' },
  { value: 'online', label: 'Online Payment', icon: '📱' }
]

// ============================================
// USER CONSTANTS
// ============================================

export const USER_ROLES = {
  admin: 'admin',
  staff: 'staff',
  customer: 'customer'
}

export const USER_STATUS = {
  active: 'active',
  inactive: 'inactive',
  pending: 'pending'
}

// ============================================
// CART CONSTANTS
// ============================================

export const CART = {
  maxQuantity: 99,
  freeShippingThreshold: 100,
  taxRate: 0.08,
  defaultShipping: 10
}

// ============================================
// LOCAL STORAGE KEYS
// ============================================

export const STORAGE_KEYS = {
  cart: 'cart',
  wishlist: 'wishlist',
  theme: 'theme',
  user: 'user',
  token: 'token'
}

// ============================================
// COOKIE KEYS
// ============================================

export const COOKIE_KEYS = {
  session: 'session',
  cartId: 'cartId',
  theme: 'theme'
}

// ============================================
// THEME CONSTANTS
// ============================================

export const THEMES = {
  light: 'light',
  dark: 'dark',
  system: 'system'
}

export const COLORS = {
  primary: {
    light: '#8b5cf6',
    dark: '#a78bfa'
  },
  secondary: {
    light: '#ec4899',
    dark: '#f472b6'
  },
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444'
}

// ============================================
// FORMAT CONSTANTS
// ============================================

export const DATE_FORMATS = {
  short: 'MMM dd, yyyy',
  long: 'MMMM dd, yyyy',
  withTime: 'MMM dd, yyyy HH:mm',
  iso: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
}

export const CURRENCY = {
  code: 'USD',
  symbol: '$',
  locale: 'en-US'
}

// ============================================
// VALIDATION CONSTANTS
// ============================================

export const VALIDATION = {
  passwordMinLength: 6,
  passwordMaxLength: 50,
  nameMinLength: 2,
  nameMaxLength: 50,
  phoneRegex: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
}

// ============================================
// ERROR MESSAGES
// ============================================

export const ERROR_MESSAGES = {
  required: 'This field is required',
  invalidEmail: 'Please enter a valid email address',
  invalidPhone: 'Please enter a valid phone number',
  passwordMismatch: "Passwords don't match",
  passwordTooShort: `Password must be at least ${VALIDATION.passwordMinLength} characters`,
  invalidCredentials: 'Invalid email or password',
  unauthorized: 'You must be logged in to access this page',
  forbidden: 'You do not have permission to access this page',
  notFound: 'Page not found',
  serverError: 'Something went wrong. Please try again later.'
}

// ============================================
// SUCCESS MESSAGES
// ============================================

export const SUCCESS_MESSAGES = {
  login: 'Successfully logged in',
  logout: 'Successfully logged out',
  register: 'Account created successfully',
  orderPlaced: 'Order placed successfully',
  profileUpdated: 'Profile updated successfully',
  passwordChanged: 'Password changed successfully',
  cartUpdated: 'Cart updated successfully',
  itemAdded: 'Item added to cart',
  itemRemoved: 'Item removed from cart'
}

// ============================================
// BREAKPOINTS
// ============================================

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}

// ============================================
// ANIMATION CONSTANTS
// ============================================

export const ANIMATION = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500
  },
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
}

// ============================================
// SOCIAL LINKS
// ============================================

export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/leatherstore',
  instagram: 'https://instagram.com/leatherstore',
  twitter: 'https://twitter.com/leatherstore',
  pinterest: 'https://pinterest.com/leatherstore',
  youtube: 'https://youtube.com/leatherstore'
}
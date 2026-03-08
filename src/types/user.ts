import { ID, Role, Status, Timestamps, Order } from './index'

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  apartment?: string
  isDefault?: boolean
}

export interface User {
  id: ID
  email: string
  name: string
  role: Role
  status: Status
  avatar?: string
  phone?: string
  address?: Address
  orders?: Order[]
  wishlist?: number[]
  createdAt: string
  updatedAt: string
  lastLogin?: string
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system'
  notifications?: {
    email: boolean
    push: boolean
    sms: boolean
  }
  newsletter?: boolean
}

export interface UserStats {
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  wishlistCount: number
  reviewCount: number
}

// Login/Register types
export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordReset {
  token: string
  password: string
  confirmPassword: string
}

// Filter types
export interface UserFilters {
  role?: Role
  status?: Status
  search?: string
  dateFrom?: string
  dateTo?: string
}
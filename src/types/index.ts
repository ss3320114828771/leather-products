// Export all types from a single file
export * from './user'
export * from './product'
export * from './order'


// Common shared types
export type ID = string | number

export type Status = 'active' | 'inactive' | 'pending' | 'deleted'

export type Role = 'admin' | 'staff' | 'customer'

export type Timestamps = {
  createdAt: string
  updatedAt: string
}

export type PaginationParams = {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export type PaginatedResponse<T> = {
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

export type ApiResponse<T = any> = {
  success: boolean
  message?: string
  data?: T
  errors?: Record<string, string>
}

export type Address = {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  apartment?: string
}

export type Image = {
  url: string
  alt?: string
  isPrimary?: boolean
}

export type MetaData = {
  title?: string
  description?: string
  keywords?: string[]
}
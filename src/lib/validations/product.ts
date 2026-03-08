import { z } from 'zod'

// Simple product image schema
export const productImageSchema = z.object({
  url: z.string().url(),
  isPrimary: z.boolean().default(false),
  alt: z.string().max(100).optional().nullable()
})

export type ProductImageInput = z.infer<typeof productImageSchema>

// Simple review schema
export const productReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(1).max(100),
  comment: z.string().min(1).max(1000),
  pros: z.array(z.string()).optional().nullable(),
  cons: z.array(z.string()).optional().nullable()
})

export type ProductReviewInput = z.infer<typeof productReviewSchema>

// Simple create product schema
export const createProductSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(5000),
  price: z.number().positive().max(99999.99),
  salePrice: z.number().positive().max(99999.99).optional().nullable(),
  category: z.string().min(1),
  categoryId: z.number().positive(),
  sku: z.string().min(1),
  stock: z.number().int().min(0).max(999999),
  images: z.array(productImageSchema).min(1),
  material: z.string().max(100).optional().nullable(),
  color: z.string().max(50).optional().nullable(),
  sizes: z.array(z.string()).optional().nullable(),
  dimensions: z.string().max(100).optional().nullable(),
  weight: z.string().max(50).optional().nullable(),
  featured: z.boolean().default(false)
}).refine((data) => {
  if (data.salePrice && data.salePrice >= data.price) return false
  return true
}, {
  message: 'Sale price must be less than regular price',
  path: ['salePrice']
})

export type CreateProductInput = z.infer<typeof createProductSchema>

// Simple update product schema
export const updateProductSchema = createProductSchema.partial().extend({
  id: z.number().positive()
})

export type UpdateProductInput = z.infer<typeof updateProductSchema>

// Simple filter schema
export const productFilterSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(50).default(12),
  category: z.string().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  inStock: z.boolean().optional(),
  featured: z.boolean().optional(),
  search: z.string().max(100).optional(),
  sortBy: z.enum(['price', 'rating', 'newest', 'name']).default('newest'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

export type ProductFilterInput = z.infer<typeof productFilterSchema>

// Simple search schema
export const productSearchSchema = z.object({
  q: z.string().min(1).max(100),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(50).default(20)
})

export type ProductSearchInput = z.infer<typeof productSearchSchema>

// Simple inventory schema
export const inventoryUpdateSchema = z.object({
  productId: z.number().positive(),
  quantity: z.number().int(),
  reason: z.enum(['purchase', 'restock', 'return', 'adjustment', 'damage']),
  notes: z.string().max(500).optional().nullable()
})

export type InventoryUpdateInput = z.infer<typeof inventoryUpdateSchema>

// Simple bulk import schema
export const bulkProductImportSchema = z.array(createProductSchema).min(1).max(100)

export type BulkProductImportInput = z.infer<typeof bulkProductImportSchema>

// Simple category schema
export const categorySchema = z.object({
  name: z.string().min(2).max(50),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional().nullable(),
  image: z.string().url().optional().nullable(),
  parentId: z.number().positive().optional().nullable()
})

export type CategoryInput = z.infer<typeof categorySchema>

// ONE validation function
export function validateProduct(data: unknown) {
  try {
    const result = createProductSchema.parse(data)
    return { valid: true, data: result }
  } catch (error: any) {
    const errors: Record<string, string> = {}
    if (error.errors) {
      error.errors.forEach((e: any) => {
        const field = e.path[0]?.toString() || 'form'
        errors[field] = e.message
      })
    }
    return { valid: false, errors }
  }
}

// Simple slug generator
export function generateProductSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Simple price formatter
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`
}

// Simple discount calculator
export function calculateDiscount(price: number, salePrice: number): number {
  if (price <= 0 || salePrice <= 0) return 0
  return Math.round(((price - salePrice) / price) * 100)
}

// Simple stock status
export function getStockStatus(stock: number) {
  if (stock <= 0) return { status: 'out', text: 'Out of Stock' }
  if (stock < 10) return { status: 'low', text: `Only ${stock} left` }
  return { status: 'in', text: 'In Stock' }
}

// Simple price range check
export function isValidPriceRange(min?: number, max?: number): boolean {
  if (min && max && min > max) return false
  return true
}

// Simple search cleaner
export function cleanSearch(query: string): string {
  return query.trim().replace(/[<>]/g, '').slice(0, 100)
}

// Helper to get error
export function getProductError(errors: any, field: string) {
  return errors?.[field]
}
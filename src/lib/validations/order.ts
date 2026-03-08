import { z } from 'zod'

// Simple address schema
export const addressSchema = z.object({
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  address: z.string().min(1, 'Address required'),
  apartment: z.string().optional().nullable(),
  city: z.string().min(1, 'City required'),
  state: z.string().min(1, 'State required'),
  zipCode: z.string().min(1, 'ZIP required'),
  country: z.string().default('USA'),
  phone: z.string().min(1, 'Phone required')
})

export type AddressInput = z.infer<typeof addressSchema>

// Simple order item
export const orderItemSchema = z.object({
  productId: z.number().positive(),
  name: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  size: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  image: z.string().url()
})

export type OrderItemInput = z.infer<typeof orderItemSchema>

// Simple create order
export const createOrderSchema = z.object({
  email: z.string().email(),
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional().nullable(),
  sameAsShipping: z.boolean().default(true),
  items: z.array(orderItemSchema).min(1),
  paymentMethod: z.enum(['card', 'cash_on_delivery', 'online']),
  notes: z.string().optional().nullable(),
  saveInfo: z.boolean().default(false)
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>

// Simple status update
export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  notes: z.string().optional().nullable()
})

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>

// Simple payment update
export const updatePaymentStatusSchema = z.object({
  paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']),
  transactionId: z.string().optional().nullable()
})

export type UpdatePaymentStatusInput = z.infer<typeof updatePaymentStatusSchema>

// Simple filter
export const orderFilterSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
  paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
  search: z.string().optional()
})

export type OrderFilterInput = z.infer<typeof orderFilterSchema>

// Simple coupon
export const couponSchema = z.object({
  code: z.string().min(1).max(20)
})

export type CouponInput = z.infer<typeof couponSchema>

// ONE validation function for everything
export function validateOrder(data: unknown) {
  try {
    const result = createOrderSchema.parse(data)
    return { valid: true, data: result }
  } catch (error: any) {
    const errors: Record<string, string> = {}
    if (error.errors) {
      error.errors.forEach((e: any) => {
        const field = e.path[0] || 'form'
        errors[field] = e.message
      })
    }
    return { valid: false, errors }
  }
}

// Simple shipping calculator
export function calculateShipping(country: string, subtotal: number): number {
  if (subtotal >= 100) return 0
  
  const rates: Record<string, number> = {
    'USA': 10,
    'Canada': 15,
    'UK': 20,
  }
  return rates[country] || 25
}

// Simple tax calculator
export function calculateTax(subtotal: number, country: string = 'USA'): number {
  const rates: Record<string, number> = {
    'USA': 0.08,
    'Canada': 0.13,
    'UK': 0.20,
  }
  return subtotal * (rates[country] || 0.10)
}

// Simple order number formatter
export function formatOrderNumber(id: number): string {
  return `ORD-${id.toString().padStart(6, '0')}`
}

// Simple status color
export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'yellow',
    processing: 'blue',
    shipped: 'purple',
    delivered: 'green',
    cancelled: 'red'
  }
  return colors[status] || 'gray'
}

// Simple payment color
export function getPaymentStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'yellow',
    paid: 'green',
    failed: 'red',
    refunded: 'blue'
  }
  return colors[status] || 'gray'
}

// Helper to get error
export function getOrderError(errors: any, field: string) {
  return errors?.[field]
}
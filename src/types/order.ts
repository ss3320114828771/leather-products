import { ID, Address, Timestamps } from './index'

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
export type PaymentMethod = 'card' | 'cash_on_delivery' | 'online' | 'bank_transfer'

export interface Order {
  id: ID
  orderNumber: string
  userId: ID
  customerName: string
  customerEmail: string
  customerPhone: string
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod
  shippingAddress: Address
  billingAddress?: Address
  notes?: string
  trackingNumber?: string
  estimatedDelivery?: string
  deliveredAt?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: ID
  productId: ID
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
  image: string
  discount?: number
  total: number
}

export interface OrderSummary {
  id: ID
  orderNumber: string
  date: string
  status: OrderStatus
  total: number
  itemCount: number
}

export interface Shipment {
  id: ID
  orderId: ID
  carrier: string
  trackingNumber: string
  status: 'pending' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered'
  estimatedDelivery: string
  actualDelivery?: string
  trackingUrl?: string
  events: ShipmentEvent[]
}

export interface ShipmentEvent {
  date: string
  location: string
  status: string
  description?: string
}

export interface Payment {
  id: ID
  orderId: ID
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  transactionId?: string
  cardLast4?: string
  paidAt?: string
  refundedAt?: string
}

export interface Coupon {
  id: ID
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minPurchase?: number
  maxDiscount?: number
  validFrom: string
  validUntil: string
  usageLimit?: number
  usedCount: number
  applicableCategories?: string[]
  applicableProducts?: number[]
}

// Filter types
export interface OrderFilters {
  status?: OrderStatus
  paymentStatus?: PaymentStatus
  dateFrom?: string
  dateTo?: string
  search?: string
  userId?: ID
  minTotal?: number
  maxTotal?: number
}

export interface OrderStats {
  total: number
  pending: number
  processing: number
  shipped: number
  delivered: number
  cancelled: number
  revenue: number
  averageOrderValue: number
}

// Create/Update types
export type CreateOrderInput = Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'status' | 'paymentStatus'>
export type UpdateOrderInput = Partial<Pick<Order, 'status' | 'paymentStatus' | 'trackingNumber' | 'notes'>> & { id: ID }

export type ApplyCouponInput = {
  code: string
  subtotal: number
  items?: OrderItem[]
}

export interface CouponValidationResult {
  valid: boolean
  discount: number
  message?: string
}
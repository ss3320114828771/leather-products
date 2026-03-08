'use client'

import { useState } from 'react'
import Link from 'next/link'

interface CartSummaryProps {
  subtotal: number
  shipping?: number
  tax?: number
  discount?: number
  couponCode?: string
  onApplyCoupon?: (code: string) => Promise<boolean>
  onCheckout?: () => void
  checkoutLink?: string
  showCheckoutButton?: boolean
  isLoading?: boolean
}

export default function CartSummary({
  subtotal,
  shipping = 10,
  tax = subtotal * 0.08,
  discount = 0,
  couponCode: initialCoupon = '',
  onApplyCoupon,
  onCheckout,
  checkoutLink = '/checkout',
  showCheckoutButton = true,
  isLoading = false
}: CartSummaryProps) {
  const [couponCode, setCouponCode] = useState(initialCoupon)
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  const [couponError, setCouponError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState('')

  // Calculate totals
  const calculatedTax = typeof tax === 'function' ? tax : tax
  const calculatedShipping = shipping
  const calculatedDiscount = discount
  const total = subtotal + calculatedShipping + calculatedTax - calculatedDiscount

  const handleApplyCoupon = async () => {
    if (!couponCode.trim() || !onApplyCoupon) return

    setIsApplyingCoupon(true)
    setCouponError('')
    setCouponSuccess('')

    try {
      const success = await onApplyCoupon(couponCode)
      if (success) {
        setCouponSuccess('Coupon applied successfully!')
        setCouponError('')
      } else {
        setCouponError('Invalid coupon code')
        setCouponSuccess('')
      }
    } catch (error) {
      setCouponError('Error applying coupon')
    } finally {
      setIsApplyingCoupon(false)
    }
  }

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout()
    }
  }

  return (
    <div className="bg-white/5 rounded-xl p-6 sticky top-24">
      <h2 className="text-xl font-bold mb-4">
        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Order Summary
        </span>
      </h2>

      {/* Loading State */}
      {isLoading ? (
        <div className="space-y-3">
          <div className="h-4 bg-white/10 rounded animate-pulse"></div>
          <div className="h-4 bg-white/10 rounded animate-pulse w-2/3"></div>
          <div className="h-4 bg-white/10 rounded animate-pulse w-1/2"></div>
        </div>
      ) : (
        <>
          {/* Summary Items */}
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Shipping</span>
              {calculatedShipping === 0 ? (
                <span className="text-green-400">Free</span>
              ) : (
                <span>${calculatedShipping.toFixed(2)}</span>
              )}
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Tax (8%)</span>
              <span>${calculatedTax.toFixed(2)}</span>
            </div>

            {calculatedDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-400">
                <span>Discount</span>
                <span>-${calculatedDiscount.toFixed(2)}</span>
              </div>
            )}

            {/* Free Shipping Threshold */}
            {subtotal < 100 && (
              <div className="mt-2 p-2 bg-blue-500/10 rounded-lg text-xs text-blue-400">
                🚚 Add ${(100 - subtotal).toFixed(2)} more for free shipping
              </div>
            )}
          </div>

          {/* Coupon Code */}
          {onApplyCoupon && (
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">
                Coupon Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition text-white text-sm"
                  disabled={isApplyingCoupon}
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={!couponCode.trim() || isApplyingCoupon}
                  className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm hover:bg-purple-500/30 transition disabled:opacity-50"
                >
                  {isApplyingCoupon ? '...' : 'Apply'}
                </button>
              </div>
              {couponError && (
                <p className="text-xs text-red-400 mt-1">{couponError}</p>
              )}
              {couponSuccess && (
                <p className="text-xs text-green-400 mt-1">{couponSuccess}</p>
              )}
            </div>
          )}

          {/* Total */}
          <div className="border-t border-white/10 pt-4 mb-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-purple-400">${total.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Including ${calculatedTax.toFixed(2)} in taxes
            </p>
          </div>

          {/* Checkout Button */}
          {showCheckoutButton && (
            <>
              {checkoutLink ? (
                <Link
                  href={checkoutLink}
                  className="block w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold text-center hover:shadow-lg hover:shadow-purple-500/50 transition"
                >
                  Proceed to Checkout
                </Link>
              ) : (
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition"
                >
                  Proceed to Checkout
                </button>
              )}

              {/* Payment Icons */}
              <div className="flex justify-center gap-2 mt-3 text-2xl">
                <span>💳</span>
                <span>📱</span>
                <span>🏦</span>
                <span>💰</span>
              </div>

              <p className="text-xs text-gray-500 text-center mt-2">
                Secure checkout powered by Leather E-Commerce
              </p>
            </>
          )}
        </>
      )}
    </div>
  )
}
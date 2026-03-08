'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CheckoutFormProps {
  onSubmit?: (data: CheckoutData) => Promise<void>
  onSuccess?: () => void
  isLoading?: boolean
}

interface CheckoutData {
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
  paymentMethod: 'card' | 'cash_on_delivery' | 'online'
  saveInfo?: boolean
  notes?: string
}

export default function CheckoutForm({ onSubmit, onSuccess, isLoading: externalLoading }: CheckoutFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [sameAsShipping, setSameAsShipping] = useState(true)
  
  const [formData, setFormData] = useState<CheckoutData>({
    email: '',
    shippingAddress: {
      firstName: '',
      lastName: '',
      address: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
      phone: ''
    },
    billingAddress: {
      firstName: '',
      lastName: '',
      address: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    paymentMethod: 'card',
    saveInfo: false,
    notes: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData(prev => {
      if (section === 'shipping' || section === 'billing') {
        const addressSection = section === 'shipping' ? 'shippingAddress' : 'billingAddress'
        return {
          ...prev,
          [addressSection]: {
            ...prev[addressSection],
            [field]: value
          }
        }
      }
      return {
        ...prev,
        [field]: value
      }
    })

    // Clear error for this field
    if (errors[`${section}.${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[`${section}.${field}`]
        return newErrors
      })
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      // Validate email
      if (!formData.email) {
        newErrors['email'] = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors['email'] = 'Email is invalid'
      }

      // Validate shipping address
      const ship = formData.shippingAddress
      if (!ship.firstName) newErrors['shipping.firstName'] = 'First name is required'
      if (!ship.lastName) newErrors['shipping.lastName'] = 'Last name is required'
      if (!ship.address) newErrors['shipping.address'] = 'Address is required'
      if (!ship.city) newErrors['shipping.city'] = 'City is required'
      if (!ship.state) newErrors['shipping.state'] = 'State is required'
      if (!ship.zipCode) newErrors['shipping.zipCode'] = 'ZIP code is required'
      if (!ship.phone) newErrors['shipping.phone'] = 'Phone number is required'
    }

    if (step === 2 && !sameAsShipping) {
      // Validate billing address
      const bill = formData.billingAddress
      if (!bill?.firstName) newErrors['billing.firstName'] = 'First name is required'
      if (!bill?.lastName) newErrors['billing.lastName'] = 'Last name is required'
      if (!bill?.address) newErrors['billing.address'] = 'Address is required'
      if (!bill?.city) newErrors['billing.city'] = 'City is required'
      if (!bill?.state) newErrors['billing.state'] = 'State is required'
      if (!bill?.zipCode) newErrors['billing.zipCode'] = 'ZIP code is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setIsLoading(true)
    try {
      if (onSubmit) {
        await onSubmit(formData)
      } else {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
      
      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/checkout/success')
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loading = externalLoading || isLoading

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex-1 text-center">
            <div className={`relative`}>
              <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                step < currentStep ? 'bg-green-500/20 text-green-400' :
                step === currentStep ? 'bg-purple-500/20 text-purple-400' :
                'bg-white/5 text-gray-400'
              }`}>
                {step < currentStep ? '✓' : step}
              </div>
              <p className="text-xs mt-1 text-gray-400">
                {step === 1 ? 'Shipping' : step === 2 ? 'Billing' : 'Payment'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Step 1: Shipping Information */}
      {currentStep === 1 && (
        <div className="bg-white/5 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4 text-purple-400">Shipping Information</h2>
          
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('', 'email', e.target.value)}
                className={`w-full px-4 py-2 bg-white/5 border rounded-lg focus:outline-none focus:border-purple-500 transition text-white ${
                  errors.email ? 'border-red-500' : 'border-white/10'
                }`}
                placeholder="sajid.syed@leather.com"
              />
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
            </div>

            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.shippingAddress.firstName}
                  onChange={(e) => handleInputChange('shipping', 'firstName', e.target.value)}
                  className={`w-full px-4 py-2 bg-white/5 border rounded-lg focus:outline-none focus:border-purple-500 transition text-white ${
                    errors['shipping.firstName'] ? 'border-red-500' : 'border-white/10'
                  }`}
                />
                {errors['shipping.firstName'] && <p className="text-xs text-red-400 mt-1">{errors['shipping.firstName']}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.shippingAddress.lastName}
                  onChange={(e) => handleInputChange('shipping', 'lastName', e.target.value)}
                  className={`w-full px-4 py-2 bg-white/5 border rounded-lg focus:outline-none focus:border-purple-500 transition text-white ${
                    errors['shipping.lastName'] ? 'border-red-500' : 'border-white/10'
                  }`}
                />
                {errors['shipping.lastName'] && <p className="text-xs text-red-400 mt-1">{errors['shipping.lastName']}</p>}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Address</label>
              <input
                type="text"
                value={formData.shippingAddress.address}
                onChange={(e) => handleInputChange('shipping', 'address', e.target.value)}
                className={`w-full px-4 py-2 bg-white/5 border rounded-lg focus:outline-none focus:border-purple-500 transition text-white ${
                  errors['shipping.address'] ? 'border-red-500' : 'border-white/10'
                }`}
              />
              {errors['shipping.address'] && <p className="text-xs text-red-400 mt-1">{errors['shipping.address']}</p>}
            </div>

            {/* Apartment */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Apartment, Suite, etc. (optional)</label>
              <input
                type="text"
                value={formData.shippingAddress.apartment}
                onChange={(e) => handleInputChange('shipping', 'apartment', e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition text-white"
              />
            </div>

            {/* City, State, ZIP */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">City</label>
                <input
                  type="text"
                  value={formData.shippingAddress.city}
                  onChange={(e) => handleInputChange('shipping', 'city', e.target.value)}
                  className={`w-full px-4 py-2 bg-white/5 border rounded-lg focus:outline-none focus:border-purple-500 transition text-white ${
                    errors['shipping.city'] ? 'border-red-500' : 'border-white/10'
                  }`}
                />
                {errors['shipping.city'] && <p className="text-xs text-red-400 mt-1">{errors['shipping.city']}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">State</label>
                <input
                  type="text"
                  value={formData.shippingAddress.state}
                  onChange={(e) => handleInputChange('shipping', 'state', e.target.value)}
                  className={`w-full px-4 py-2 bg-white/5 border rounded-lg focus:outline-none focus:border-purple-500 transition text-white ${
                    errors['shipping.state'] ? 'border-red-500' : 'border-white/10'
                  }`}
                />
                {errors['shipping.state'] && <p className="text-xs text-red-400 mt-1">{errors['shipping.state']}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">ZIP Code</label>
                <input
                  type="text"
                  value={formData.shippingAddress.zipCode}
                  onChange={(e) => handleInputChange('shipping', 'zipCode', e.target.value)}
                  className={`w-full px-4 py-2 bg-white/5 border rounded-lg focus:outline-none focus:border-purple-500 transition text-white ${
                    errors['shipping.zipCode'] ? 'border-red-500' : 'border-white/10'
                  }`}
                />
                {errors['shipping.zipCode'] && <p className="text-xs text-red-400 mt-1">{errors['shipping.zipCode']}</p>}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.shippingAddress.phone}
                onChange={(e) => handleInputChange('shipping', 'phone', e.target.value)}
                className={`w-full px-4 py-2 bg-white/5 border rounded-lg focus:outline-none focus:border-purple-500 transition text-white ${
                  errors['shipping.phone'] ? 'border-red-500' : 'border-white/10'
                }`}
                placeholder="+1 (234) 567-890"
              />
              {errors['shipping.phone'] && <p className="text-xs text-red-400 mt-1">{errors['shipping.phone']}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Billing Information */}
      {currentStep === 2 && (
        <div className="bg-white/5 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4 text-purple-400">Billing Information</h2>
          
          {/* Same as shipping toggle */}
          <div className="mb-6 p-4 bg-white/5 rounded-lg">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={sameAsShipping}
                onChange={(e) => setSameAsShipping(e.target.checked)}
                className="rounded border-white/10 bg-white/5"
              />
              <span className="text-sm text-gray-300">Billing address same as shipping</span>
            </label>
          </div>

          {!sameAsShipping && (
            <div className="space-y-4">
              {/* Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">First Name</label>
                  <input
                    type="text"
                    value={formData.billingAddress?.firstName}
                    onChange={(e) => handleInputChange('billing', 'firstName', e.target.value)}
                    className={`w-full px-4 py-2 bg-white/5 border rounded-lg focus:outline-none focus:border-purple-500 transition text-white ${
                      errors['billing.firstName'] ? 'border-red-500' : 'border-white/10'
                    }`}
                  />
                  {errors['billing.firstName'] && <p className="text-xs text-red-400 mt-1">{errors['billing.firstName']}</p>}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.billingAddress?.lastName}
                    onChange={(e) => handleInputChange('billing', 'lastName', e.target.value)}
                    className={`w-full px-4 py-2 bg-white/5 border rounded-lg focus:outline-none focus:border-purple-500 transition text-white ${
                      errors['billing.lastName'] ? 'border-red-500' : 'border-white/10'
                    }`}
                  />
                  {errors['billing.lastName'] && <p className="text-xs text-red-400 mt-1">{errors['billing.lastName']}</p>}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Address</label>
                <input
                  type="text"
                  value={formData.billingAddress?.address}
                  onChange={(e) => handleInputChange('billing', 'address', e.target.value)}
                  className={`w-full px-4 py-2 bg-white/5 border rounded-lg focus:outline-none focus:border-purple-500 transition text-white ${
                    errors['billing.address'] ? 'border-red-500' : 'border-white/10'
                  }`}
                />
                {errors['billing.address'] && <p className="text-xs text-red-400 mt-1">{errors['billing.address']}</p>}
              </div>

              {/* Apartment */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Apartment, Suite, etc. (optional)</label>
                <input
                  type="text"
                  value={formData.billingAddress?.apartment}
                  onChange={(e) => handleInputChange('billing', 'apartment', e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition text-white"
                />
              </div>

              {/* City, State, ZIP */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">City</label>
                  <input
                    type="text"
                    value={formData.billingAddress?.city}
                    onChange={(e) => handleInputChange('billing', 'city', e.target.value)}
                    className={`w-full px-4 py-2 bg-white/5 border rounded-lg focus:outline-none focus:border-purple-500 transition text-white ${
                      errors['billing.city'] ? 'border-red-500' : 'border-white/10'
                    }`}
                  />
                  {errors['billing.city'] && <p className="text-xs text-red-400 mt-1">{errors['billing.city']}</p>}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">State</label>
                  <input
                    type="text"
                    value={formData.billingAddress?.state}
                    onChange={(e) => handleInputChange('billing', 'state', e.target.value)}
                    className={`w-full px-4 py-2 bg-white/5 border rounded-lg focus:outline-none focus:border-purple-500 transition text-white ${
                      errors['billing.state'] ? 'border-red-500' : 'border-white/10'
                    }`}
                  />
                  {errors['billing.state'] && <p className="text-xs text-red-400 mt-1">{errors['billing.state']}</p>}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">ZIP Code</label>
                  <input
                    type="text"
                    value={formData.billingAddress?.zipCode}
                    onChange={(e) => handleInputChange('billing', 'zipCode', e.target.value)}
                    className={`w-full px-4 py-2 bg-white/5 border rounded-lg focus:outline-none focus:border-purple-500 transition text-white ${
                      errors['billing.zipCode'] ? 'border-red-500' : 'border-white/10'
                    }`}
                  />
                  {errors['billing.zipCode'] && <p className="text-xs text-red-400 mt-1">{errors['billing.zipCode']}</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Payment Method */}
      {currentStep === 3 && (
        <div className="bg-white/5 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4 text-purple-400">Payment Method</h2>
          
          <div className="space-y-4">
            {/* Payment Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label className={`p-4 border rounded-lg cursor-pointer transition ${
                formData.paymentMethod === 'card' 
                  ? 'border-purple-500 bg-purple-500/10' 
                  : 'border-white/10 hover:border-white/20'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: 'card' }))}
                  className="hidden"
                />
                <div className="text-center">
                  <span className="text-3xl mb-2 block">💳</span>
                  <span className="font-medium">Credit Card</span>
                </div>
              </label>

              <label className={`p-4 border rounded-lg cursor-pointer transition ${
                formData.paymentMethod === 'online' 
                  ? 'border-purple-500 bg-purple-500/10' 
                  : 'border-white/10 hover:border-white/20'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={formData.paymentMethod === 'online'}
                  onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: 'online' }))}
                  className="hidden"
                />
                <div className="text-center">
                  <span className="text-3xl mb-2 block">📱</span>
                  <span className="font-medium">Online Payment</span>
                </div>
              </label>

              <label className={`p-4 border rounded-lg cursor-pointer transition ${
                formData.paymentMethod === 'cash_on_delivery' 
                  ? 'border-purple-500 bg-purple-500/10' 
                  : 'border-white/10 hover:border-white/20'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="cash_on_delivery"
                  checked={formData.paymentMethod === 'cash_on_delivery'}
                  onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: 'cash_on_delivery' }))}
                  className="hidden"
                />
                <div className="text-center">
                  <span className="text-3xl mb-2 block">💰</span>
                  <span className="font-medium">Cash on Delivery</span>
                </div>
              </label>
            </div>

            {/* Order Notes */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Order Notes (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition text-white"
                placeholder="Special instructions for delivery..."
              />
            </div>

            {/* Save Info */}
            <div className="p-4 bg-white/5 rounded-lg">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.saveInfo}
                  onChange={(e) => setFormData(prev => ({ ...prev, saveInfo: e.target.checked }))}
                  className="rounded border-white/10 bg-white/5"
                />
                <span className="text-sm text-gray-300">Save this information for next time</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3 mt-6">
        {currentStep > 1 && (
          <button
            onClick={handleBack}
            disabled={loading}
            className="flex-1 py-3 bg-white/5 rounded-lg font-semibold hover:bg-white/10 transition disabled:opacity-50"
          >
            Back
          </button>
        )}
        
        {currentStep < 3 ? (
          <button
            onClick={handleNext}
            disabled={loading}
            className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>✅</span>
                <span>Place Order</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
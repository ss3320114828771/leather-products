// ============================================
// DATE FORMATTING
// ============================================

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 7) return formatDate(d)
  if (days > 0) return `${days} day${days === 1 ? '' : 's'} ago`
  if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  return 'just now'
}

// ============================================
// NUMBER FORMATTING
// ============================================

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

export function formatCompactNumber(num: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short'
  }).format(num)
}

export function formatPercentage(num: number): string {
  return `${num.toFixed(1)}%`
}

// ============================================
// TEXT FORMATTING
// ============================================

export function capitalize(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function capitalizeWords(str: string): string {
  if (!str) return ''
  return str.split(' ').map(capitalize).join(' ')
}

export function truncate(str: string, length: number = 100): string {
  if (!str || str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function maskEmail(email: string): string {
  const [name, domain] = email.split('@')
  if (!domain) return email
  const maskedName = name.charAt(0) + '***' + name.charAt(name.length - 1)
  return `${maskedName}@${domain}`
}

export function maskPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const last4 = cleaned.slice(-4)
  return `***-***-${last4}`
}

// ============================================
// NAME FORMATTING
// ============================================

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function formatFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim()
}

// ============================================
// ADDRESS FORMATTING
// ============================================

export function formatAddress(address: {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  apartment?: string
}): string {
  const parts = [
    address.street,
    address.apartment,
    `${address.city}, ${address.state} ${address.zipCode}`,
    address.country
  ].filter(Boolean)
  
  return parts.join(', ')
}

// ============================================
// ORDER FORMATTING
// ============================================

export function formatOrderNumber(id: number | string): string {
  return `ORD-${String(id).padStart(6, '0')}`
}

export function formatOrderStatus(status: string): string {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// ============================================
// SIZE FORMATTING
// ============================================

export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`
}

// ============================================
// PRICE FORMATTING
// ============================================

export function formatDiscount(original: number, sale: number): string {
  const discount = ((original - sale) / original) * 100
  return `-${Math.round(discount)}%`
}

export function formatPriceRange(min: number, max: number): string {
  return `${formatCurrency(min)} - ${formatCurrency(max)}`
}

// ============================================
// PHONE FORMATTING
// ============================================

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}
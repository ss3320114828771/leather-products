'use client'

import { useEffect, useState } from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: string
  color?: 'purple' | 'blue' | 'green' | 'yellow' | 'red' | 'pink'
  trend?: number
  trendLabel?: string
  loading?: boolean
}

export default function StatsCard({ 
  title, 
  value, 
  icon, 
  color = 'purple',
  trend,
  trendLabel,
  loading = false
}: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(value)

  // Animate value change
  useEffect(() => {
    setDisplayValue(value)
  }, [value])

  // Get color classes
  const getColorClasses = () => {
    switch(color) {
      case 'purple':
        return {
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/20',
          text: 'text-purple-400',
          gradient: 'from-purple-500 to-pink-500',
          iconBg: 'bg-purple-500/20'
        }
      case 'blue':
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/20',
          text: 'text-blue-400',
          gradient: 'from-blue-500 to-cyan-500',
          iconBg: 'bg-blue-500/20'
        }
      case 'green':
        return {
          bg: 'bg-green-500/10',
          border: 'border-green-500/20',
          text: 'text-green-400',
          gradient: 'from-green-500 to-emerald-500',
          iconBg: 'bg-green-500/20'
        }
      case 'yellow':
        return {
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/20',
          text: 'text-yellow-400',
          gradient: 'from-yellow-500 to-orange-500',
          iconBg: 'bg-yellow-500/20'
        }
      case 'red':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/20',
          text: 'text-red-400',
          gradient: 'from-red-500 to-pink-500',
          iconBg: 'bg-red-500/20'
        }
      case 'pink':
        return {
          bg: 'bg-pink-500/10',
          border: 'border-pink-500/20',
          text: 'text-pink-400',
          gradient: 'from-pink-500 to-rose-500',
          iconBg: 'bg-pink-500/20'
        }
      default:
        return {
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/20',
          text: 'text-purple-400',
          gradient: 'from-purple-500 to-pink-500',
          iconBg: 'bg-purple-500/20'
        }
    }
  }

  const colors = getColorClasses()

  // Format value if it's a number
  const formattedValue = typeof value === 'number' 
    ? value.toLocaleString() 
    : value

  if (loading) {
    return (
      <div className={`${colors.bg} ${colors.border} border rounded-xl p-6 animate-pulse`}>
        <div className="flex justify-between items-start mb-4">
          <div className={`w-12 h-12 rounded-lg ${colors.iconBg}`}></div>
          <div className="w-16 h-6 bg-white/10 rounded-full"></div>
        </div>
        <div className="h-8 w-24 bg-white/10 rounded mb-2"></div>
        <div className="h-4 w-32 bg-white/10 rounded"></div>
      </div>
    )
  }

  return (
    <div className={`${colors.bg} ${colors.border} border rounded-xl p-6 hover:shadow-lg hover:shadow-${color}-500/10 transition-all duration-300`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-lg ${colors.iconBg} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
            trend > 0 ? 'bg-green-500/20 text-green-400' : 
            trend < 0 ? 'bg-red-500/20 text-red-400' : 
            'bg-gray-500/20 text-gray-400'
          }`}>
            <span>{trend > 0 ? '↑' : trend < 0 ? '↓' : '→'}</span>
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-1">
        <span className="text-3xl font-bold">{formattedValue}</span>
      </div>

      {/* Title */}
      <p className="text-sm text-gray-400">{title}</p>

      {/* Trend Label */}
      {trendLabel && (
        <p className="text-xs text-gray-500 mt-2">{trendLabel}</p>
      )}

      {/* Decorative Gradient Line */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.gradient} rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>
    </div>
  )
}

// Stats Cards Grid Component
interface StatsCardsGridProps {
  cards: {
    title: string
    value: string | number
    icon: string
    color?: 'purple' | 'blue' | 'green' | 'yellow' | 'red' | 'pink'
    trend?: number
    trendLabel?: string
  }[]
  loading?: boolean
  columns?: 2 | 3 | 4
}

export function StatsCardsGrid({ cards, loading = false, columns = 4 }: StatsCardsGridProps) {
  const getGridCols = () => {
    switch(columns) {
      case 2: return 'grid-cols-1 sm:grid-cols-2'
      case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      case 4: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
    }
  }

  if (loading) {
    return (
      <div className={`grid ${getGridCols()} gap-4`}>
        {[...Array(cards.length)].map((_, i) => (
          <StatsCard
            key={i}
            title=""
            value=""
            icon=""
            loading={true}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={`grid ${getGridCols()} gap-4`}>
      {cards.map((card, index) => (
        <StatsCard
          key={index}
          title={card.title}
          value={card.value}
          icon={card.icon}
          color={card.color}
          trend={card.trend}
          trendLabel={card.trendLabel}
        />
      ))}
    </div>
  )
}

// Interactive Stats Card with click handler
interface InteractiveStatsCardProps extends StatsCardProps {
  onClick?: () => void
  href?: string
}

export function InteractiveStatsCard({ onClick, href, ...props }: InteractiveStatsCardProps) {
  const colors = getColorClasses(props.color || 'purple')

  if (href) {
    return (
      <a href={href} className="block group">
        <StatsCard {...props} />
      </a>
    )
  }

  return (
    <button 
      onClick={onClick} 
      className="w-full text-left group focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-xl"
    >
      <StatsCard {...props} />
    </button>
  )
}

// Helper function for color classes (used in InteractiveStatsCard)
function getColorClasses(color: string) {
  switch(color) {
    case 'purple':
      return {
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20',
        text: 'text-purple-400',
        gradient: 'from-purple-500 to-pink-500',
        iconBg: 'bg-purple-500/20'
      }
    case 'blue':
      return {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        text: 'text-blue-400',
        gradient: 'from-blue-500 to-cyan-500',
        iconBg: 'bg-blue-500/20'
      }
    case 'green':
      return {
        bg: 'bg-green-500/10',
        border: 'border-green-500/20',
        text: 'text-green-400',
        gradient: 'from-green-500 to-emerald-500',
        iconBg: 'bg-green-500/20'
      }
    case 'yellow':
      return {
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/20',
        text: 'text-yellow-400',
        gradient: 'from-yellow-500 to-orange-500',
        iconBg: 'bg-yellow-500/20'
      }
    case 'red':
      return {
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
        text: 'text-red-400',
        gradient: 'from-red-500 to-pink-500',
        iconBg: 'bg-red-500/20'
      }
    case 'pink':
      return {
        bg: 'bg-pink-500/10',
        border: 'border-pink-500/20',
        text: 'text-pink-400',
        gradient: 'from-pink-500 to-rose-500',
        iconBg: 'bg-pink-500/20'
      }
    default:
      return {
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20',
        text: 'text-purple-400',
        gradient: 'from-purple-500 to-pink-500',
        iconBg: 'bg-purple-500/20'
      }
  }
}

// Example usage component
export function DashboardStats() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const statsCards = [
    {
      title: 'Total Revenue',
      value: 52837,
      icon: '💰',
      color: 'green' as const,
      trend: 12.5,
      trendLabel: 'vs last month'
    },
    {
      title: 'Total Orders',
      value: 1234,
      icon: '📦',
      color: 'blue' as const,
      trend: 8.2,
      trendLabel: 'vs last month'
    },
    {
      title: 'Total Customers',
      value: 892,
      icon: '👥',
      color: 'purple' as const,
      trend: 15.3,
      trendLabel: 'vs last month'
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      icon: '📈',
      color: 'yellow' as const,
      trend: -2.1,
      trendLabel: 'vs last month'
    }
  ]

  return (
    <div className="space-y-6">
      <StatsCardsGrid cards={statsCards} loading={loading} columns={4} />
      
      {/* Interactive Cards Example */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InteractiveStatsCard
          title="View Reports"
          value="24"
          icon="📊"
          color="pink"
          onClick={() => alert('Viewing reports')}
        />
        <InteractiveStatsCard
          title="Settings"
          value="8"
          icon="⚙️"
          color="yellow"
          href="/admin/settings"
        />
      </div>
    </div>
  )
}
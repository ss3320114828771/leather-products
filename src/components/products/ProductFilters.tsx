'use client'

import { useState } from 'react'

interface FilterOption {
  value: string
  label: string
  count?: number
}

interface FilterSection {
  name: string
  key: string
  type: 'checkbox' | 'radio' | 'range' | 'select'
  options?: FilterOption[]
  min?: number
  max?: number
}

interface ProductFiltersProps {
  sections?: FilterSection[]
  selectedFilters: Record<string, any>
  onFilterChange: (key: string, value: any) => void
  onClearFilters: () => void
  onApplyFilters: () => void
  totalProducts?: number
  filteredCount?: number
  isOpen?: boolean
  onClose?: () => void
}

export default function ProductFilters({
  sections = defaultFilterSections,
  selectedFilters,
  onFilterChange,
  onClearFilters,
  onApplyFilters,
  totalProducts = 0,
  filteredCount = 0,
  isOpen = true,
  onClose
}: ProductFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(
    sections.map(s => s.key)
  )
  const [priceRange, setPriceRange] = useState<[number, number]>(
    selectedFilters.priceRange || [0, 500]
  )

  const toggleSection = (key: string) => {
    setExpandedSections(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    )
  }

  const handlePriceChange = (index: 0 | 1, value: number) => {
    const newRange: [number, number] = [...priceRange] as [number, number]
    newRange[index] = value
    setPriceRange(newRange)
    onFilterChange('priceRange', newRange)
  }

  const activeFilterCount = Object.keys(selectedFilters).length

  // Mobile drawer version
  if (!isOpen) {
    return (
      <button
        onClick={onClose}
        className="lg:hidden fixed bottom-4 right-4 z-50 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg flex items-center gap-2"
      >
        <span>🔍</span>
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="px-2 py-0.5 bg-white text-purple-600 rounded-full text-xs">
            {activeFilterCount}
          </span>
        )}
      </button>
    )
  }

  return (
    <div className="bg-white/5 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-purple-400">Filters</h3>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={onClearFilters}
              className="text-xs text-gray-400 hover:text-white transition"
            >
              Clear all
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="mb-4 p-3 bg-purple-500/10 rounded-lg">
          <p className="text-xs text-gray-400 mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedFilters).map(([key, value]) => (
              <span
                key={key}
                className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-xs flex items-center gap-1"
              >
                <span>{key}: {Array.isArray(value) ? value.join(', ') : value}</span>
                <button
                  onClick={() => onFilterChange(key, undefined)}
                  className="ml-1 hover:text-white"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filter Sections */}
      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.key} className="border-b border-white/10 pb-4 last:border-0">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.key)}
              className="flex items-center justify-between w-full text-left mb-2"
            >
              <span className="font-medium">{section.name}</span>
              <span className="text-gray-400">
                {expandedSections.includes(section.key) ? '−' : '+'}
              </span>
            </button>

            {/* Section Content */}
            {expandedSections.includes(section.key) && (
              <div className="mt-3 space-y-2">
                {section.type === 'checkbox' && section.options && (
                  <div className="space-y-2">
                    {section.options.map((option) => (
                      <label key={option.value} className="flex items-center justify-between group">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedFilters[section.key]?.includes(option.value)}
                            onChange={(e) => {
                              const current = selectedFilters[section.key] || []
                              const newValue = e.target.checked
                                ? [...current, option.value]
                                : current.filter((v: string) => v !== option.value)
                              onFilterChange(section.key, newValue)
                            }}
                            className="rounded border-white/10 bg-white/5 focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-300 group-hover:text-white transition">
                            {option.label}
                          </span>
                        </div>
                        {option.count !== undefined && (
                          <span className="text-xs text-gray-400">({option.count})</span>
                        )}
                      </label>
                    ))}
                  </div>
                )}

                {section.type === 'radio' && section.options && (
                  <div className="space-y-2">
                    {section.options.map((option) => (
                      <label key={option.value} className="flex items-center justify-between group">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={section.key}
                            value={option.value}
                            checked={selectedFilters[section.key] === option.value}
                            onChange={(e) => onFilterChange(section.key, e.target.value)}
                            className="border-white/10 bg-white/5 focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-300 group-hover:text-white transition">
                            {option.label}
                          </span>
                        </div>
                        {option.count !== undefined && (
                          <span className="text-xs text-gray-400">({option.count})</span>
                        )}
                      </label>
                    ))}
                  </div>
                )}

                {section.type === 'range' && (
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                    <input
                      type="range"
                      min={section.min || 0}
                      max={section.max || 500}
                      value={priceRange[1]}
                      onChange={(e) => handlePriceChange(1, parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => handlePriceChange(0, parseInt(e.target.value) || 0)}
                        className="px-2 py-1 bg-white/5 border border-white/10 rounded text-sm"
                        placeholder="Min"
                      />
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceChange(1, parseInt(e.target.value) || 0)}
                        className="px-2 py-1 bg-white/5 border border-white/10 rounded text-sm"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                )}

                {section.type === 'select' && section.options && (
                  <select
                    value={selectedFilters[section.key] || ''}
                    onChange={(e) => onFilterChange(section.key, e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition text-white"
                  >
                    <option value="">All</option>
                    {section.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label} {option.count ? `(${option.count})` : ''}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 space-y-3">
        <button
          onClick={onApplyFilters}
          className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition"
        >
          Apply Filters {filteredCount ? `(${filteredCount})` : ''}
        </button>
        
        <div className="text-center text-sm text-gray-400">
          Showing {filteredCount} of {totalProducts} products
        </div>
      </div>
    </div>
  )
}

// Default filter sections
const defaultFilterSections: FilterSection[] = [
  {
    name: 'Category',
    key: 'category',
    type: 'checkbox',
    options: [
      { value: 'bags', label: 'Bags', count: 45 },
      { value: 'wallets', label: 'Wallets', count: 32 },
      { value: 'belts', label: 'Belts', count: 28 },
      { value: 'accessories', label: 'Accessories', count: 56 }
    ]
  },
  {
    name: 'Price Range',
    key: 'priceRange',
    type: 'range',
    min: 0,
    max: 500
  },
  {
    name: 'Color',
    key: 'color',
    type: 'checkbox',
    options: [
      { value: 'black', label: 'Black', count: 67 },
      { value: 'brown', label: 'Brown', count: 54 },
      { value: 'tan', label: 'Tan', count: 23 },
      { value: 'navy', label: 'Navy', count: 12 }
    ]
  },
  {
    name: 'Size',
    key: 'size',
    type: 'checkbox',
    options: [
      { value: 's', label: 'Small', count: 34 },
      { value: 'm', label: 'Medium', count: 56 },
      { value: 'l', label: 'Large', count: 45 },
      { value: 'xl', label: 'Extra Large', count: 23 }
    ]
  },
  {
    name: 'Rating',
    key: 'rating',
    type: 'radio',
    options: [
      { value: '4', label: '4★ & above', count: 89 },
      { value: '3', label: '3★ & above', count: 123 },
      { value: '2', label: '2★ & above', count: 145 },
      { value: '1', label: '1★ & above', count: 156 }
    ]
  },
  {
    name: 'Sort By',
    key: 'sort',
    type: 'select',
    options: [
      { value: 'newest', label: 'Newest' },
      { value: 'price-low', label: 'Price: Low to High' },
      { value: 'price-high', label: 'Price: High to Low' },
      { value: 'rating', label: 'Top Rated' }
    ]
  }
]
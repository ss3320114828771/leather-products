'use client'

import { useState } from 'react'
import Navbar from '@/components/ui/Navbar'

export default function DirectionsPage() {
  const [activeTab, setActiveTab] = useState('store')

  const stores = [
    {
      id: 'nyc',
      name: 'New York Flagship Store',
      address: '123 Leather Street, New York, NY 10001',
      phone: '+1 (234) 567-890',
      hours: 'Mon-Sat: 10am-8pm, Sun: 12pm-6pm',
      directions: 'Located in the heart of Manhattan, near Central Park'
    },
    {
      id: 'la',
      name: 'Los Angeles Store',
      address: '456 Beverly Drive, Los Angeles, CA 90210',
      phone: '+1 (234) 567-891',
      hours: 'Mon-Sat: 10am-9pm, Sun: 11am-7pm',
      directions: 'On the famous Rodeo Drive shopping district'
    },
    {
      id: 'chi',
      name: 'Chicago Store',
      address: '789 Michigan Avenue, Chicago, IL 60611',
      phone: '+1 (234) 567-892',
      hours: 'Mon-Sat: 10am-8pm, Sun: 11am-6pm',
      directions: 'On the Magnificent Mile, near the Water Tower'
    }
  ]

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
                Directions
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Find your nearest Leather E-Commerce store
            </p>
          </div>

          {/* Store Tabs */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            {stores.map((store) => (
              <button
                key={store.id}
                onClick={() => setActiveTab(store.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 button-glow ${
                  activeTab === store.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_30px_rgba(168,85,247,0.5)]'
                    : 'glass-morphism hover:bg-white/20'
                }`}
              >
                {store.name}
              </button>
            ))}
          </div>

          {/* Store Information */}
          {stores.map((store) => (
            activeTab === store.id && (
              <div key={store.id} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Map Placeholder */}
                <div className="glass-morphism rounded-3xl p-8 h-96 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-red-500/20"></div>
                  
                  <div className="relative z-10 h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🗺️</div>
                      <p className="text-gray-400">
                        Interactive Map Coming Soon
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {store.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Store Details */}
                <div className="space-y-6">
                  <div className="glass-morphism rounded-3xl p-8">
                    <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                      Store Information
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <span className="text-xl">🏪</span>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Store Name</h3>
                          <p className="text-gray-400">{store.name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                          <span className="text-xl">📍</span>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Address</h3>
                          <p className="text-gray-400">{store.address}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <span className="text-xl">📞</span>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Phone</h3>
                          <p className="text-gray-400">{store.phone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                          <span className="text-xl">⏰</span>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Hours</h3>
                          <p className="text-gray-400">{store.hours}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                          <span className="text-xl">🗺️</span>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Directions</h3>
                          <p className="text-gray-400">{store.directions}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transportation Options */}
                  <div className="glass-morphism rounded-3xl p-8">
                    <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                      Getting Here
                    </h2>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🚇</span>
                        <span className="text-gray-400">Subway: 5 min walk from Central Station</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🚌</span>
                        <span className="text-gray-400">Bus: Routes 1, 2, 3 stop directly outside</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🚗</span>
                        <span className="text-gray-400">Parking: Paid parking available nearby</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🚲</span>
                        <span className="text-gray-400">Bike: Bike racks available at entrance</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      </main>
    </>
  )
}
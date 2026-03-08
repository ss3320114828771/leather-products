'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function AboutPage() {
  // Simple data arrays
  const values = [
    { title: 'Quality First', desc: 'No compromise on quality', icon: '⭐' },
    { title: 'Ethical', desc: 'Sustainable sourcing', icon: '🌍' },
    { title: 'Customer First', desc: 'Your happiness is our success', icon: '😊' },
    { title: 'Innovation', desc: 'Modern meets tradition', icon: '💡' }
  ]

  const timeline = [
    { year: '2010', title: 'Founded', desc: 'Started by Hafiz Sajid Syed' },
    { year: '2015', title: 'Growth', desc: 'Opened first store' },
    { year: '2018', title: 'Sustainable', desc: '100% ethical sourcing' },
    { year: '2024', title: 'Global', desc: 'Worldwide recognition' }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Simple Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-purple-400">
              Leather Store
            </Link>
            <div className="flex gap-4">
              <Link href="/" className="text-white hover:text-purple-400">Home</Link>
              <Link href="/products" className="text-white hover:text-purple-400">Products</Link>
              <Link href="/about" className="text-purple-400">About</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Everything visible immediately */}
      <main className="pt-20 pb-10 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-2 text-purple-400">About Us</h1>
            <p className="text-gray-400">Crafting leather since 2010 by Hafiz Sajid Syed</p>
          </div>

          {/* Story Section - Simple layout */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">Our Story</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-gray-300">
                  Founded by Hafiz Sajid Syed, we create premium leather products with passion.
                </p>
                <p className="text-gray-300">
                  Every piece is handcrafted with care and attention to detail.
                </p>
              </div>
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image src="/n1.jpeg" alt="Workshop" fill className="object-cover" />
              </div>
            </div>
          </div>

          {/* Values - Simple grid */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-center text-purple-400">Our Values</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {values.map((v, i) => (
                <div key={i} className="bg-white/5 p-3 rounded-lg text-center">
                  <div className="text-2xl mb-1">{v.icon}</div>
                  <h3 className="font-bold text-sm">{v.title}</h3>
                  <p className="text-xs text-gray-400">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline - Simple list */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-center text-purple-400">Our Journey</h2>
            <div className="space-y-3 max-w-md mx-auto">
              {timeline.map((item, i) => (
                <div key={i} className="flex gap-3 bg-white/5 p-3 rounded-lg">
                  <span className="text-purple-400 font-bold min-w-[60px]">{item.year}</span>
                  <div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Info - Simple card */}
          <div className="max-w-sm mx-auto bg-purple-500/10 p-6 rounded-xl text-center">
            <h2 className="text-xl font-bold mb-3 text-purple-400">Administrator</h2>
            <div className="w-20 h-20 mx-auto mb-2 rounded-full overflow-hidden border-2 border-purple-500">
              <Image src="/n1.jpeg" alt="Hafiz Sajid Syed" width={80} height={80} className="object-cover" />
            </div>
            <h3 className="font-bold">Hafiz Sajid Syed</h3>
            <p className="text-sm text-purple-400 mb-2">Founder</p>
            <a href="mailto:sajid.syed@leather.com" className="text-sm text-gray-400 hover:text-purple-400">
              sajid.syed@leather.com
            </a>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-white/10 py-4 text-center text-xs text-gray-400">
        <p>© 2024 Leather Store | Admin: Hafiz Sajid Syed</p>
      </footer>
    </div>
  )
}
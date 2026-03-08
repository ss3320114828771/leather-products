'use client'

import Link from 'next/link'

interface FooterProps {
  logoText?: string
  companyName?: string
  adminName?: string
  adminEmail?: string
  showBismillah?: boolean
}

export default function Footer({
  logoText = 'Leather Store',
  companyName = 'Leather E-Commerce',
  adminName = 'Hafiz Sajid Syed',
  adminEmail = 'sajid.syed@leather.com',
  showBismillah = true
}: FooterProps) {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Shop',
      links: [
        { name: 'All Products', href: '/products' },
        { name: 'Bags', href: '/category/bags' },
        { name: 'Wallets', href: '/category/wallets' },
        { name: 'Belts', href: '/category/belts' },
        { name: 'Accessories', href: '/category/accessories' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Directions', href: '/directions' },
        { name: 'Careers', href: '/careers' },
        { name: 'Blog', href: '/blog' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'FAQs', href: '/faqs' },
        { name: 'Shipping', href: '/shipping' },
        { name: 'Returns', href: '/returns' },
        { name: 'Size Guide', href: '/size-guide' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'Accessibility', href: '/accessibility' }
      ]
    }
  ]

  const socialLinks = [
    { name: 'Facebook', icon: '📘', href: '#' },
    { name: 'Instagram', icon: '📷', href: '#' },
    { name: 'Twitter', icon: '🐦', href: '#' },
    { name: 'Pinterest', icon: '📌', href: '#' },
    { name: 'YouTube', icon: '▶️', href: '#' }
  ]

  const paymentIcons = ['💳', '📱', '🏦', '💰', '🪙']

  return (
    <footer className="bg-black/90 backdrop-blur-xl border-t border-white/10">
      {/* Bismillah */}
      {showBismillah && (
        <div className="border-b border-white/10 py-4">
          <div className="container mx-auto px-4">
            <p className="text-center text-emerald-400 text-lg">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
          </div>
        </div>
      )}

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {logoText}
              </h3>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Premium leather products crafted with excellence and care. Each piece tells a story of dedication and passion.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-purple-500/20 transition-all hover:scale-110"
                  aria-label={social.name}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">We Accept:</span>
              <div className="flex gap-2 text-2xl">
                {paymentIcons.map((icon, i) => (
                  <span key={i} className="opacity-70 hover:opacity-100 transition-opacity">
                    {icon}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">Secure Checkout:</span>
              <span className="text-2xl">🔒</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} {companyName}. All rights reserved.
            </p>
            <div className="text-sm text-gray-400">
              <span>Admin: </span>
              <span className="text-purple-400">{adminName}</span>
              <span className="mx-2">|</span>
              <a href={`mailto:${adminEmail}`} className="hover:text-purple-400 transition-colors">
                {adminEmail}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
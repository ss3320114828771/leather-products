'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// Simple Navbar
function DashboardNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="text-xl font-bold text-purple-400">
            Dashboard
          </Link>
          
          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm text-gray-400">Hafiz Sajid Syed</span>
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
              <span className="text-sm">👤</span>
            </div>
          </div>

          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white text-2xl"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4">
            <Link href="/dashboard" className="block py-2 text-white hover:text-purple-400">Dashboard</Link>
            <Link href="/dashboard/projects" className="block py-2 text-white hover:text-purple-400">Projects</Link>
            <Link href="/dashboard/settings" className="block py-2 text-white hover:text-purple-400">Settings</Link>
          </div>
        )}
      </div>
    </nav>
  )
}

// Settings Section Component
function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 rounded-xl p-6">
      <h3 className="text-lg font-bold mb-4 text-purple-400">{title}</h3>
      {children}
    </div>
  )
}

// Input Field Component
function InputField({ 
  label, 
  name,
  value, 
  onChange, 
  type = 'text',
  placeholder = ''
}: { 
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  placeholder?: string
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm text-gray-400 mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition text-white"
      />
    </div>
  )
}

// Select Field Component
function SelectField({ 
  label, 
  name,
  value, 
  onChange, 
  options 
}: { 
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm text-gray-400 mb-2">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition text-white"
      >
        {options.map(option => (
          <option key={option.value} value={option.value} className="bg-gray-900">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

// Toggle Component
function Toggle({ label, enabled, onChange }: { label: string; enabled: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-300">{label}</span>
      <button
        onClick={onChange}
        className={`relative w-12 h-6 rounded-full transition ${
          enabled ? 'bg-purple-500' : 'bg-white/20'
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition ${
            enabled ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}

// Tab Component
function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
        active 
          ? 'bg-purple-500/20 text-purple-400 border-b-2 border-purple-500' 
          : 'text-gray-400 hover:text-white'
      }`}
    >
      {label}
    </button>
  )
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  // Profile Settings
  const [profile, setProfile] = useState({
    name: 'Hafiz Sajid Syed',
    email: 'sajid.syed@leather.com',
    role: 'Administrator',
    department: 'Management',
    phone: '+1 (234) 567-890',
    location: 'New York, USA',
    bio: 'Founder of Leather E-Commerce with over 15 years of experience in leather craftsmanship.'
  })

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    projectUpdates: true,
    taskAssignments: true,
    deadlineReminders: true,
    teamMessages: false,
    weeklyReports: true,
    marketingEmails: false
  })

  // Appearance Settings
  const [appearance, setAppearance] = useState({
    theme: 'dark',
    fontSize: 'medium',
    compactView: false,
    animations: true
  })

  // Security Settings
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    loginAlerts: true
  })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleAppearanceChange = (key: keyof typeof appearance, value: string | boolean) => {
    setAppearance(prev => ({ ...prev, [key]: value }))
  }

  const handleSecurityChange = (key: keyof typeof security, value: string | boolean) => {
    setSecurity(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    setIsSaving(true)
    setSaveMessage('')
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setSaveMessage('Settings saved successfully!')
      setTimeout(() => setSaveMessage(''), 3000)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <DashboardNavbar />

      <main className="pt-20 pb-10 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Settings
              </span>
            </h1>
            <p className="text-gray-400 text-sm">Manage your account settings and preferences</p>
          </div>

          {/* Save Message */}
          {saveMessage && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-500 text-sm text-center">
              {saveMessage}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <Tab label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
            <Tab label="Notifications" active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
            <Tab label="Appearance" active={activeTab === 'appearance'} onClick={() => setActiveTab('appearance')} />
            <Tab label="Security" active={activeTab === 'security'} onClick={() => setActiveTab('security')} />
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <SettingsSection title="Profile Information">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center text-3xl">
                    👤
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition">
                      Change Photo
                    </button>
                    <p className="text-xs text-gray-400 mt-2">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Full Name"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                  />
                  <InputField
                    label="Email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Role"
                    name="role"
                    value={profile.role}
                    onChange={handleProfileChange}
                  />
                  <InputField
                    label="Department"
                    name="department"
                    value={profile.department}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Phone"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                  />
                  <InputField
                    label="Location"
                    name="location"
                    value={profile.location}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleProfileChange}
                    rows={3}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition text-white"
                  />
                </div>
              </SettingsSection>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <SettingsSection title="Notification Preferences">
                <Toggle
                  label="Email Notifications"
                  enabled={notifications.emailNotifications}
                  onChange={() => handleNotificationToggle('emailNotifications')}
                />
                <Toggle
                  label="Project Updates"
                  enabled={notifications.projectUpdates}
                  onChange={() => handleNotificationToggle('projectUpdates')}
                />
                <Toggle
                  label="Task Assignments"
                  enabled={notifications.taskAssignments}
                  onChange={() => handleNotificationToggle('taskAssignments')}
                />
                <Toggle
                  label="Deadline Reminders"
                  enabled={notifications.deadlineReminders}
                  onChange={() => handleNotificationToggle('deadlineReminders')}
                />
                <Toggle
                  label="Team Messages"
                  enabled={notifications.teamMessages}
                  onChange={() => handleNotificationToggle('teamMessages')}
                />
                <Toggle
                  label="Weekly Reports"
                  enabled={notifications.weeklyReports}
                  onChange={() => handleNotificationToggle('weeklyReports')}
                />
                <Toggle
                  label="Marketing Emails"
                  enabled={notifications.marketingEmails}
                  onChange={() => handleNotificationToggle('marketingEmails')}
                />
              </SettingsSection>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <SettingsSection title="Appearance Settings">
                <SelectField
                  label="Theme"
                  name="theme"
                  value={appearance.theme}
                  onChange={(e) => handleAppearanceChange('theme', e.target.value)}
                  options={[
                    { value: 'dark', label: 'Dark' },
                    { value: 'light', label: 'Light' },
                    { value: 'system', label: 'System Default' }
                  ]}
                />

                <SelectField
                  label="Font Size"
                  name="fontSize"
                  value={appearance.fontSize}
                  onChange={(e) => handleAppearanceChange('fontSize', e.target.value)}
                  options={[
                    { value: 'small', label: 'Small' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'large', label: 'Large' }
                  ]}
                />

                <Toggle
                  label="Compact View"
                  enabled={appearance.compactView}
                  onChange={() => handleAppearanceChange('compactView', !appearance.compactView)}
                />

                <Toggle
                  label="Enable Animations"
                  enabled={appearance.animations}
                  onChange={() => handleAppearanceChange('animations', !appearance.animations)}
                />
              </SettingsSection>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <SettingsSection title="Security Settings">
                <Toggle
                  label="Two-Factor Authentication"
                  enabled={security.twoFactorAuth}
                  onChange={() => handleSecurityChange('twoFactorAuth', !security.twoFactorAuth)}
                />

                <SelectField
                  label="Session Timeout"
                  name="sessionTimeout"
                  value={security.sessionTimeout}
                  onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                  options={[
                    { value: '15', label: '15 minutes' },
                    { value: '30', label: '30 minutes' },
                    { value: '60', label: '1 hour' },
                    { value: '120', label: '2 hours' },
                    { value: '0', label: 'Never' }
                  ]}
                />

                <Toggle
                  label="Login Alerts"
                  enabled={security.loginAlerts}
                  onChange={() => handleSecurityChange('loginAlerts', !security.loginAlerts)}
                />

                <div className="mt-4 pt-4 border-t border-white/10">
                  <h4 className="font-bold mb-3 text-purple-400">Change Password</h4>
                  <InputField
                    label="Current Password"
                    name="current"
                    value=""
                    onChange={() => {}}
                    type="password"
                  />
                  <InputField
                    label="New Password"
                    name="new"
                    value=""
                    onChange={() => {}}
                    type="password"
                  />
                  <InputField
                    label="Confirm New Password"
                    name="confirm"
                    value=""
                    onChange={() => {}}
                    type="password"
                  />
                  <button className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm hover:bg-purple-500/30 transition">
                    Update Password
                  </button>
                </div>
              </SettingsSection>
            )}

            {/* Save Button */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50"
              >
                {isSaving ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Saving...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('profile')}
                className="px-6 py-3 bg-white/5 rounded-xl font-semibold hover:bg-white/10 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
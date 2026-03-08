'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

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

// Input Field Component - FIXED: Added name prop
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

// TextArea Component - FIXED: Added name prop
function TextArea({ 
  label, 
  name,
  value, 
  onChange,
  placeholder = ''
}: { 
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm text-gray-400 mb-2">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition text-white"
      />
    </div>
  )
}

// Select Component - FIXED: Added name prop
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

// Danger Zone Component
function DangerZone() {
  const router = useRouter()

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      // Add your delete logic here
      router.push('/dashboard/projects')
    }
  }

  return (
    <div className="bg-red-500/10 rounded-xl p-6 border border-red-500/20">
      <h3 className="text-lg font-bold mb-2 text-red-400">Danger Zone</h3>
      <p className="text-sm text-gray-400 mb-4">Once you delete a project, there is no going back.</p>
      <button
        onClick={handleDelete}
        className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition text-sm"
      >
        Delete Project
      </button>
    </div>
  )
}

export default function ProjectSettingsPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId

  const [formData, setFormData] = useState({
    name: 'Luxury Leather Collection',
    description: 'A premium line of handcrafted leather products including bags, wallets, and accessories.',
    status: 'active',
    visibility: 'private',
    deadline: '2024-12-31',
    budget: '45000',
    category: 'fashion'
  })

  const [notifications, setNotifications] = useState({
    taskUpdates: true,
    deadlineReminders: true,
    teamMessages: false,
    weeklyReports: true
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
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

  const handleCancel = () => {
    router.push(`/dashboard/projects/${projectId}`)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <DashboardNavbar />

      <main className="pt-20 pb-10 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <Link 
                  href={`/dashboard/projects/${projectId}`} 
                  className="text-sm text-gray-400 hover:text-white mb-2 inline-block"
                >
                  ← Back to Project
                </Link>
                <h1 className="text-3xl font-bold">
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Project Settings
                  </span>
                </h1>
                <p className="text-gray-400 text-sm mt-1">Configure project settings for ID: {projectId}</p>
              </div>
            </div>
          </div>

          {/* Save Message */}
          {saveMessage && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-500 text-sm text-center">
              {saveMessage}
            </div>
          )}

          {/* Settings Form */}
          <div className="space-y-6">
            {/* Basic Information */}
            <SettingsSection title="Basic Information">
              <InputField
                label="Project Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter project name"
              />
              
              <TextArea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter project description"
              />

              <div className="grid grid-cols-2 gap-4">
                <SelectField
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  options={[
                    { value: 'active', label: 'Active' },
                    { value: 'paused', label: 'Paused' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'archived', label: 'Archived' }
                  ]}
                />

                <SelectField
                  label="Visibility"
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleInputChange}
                  options={[
                    { value: 'public', label: 'Public' },
                    { value: 'private', label: 'Private' },
                    { value: 'team', label: 'Team Only' }
                  ]}
                />
              </div>
            </SettingsSection>

            {/* Project Details */}
            <SettingsSection title="Project Details">
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleInputChange}
                />

                <InputField
                  label="Budget ($)"
                  name="budget"
                  type="number"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="Enter budget"
                />
              </div>

              <SelectField
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                options={[
                  { value: 'fashion', label: 'Fashion' },
                  { value: 'accessories', label: 'Accessories' },
                  { value: 'bags', label: 'Bags' },
                  { value: 'wallets', label: 'Wallets' },
                  { value: 'other', label: 'Other' }
                ]}
              />
            </SettingsSection>

            {/* Notifications */}
            <SettingsSection title="Notifications">
              <Toggle
                label="Task Updates"
                enabled={notifications.taskUpdates}
                onChange={() => handleToggle('taskUpdates')}
              />
              <Toggle
                label="Deadline Reminders"
                enabled={notifications.deadlineReminders}
                onChange={() => handleToggle('deadlineReminders')}
              />
              <Toggle
                label="Team Messages"
                enabled={notifications.teamMessages}
                onChange={() => handleToggle('teamMessages')}
              />
              <Toggle
                label="Weekly Reports"
                enabled={notifications.weeklyReports}
                onChange={() => handleToggle('weeklyReports')}
              />
            </SettingsSection>

            {/* Team Permissions */}
            <SettingsSection title="Team Permissions">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Members can invite others</span>
                  <input type="checkbox" className="rounded border-white/10 bg-white/5" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Members can delete tasks</span>
                  <input type="checkbox" className="rounded border-white/10 bg-white/5" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Allow external sharing</span>
                  <input type="checkbox" className="rounded border-white/10 bg-white/5" defaultChecked />
                </div>
              </div>
            </SettingsSection>

            {/* Danger Zone */}
            <DangerZone />

            {/* Action Buttons */}
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
                onClick={handleCancel}
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
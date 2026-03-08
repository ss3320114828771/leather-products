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

// Project Card Component
function ProjectCard({ project }: { project: any }) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'text-green-400 bg-green-500/20'
      case 'In Progress': return 'text-blue-400 bg-blue-500/20'
      case 'Completed': return 'text-purple-400 bg-purple-500/20'
      case 'On Hold': return 'text-yellow-400 bg-yellow-500/20'
      default: return 'text-gray-400 bg-white/10'
    }
  }

  return (
    <Link href={`/dashboard/projects/${project.id}`}>
      <div className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition cursor-pointer border border-white/10 hover:border-purple-500/50">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold mb-1">{project.name}</h3>
            <p className="text-sm text-gray-400">{project.description}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">Progress</span>
            <span className="text-purple-400">{project.progress}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Project Meta */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Deadline:</span>
            <span>{project.deadline}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Team:</span>
            <div className="flex -space-x-2">
              {project.team.map((member: string, i: number) => (
                <div key={i} className="w-6 h-6 rounded-full bg-purple-500/20 border border-black flex items-center justify-center text-xs">
                  {member[0]}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

// Filter Bar Component
function FilterBar({ 
  filter, 
  setFilter,
  search,
  setSearch
}: { 
  filter: string
  setFilter: (filter: string) => void
  search: string
  setSearch: (search: string) => void
}) {
  const filters = ['All', 'Active', 'In Progress', 'Completed', 'On Hold']

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
          className="w-full px-4 py-2 pl-10 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 transition text-white"
        />
        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-lg text-sm transition ${
              filter === f 
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  )
}

// Stats Cards
function StatsCards({ projects }: { projects: any[] }) {
  const stats = [
    { label: 'Total Projects', value: projects.length, icon: '📊', color: 'purple' },
    { label: 'Active', value: projects.filter(p => p.status === 'Active').length, icon: '✅', color: 'green' },
    { label: 'In Progress', value: projects.filter(p => p.status === 'In Progress').length, icon: '🔄', color: 'blue' },
    { label: 'Completed', value: projects.filter(p => p.status === 'Completed').length, icon: '🎉', color: 'pink' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white/5 rounded-xl p-4">
          <div className="text-2xl mb-2">{stat.icon}</div>
          <p className="text-2xl font-bold">{stat.value}</p>
          <p className="text-xs text-gray-400">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}

export default function ProjectsPage() {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  // Mock projects data
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Luxury Leather Collection',
      description: 'Premium handcrafted leather bags and accessories',
      status: 'Active',
      progress: 65,
      deadline: 'Dec 31, 2024',
      team: ['HS', 'JS', 'MK']
    },
    {
      id: 2,
      name: 'Sustainable Sourcing Initiative',
      description: 'Find eco-friendly leather suppliers worldwide',
      status: 'In Progress',
      progress: 40,
      deadline: 'Mar 15, 2024',
      team: ['HS', 'SC']
    },
    {
      id: 3,
      name: 'Website Redesign',
      description: 'Modern e-commerce platform with better UX',
      status: 'Completed',
      progress: 100,
      deadline: 'Feb 28, 2024',
      team: ['JS', 'MK', 'SC']
    },
    {
      id: 4,
      name: 'Marketing Campaign',
      description: 'Social media and email marketing for new collection',
      status: 'On Hold',
      progress: 25,
      deadline: 'Apr 30, 2024',
      team: ['HS', 'MK']
    },
    {
      id: 5,
      name: 'Quality Control System',
      description: 'Implement new quality check procedures',
      status: 'Active',
      progress: 80,
      deadline: 'Mar 10, 2024',
      team: ['HS', 'JS', 'SC']
    },
    {
      id: 6,
      name: 'Customer Feedback Analysis',
      description: 'Analyze reviews and improve products',
      status: 'In Progress',
      progress: 30,
      deadline: 'May 20, 2024',
      team: ['MK', 'SC']
    }
  ])

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === 'All' || project.status === filter
    const matchesSearch = project.name.toLowerCase().includes(search.toLowerCase()) ||
                         project.description.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="min-h-screen bg-black text-white">
      <DashboardNavbar />

      <main className="pt-20 pb-10 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Projects
                </span>
              </h1>
              <p className="text-gray-400 text-sm">Manage and track all your leather projects</p>
            </div>
            
            <div className="flex gap-2">
              {/* View Toggle */}
              <button
                onClick={() => setView('grid')}
                className={`p-2 rounded-lg transition ${
                  view === 'grid' ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                ⊞
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded-lg transition ${
                  view === 'list' ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                ☰
              </button>
              
              {/* New Project Button */}
              <Link
                href="/dashboard/projects/new"
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition"
              >
                + New Project
              </Link>
            </div>
          </div>

          {/* Stats */}
          <StatsCards projects={projects} />

          {/* Filters */}
          <div className="mt-8 mb-6">
            <FilterBar 
              filter={filter}
              setFilter={setFilter}
              search={search}
              setSearch={setSearch}
            />
          </div>

          {/* Projects Grid/List */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold mb-2">No projects found</h3>
              <p className="text-gray-400">Try adjusting your filters or create a new project</p>
            </div>
          ) : (
            <div className={
              view === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
            }>
              {filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}

          {/* Summary */}
          <div className="mt-8 p-4 bg-white/5 rounded-lg text-sm text-gray-400">
            Showing {filteredProjects.length} of {projects.length} projects
          </div>
        </div>
      </main>
    </div>
  )
}
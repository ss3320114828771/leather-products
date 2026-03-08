'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'

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

// Overview Tab
function OverviewTab({ project }: { project: any }) {
  return (
    <div className="space-y-6">
      {/* Project Info */}
      <div className="bg-white/5 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 text-purple-400">Project Overview</h3>
        <p className="text-gray-300 mb-4">{project.description}</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div>
            <p className="text-xs text-gray-400">Status</p>
            <p className="font-semibold text-green-400">{project.status}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Deadline</p>
            <p className="font-semibold">{project.deadline}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Budget</p>
            <p className="font-semibold">{project.budget}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Team Size</p>
            <p className="font-semibold">{project.teamSize} members</p>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="bg-white/5 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 text-purple-400">Team Members</h3>
        <div className="space-y-3">
          {project.team.map((member: any, i: number) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  {member.name[0]}
                </div>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-xs text-gray-400">{member.role}</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 bg-white/5 rounded-full">{member.tasks} tasks</span>
            </div>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white/5 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 text-purple-400">Progress</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Overall Progress</span>
              <span className="text-purple-400">{project.progress}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Tasks Tab
function TasksTab({ project }: { project: any }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-purple-400">Tasks</h3>
        <button className="px-3 py-1 bg-purple-500/20 rounded-lg text-sm text-purple-400 hover:bg-purple-500/30 transition">
          + Add Task
        </button>
      </div>

      {project.tasks.map((task: any, i: number) => (
        <div key={i} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium">{task.title}</h4>
            <span className={`text-xs px-2 py-1 rounded-full ${
              task.priority === 'High' ? 'bg-red-500/20 text-red-400' :
              task.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-green-500/20 text-green-400'
            }`}>
              {task.priority}
            </span>
          </div>
          <p className="text-sm text-gray-400 mb-3">{task.description}</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center text-xs">
                {task.assignee[0]}
              </div>
              <span className="text-xs text-gray-400">{task.assignee}</span>
            </div>
            <span className={`text-xs ${
              task.status === 'Done' ? 'text-green-400' :
              task.status === 'In Progress' ? 'text-blue-400' :
              'text-gray-400'
            }`}>
              {task.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

// Files Tab
function FilesTab() {
  const files = [
    { name: 'design-sketches.pdf', size: '2.4 MB', date: '2024-01-15' },
    { name: 'material-specs.docx', size: '1.1 MB', date: '2024-01-14' },
    { name: 'budget.xlsx', size: '0.8 MB', date: '2024-01-13' },
    { name: 'timeline.pdf', size: '1.5 MB', date: '2024-01-12' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-purple-400">Files</h3>
        <button className="px-3 py-1 bg-purple-500/20 rounded-lg text-sm text-purple-400 hover:bg-purple-500/30 transition">
          + Upload File
        </button>
      </div>

      <div className="bg-white/5 rounded-xl p-4">
        {files.map((file, i) => (
          <div key={i} className="flex justify-between items-center py-3 border-b border-white/10 last:border-0">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📄</span>
              <div>
                <p className="font-medium text-sm">{file.name}</p>
                <p className="text-xs text-gray-400">{file.size} • {file.date}</p>
              </div>
            </div>
            <button className="text-purple-400 hover:text-purple-300 text-sm">Download</button>
          </div>
        ))}
      </div>
    </div>
  )
}

// Activity Tab
function ActivityTab() {
  const activities = [
    { user: 'Hafiz Sajid', action: 'created task', target: 'Quality check', time: '2 hours ago' },
    { user: 'John', action: 'uploaded file', target: 'design-sketches.pdf', time: '5 hours ago' },
    { user: 'Sarah', action: 'completed task', target: 'Market research', time: '1 day ago' },
    { user: 'Hafiz Sajid', action: 'updated deadline', target: 'to Dec 31', time: '2 days ago' },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-purple-400">Activity Log</h3>
      
      <div className="bg-white/5 rounded-xl p-4">
        {activities.map((activity, i) => (
          <div key={i} className="flex items-start gap-3 py-3 border-b border-white/10 last:border-0">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              {activity.user[0]}
            </div>
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-medium">{activity.user}</span>{' '}
                <span className="text-gray-400">{activity.action}</span>{' '}
                <span className="text-purple-400">{activity.target}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.projectId
  
  const [activeTab, setActiveTab] = useState('overview')

  // Mock project data - replace with actual API call
  const project = {
    id: projectId,
    name: 'Luxury Leather Collection',
    description: 'A premium line of handcrafted leather products including bags, wallets, and accessories. This collection focuses on sustainable materials and timeless design.',
    status: 'In Progress',
    deadline: 'Dec 31, 2024',
    budget: '$45,000',
    teamSize: 5,
    progress: 65,
    team: [
      { name: 'Hafiz Sajid Syed', role: 'Project Lead', tasks: 8 },
      { name: 'John Smith', role: 'Designer', tasks: 12 },
      { name: 'Sarah Johnson', role: 'Developer', tasks: 6 },
      { name: 'Mike Chen', role: 'Quality Control', tasks: 4 },
    ],
    tasks: [
      { 
        id: 1, 
        title: 'Design leather bag', 
        description: 'Create sketches for new collection', 
        priority: 'High',
        assignee: 'John Smith',
        status: 'In Progress'
      },
      { 
        id: 2, 
        title: 'Source materials', 
        description: 'Find sustainable leather suppliers', 
        priority: 'Medium',
        assignee: 'Sarah Johnson',
        status: 'Done'
      },
      { 
        id: 3, 
        title: 'Quality check', 
        description: 'Review samples for defects', 
        priority: 'High',
        assignee: 'Mike Chen',
        status: 'To Do'
      },
    ]
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <DashboardNavbar />

      <main className="pt-20 pb-10 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <Link 
                  href="/dashboard/projects" 
                  className="text-sm text-gray-400 hover:text-white mb-2 inline-block"
                >
                  ← Back to Projects
                </Link>
                <h1 className="text-3xl font-bold">
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {project.name}
                  </span>
                </h1>
                <p className="text-gray-400 text-sm mt-1">Project ID: {projectId}</p>
              </div>
              
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition">
                  Edit
                </button>
                <button className="px-4 py-2 bg-purple-500/20 rounded-lg text-sm text-purple-400 hover:bg-purple-500/30 transition">
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <Tab label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
            <Tab label="Tasks" active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} />
            <Tab label="Files" active={activeTab === 'files'} onClick={() => setActiveTab('files')} />
            <Tab label="Activity" active={activeTab === 'activity'} onClick={() => setActiveTab('activity')} />
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'overview' && <OverviewTab project={project} />}
            {activeTab === 'tasks' && <TasksTab project={project} />}
            {activeTab === 'files' && <FilesTab />}
            {activeTab === 'activity' && <ActivityTab />}
          </div>
        </div>
      </main>
    </div>
  )
}
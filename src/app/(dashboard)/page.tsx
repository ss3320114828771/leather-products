'use client'

import { useState } from 'react'
import Link from 'next/link'

// Stats Card Component
function StatsCard({ title, value, icon, color }: { title: string; value: string; icon: string; color: string }) {
  const getColorClass = () => {
    switch(color) {
      case 'purple': return 'from-purple-500 to-pink-500'
      case 'blue': return 'from-blue-500 to-cyan-500'
      case 'green': return 'from-green-500 to-emerald-500'
      case 'yellow': return 'from-yellow-500 to-orange-500'
      default: return 'from-purple-500 to-pink-500'
    }
  }

  return (
    <div className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition border border-white/10">
      <div className="flex justify-between items-start mb-4">
        <div className={`text-3xl bg-gradient-to-r ${getColorClass()} bg-clip-text text-transparent`}>
          {icon}
        </div>
        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">+12%</span>
      </div>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-sm text-gray-400">{title}</p>
    </div>
  )
}

// Recent Activity Component
function RecentActivity() {
  const activities = [
    { user: 'Hafiz Sajid', action: 'created project', target: 'Luxury Leather Collection', time: '2 hours ago' },
    { user: 'John', action: 'completed task', target: 'Design sketches', time: '5 hours ago' },
    { user: 'Sarah', action: 'uploaded file', target: 'material-specs.pdf', time: '1 day ago' },
    { user: 'Mike', action: 'joined team', target: 'Quality Control', time: '2 days ago' },
  ]

  return (
    <div className="bg-white/5 rounded-xl p-6">
      <h3 className="text-lg font-bold mb-4 text-purple-400">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              {activity.user[0]}
            </div>
            <div>
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

// Recent Projects Component
function RecentProjects() {
  const projects = [
    { name: 'Luxury Leather Collection', progress: 65, status: 'Active', deadline: 'Dec 31' },
    { name: 'Sustainable Sourcing', progress: 40, status: 'In Progress', deadline: 'Mar 15' },
    { name: 'Website Redesign', progress: 100, status: 'Completed', deadline: 'Feb 28' },
    { name: 'Marketing Campaign', progress: 25, status: 'On Hold', deadline: 'Apr 30' },
  ]

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'text-green-400'
      case 'In Progress': return 'text-blue-400'
      case 'Completed': return 'text-purple-400'
      case 'On Hold': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="bg-white/5 rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-purple-400">Recent Projects</h3>
        <Link href="/dashboard/projects" className="text-sm text-purple-400 hover:text-purple-300">
          View All →
        </Link>
      </div>
      <div className="space-y-4">
        {projects.map((project, i) => (
          <div key={i} className="border-b border-white/10 last:border-0 pb-4 last:pb-0">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">{project.name}</h4>
              <span className={`text-xs ${getStatusColor(project.status)}`}>{project.status}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Progress</span>
              <span>{project.progress}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>Deadline: {project.deadline}</span>
              <Link href={`/dashboard/projects/${i+1}`} className="text-purple-400 hover:text-purple-300">
                View →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Tasks Overview Component
function TasksOverview() {
  const tasks = [
    { title: 'Design leather bag', priority: 'High', due: 'Today', assignee: 'John' },
    { title: 'Source materials', priority: 'Medium', due: 'Tomorrow', assignee: 'Sarah' },
    { title: 'Quality check', priority: 'High', due: 'In 2 days', assignee: 'Mike' },
    { title: 'Market research', priority: 'Low', due: 'Next week', assignee: 'Hafiz' },
  ]

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'High': return 'text-red-400 bg-red-500/20'
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20'
      case 'Low': return 'text-green-400 bg-green-500/20'
      default: return 'text-gray-400 bg-white/10'
    }
  }

  return (
    <div className="bg-white/5 rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-purple-400">Tasks Overview</h3>
        <span className="text-sm text-gray-400">8 pending</span>
      </div>
      <div className="space-y-3">
        {tasks.map((task, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <h4 className="font-medium text-sm mb-1">{task.title}</h4>
              <div className="flex items-center gap-2 text-xs">
                <span className={`px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <span className="text-gray-400">Due: {task.due}</span>
              </div>
            </div>
            <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs">
              {task.assignee[0]}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Welcome Banner Component
function WelcomeBanner() {
  const hour = new Date().getHours()
  let greeting = 'Good Evening'
  
  if (hour < 12) greeting = 'Good Morning'
  else if (hour < 18) greeting = 'Good Afternoon'

  return (
    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 mb-6 border border-white/10">
      <h2 className="text-2xl font-bold mb-2">
        {greeting}, <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Hafiz Sajid Syed</span>
      </h2>
      <p className="text-gray-400">Here's what's happening with your leather projects today.</p>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Projects" value="24" icon="📊" color="purple" />
        <StatsCard title="Active Tasks" value="156" icon="✅" color="blue" />
        <StatsCard title="Team Members" value="12" icon="👥" color="green" />
        <StatsCard title="Completion Rate" value="78%" icon="📈" color="yellow" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <RecentProjects />
          <TasksOverview />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <RecentActivity />
          
          {/* Quick Actions */}
          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4 text-purple-400">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link 
                href="/dashboard/projects/new" 
                className="p-4 bg-white/5 rounded-lg text-center hover:bg-white/10 transition"
              >
                <div className="text-2xl mb-2">➕</div>
                <span className="text-sm">New Project</span>
              </Link>
              <Link 
                href="/dashboard/tasks/new" 
                className="p-4 bg-white/5 rounded-lg text-center hover:bg-white/10 transition"
              >
                <div className="text-2xl mb-2">📝</div>
                <span className="text-sm">New Task</span>
              </Link>
              <Link 
                href="/dashboard/team/invite" 
                className="p-4 bg-white/5 rounded-lg text-center hover:bg-white/10 transition"
              >
                <div className="text-2xl mb-2">👥</div>
                <span className="text-sm">Invite Team</span>
              </Link>
              <Link 
                href="/dashboard/reports" 
                className="p-4 bg-white/5 rounded-lg text-center hover:bg-white/10 transition"
              >
                <div className="text-2xl mb-2">📊</div>
                <span className="text-sm">Reports</span>
              </Link>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4 text-purple-400">Upcoming Deadlines</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Luxury Collection</span>
                <span className="text-xs text-red-400">Tomorrow</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Quality Check</span>
                <span className="text-xs text-yellow-400">In 3 days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Material Sourcing</span>
                <span className="text-xs text-green-400">Next week</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
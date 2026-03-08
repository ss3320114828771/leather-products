'use client'

import { useState, DragEvent } from 'react'
import Link from 'next/link'

// Types
interface Task {
  id: number
  title: string
  description: string
  priority: string
  assignees: string[]
}

interface TasksState {
  todo: Task[]
  progress: Task[]
  review: Task[]
  done: Task[]
}

// Simple Navbar for dashboard
function DashboardNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="text-xl font-bold text-purple-400">
            Project Board
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

// Task Card Component
function TaskCard({ task, onDragStart }: { task: Task; onDragStart: (e: DragEvent<HTMLDivElement>, id: number) => void }) {
  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className="bg-white/5 p-3 rounded-lg mb-2 cursor-move hover:bg-white/10 transition border border-white/10"
    >
      <h4 className="font-medium text-sm mb-1">{task.title}</h4>
      <p className="text-xs text-gray-400 mb-2">{task.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-xs px-2 py-1 bg-purple-500/20 rounded-full text-purple-400">
          {task.priority}
        </span>
        <div className="flex -space-x-2">
          {task.assignees.map((assignee, i) => (
            <div key={i} className="w-6 h-6 rounded-full bg-pink-500/20 border border-black flex items-center justify-center text-xs">
              {assignee[0]}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Column Component
function Column({ 
  title, 
  tasks, 
  onDragOver, 
  onDrop, 
  onDragStart 
}: { 
  title: string
  tasks: Task[]
  onDragOver: (e: DragEvent<HTMLDivElement>) => void
  onDrop: (e: DragEvent<HTMLDivElement>) => void
  onDragStart: (e: DragEvent<HTMLDivElement>, id: number) => void
}) {
  // Get color based on title
  const getColorClass = () => {
    switch(title) {
      case 'To Do': return 'text-purple-400'
      case 'In Progress': return 'text-blue-400'
      case 'Review': return 'text-yellow-400'
      case 'Done': return 'text-green-400'
      default: return 'text-white'
    }
  }

  return (
    <div 
      className="bg-white/5 rounded-xl p-4"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className={`font-bold ${getColorClass()}`}>{title}</h3>
        <span className="text-sm text-gray-400">{tasks.length}</span>
      </div>
      <div className="space-y-2 min-h-[200px]">
        {tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </div>
  )
}

export default function ProjectBoard() {
  const [tasks, setTasks] = useState<TasksState>({
    todo: [
      { id: 1, title: 'Design leather bag', description: 'Create sketches for new collection', priority: 'High', assignees: ['JS', 'MK'] },
      { id: 2, title: 'Source materials', description: 'Find sustainable leather suppliers', priority: 'Medium', assignees: ['HS'] }
    ],
    progress: [
      { id: 3, title: 'Sample production', description: 'Create first prototype', priority: 'High', assignees: ['JS'] }
    ],
    review: [
      { id: 4, title: 'Quality check', description: 'Review samples for defects', priority: 'High', assignees: ['HS', 'MK'] }
    ],
    done: [
      { id: 5, title: 'Market research', description: 'Analyze customer preferences', priority: 'Low', assignees: ['MK'] }
    ]
  })

  const handleDragStart = (e: DragEvent<HTMLDivElement>, taskId: number) => {
    e.dataTransfer.setData('text/plain', taskId.toString())
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>, column: keyof TasksState) => {
    e.preventDefault()
    const taskId = parseInt(e.dataTransfer.getData('text/plain'))
    
    // Find which column the task is currently in
    let sourceColumn: keyof TasksState | null = null
    let taskData: Task | null = null
    
    // Check all columns
    const columns: (keyof TasksState)[] = ['todo', 'progress', 'review', 'done']
    
    for (const col of columns) {
      const found = tasks[col].find(t => t.id === taskId)
      if (found) {
        sourceColumn = col
        taskData = found
        break
      }
    }

    if (sourceColumn && sourceColumn !== column && taskData) {
      // Remove from source column
      const newSourceTasks = tasks[sourceColumn].filter(t => t.id !== taskId)
      // Add to target column
      const newTargetTasks = [...tasks[column], taskData]

      setTasks({
        ...tasks,
        [sourceColumn]: newSourceTasks,
        [column]: newTargetTasks
      })
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <DashboardNavbar />

      {/* Main Content */}
      <main className="pt-20 pb-10 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Luxury Leather Collection
                  </span>
                </h1>
                <p className="text-gray-400 text-sm">Project Board • Created by Hafiz Sajid Syed</p>
              </div>
              <Link 
                href="/dashboard/projects" 
                className="px-4 py-2 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition"
              >
                ← Back
              </Link>
            </div>
          </div>

          {/* Project Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 p-3 rounded-lg">
              <p className="text-xs text-gray-400">Status</p>
              <p className="font-semibold text-green-400">In Progress</p>
            </div>
            <div className="bg-white/5 p-3 rounded-lg">
              <p className="text-xs text-gray-400">Deadline</p>
              <p className="font-semibold">Dec 31, 2024</p>
            </div>
            <div className="bg-white/5 p-3 rounded-lg">
              <p className="text-xs text-gray-400">Team Lead</p>
              <p className="font-semibold">Hafiz Sajid</p>
            </div>
            <div className="bg-white/5 p-3 rounded-lg">
              <p className="text-xs text-gray-400">Tasks</p>
              <p className="font-semibold">5 total • 1 done</p>
            </div>
          </div>

          {/* Kanban Board */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Column 
              title="To Do" 
              tasks={tasks.todo} 
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'todo')}
              onDragStart={handleDragStart}
            />
            <Column 
              title="In Progress" 
              tasks={tasks.progress} 
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'progress')}
              onDragStart={handleDragStart}
            />
            <Column 
              title="Review" 
              tasks={tasks.review} 
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'review')}
              onDragStart={handleDragStart}
            />
            <Column 
              title="Done" 
              tasks={tasks.done} 
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'done')}
              onDragStart={handleDragStart}
            />
          </div>

          {/* Activity */}
          <div className="mt-8 bg-white/5 rounded-xl p-4">
            <h3 className="font-bold mb-3 text-purple-400">Recent Activity</h3>
            <div className="space-y-2">
              <div className="text-sm text-gray-400">• Task moved to Review by Hafiz Sajid</div>
              <div className="text-sm text-gray-400">• New task added: Quality check</div>
              <div className="text-sm text-gray-400">• Deadline updated to Dec 31</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
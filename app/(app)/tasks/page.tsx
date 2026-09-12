'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTasks } from '@/hooks/useTasks'
import { TaskCard } from '@/components/tasks/TaskCard'
import { TaskModal } from '@/components/tasks/TaskModal'
import { Button } from '@/components/ui/Button'
import { TaskSkeleton } from '@/components/ui/Skeleton'
import { Plus, CheckSquare } from 'lucide-react'
import type { Task } from '@/types/database'

type Filter = 'all' | 'today' | 'completed'

export default function TasksPage() {
  const { tasks, loading, addTask, updateTask, toggleComplete, deleteTask } = useTasks()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)
  const [filter, setFilter] = useState<Filter>('all')

  const today = new Date().toISOString().split('T')[0]

  const filtered = tasks.filter(t => {
    if (filter === 'today') return t.due_date === today && !t.completed
    if (filter === 'completed') return t.completed
    return !t.completed
  })

  function openAdd() { setEditing(null); setModalOpen(true) }
  function openEdit(task: Task) { setEditing(task); setModalOpen(true) }

  async function handleSave(data: Omit<Task, 'id' | 'user_id' | 'completed'>) {
    if (editing) {
      await updateTask(editing.id, data)
    } else {
      await addTask(data)
    }
    setModalOpen(false)
  }

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all', label: 'Pending' },
    { key: 'today', label: 'Due today' },
    { key: 'completed', label: 'Completed' },
  ]

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#f4f4f5]">
          Tasks
        </h1>
        <Button onClick={openAdd} size="sm">
          <Plus className="w-4 h-4" /> Add task
        </Button>
      </div>

      {/* Filter tabs */}
      <div
        className="flex gap-1 p-1 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)]"
        role="tablist"
        aria-label="Task filters"
      >
        {FILTERS.map(f => (
          <button
            key={f.key}
            role="tab"
            aria-selected={filter === f.key}
            onClick={() => setFilter(f.key)}
            className={`
              flex-1 py-2 rounded-lg text-sm font-medium transition-colors duration-150
              ${filter === f.key
                ? 'bg-[rgba(168,85,247,0.2)] text-[#a855f7]'
                : 'text-[#71717a] hover:text-[#f4f4f5]'
              }
            `}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Task list */}
      {loading ? (
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map(i => <TaskSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <CheckSquare className="w-10 h-10 text-[#3f3f46]" />
          <div>
            <p className="text-sm font-medium text-[#71717a]">
              {filter === 'completed' ? 'No completed tasks yet' :
               filter === 'today' ? 'Nothing due today' :
               'No pending tasks'}
            </p>
            {filter !== 'completed' && (
              <p className="text-xs text-[#52525b] mt-1">Tap "Add task" to get started</p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {filtered.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={() => toggleComplete(task.id)}
                onEdit={() => openEdit(task)}
                onDelete={() => deleteTask(task.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editing ?? undefined}
      />
    </div>
  )
}

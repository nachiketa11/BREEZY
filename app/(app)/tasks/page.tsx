'use client'

import { useState } from 'react'
import { useTasks } from '@/hooks/useTasks'
import { TaskCard } from '@/components/tasks/TaskCard'
import { TaskModal } from '@/components/tasks/TaskModal'
import { Button } from '@/components/ui/Button'
import { TaskSkeleton } from '@/components/ui/Skeleton'
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
    { key: 'all', label: 'PENDING' },
    { key: 'today', label: 'DUE TODAY' },
    { key: 'completed', label: 'DONE' },
  ]

  return (
    <div className="max-w-3xl mx-auto">
      <div className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#454545]">
        /// TASKS — {filtered.length} SHOWN
      </div>

      <div className="flex items-center justify-between gap-4 mt-2 pb-6 border-b border-dashed border-[rgba(255,255,255,0.14)]">
        <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
        <Button variant="primary" onClick={openAdd} size="sm">
          + NEW TASK
        </Button>
      </div>

      <div
        className="grid grid-cols-3 border border-[rgba(255,255,255,0.22)] mt-6"
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
              py-2.5 font-[family-name:var(--font-jetbrains-mono)] text-[11px] tracking-widest transition-colors
              border-r border-[rgba(255,255,255,0.14)] last:border-r-0
              ${filter === f.key
                ? 'bg-[#FAFAFA] text-black'
                : 'text-[#7A7A7A] hover:text-[#FAFAFA] hover:bg-[#0D0D0D]'
              }
            `}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-2 border-t border-dashed border-[rgba(255,255,255,0.14)]">
        {loading ? (
          <div className="flex flex-col">
            {[0, 1, 2].map(i => <TaskSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col gap-3 py-16 text-center border-b border-dashed border-[rgba(255,255,255,0.14)]">
            <div className="font-[family-name:var(--font-dot-gothic)] text-4xl text-[#454545]">∅</div>
            <p className="text-sm text-[#7A7A7A]">
              {filter === 'completed' ? 'Nothing done yet. Go tick something off.' :
               filter === 'today' ? 'Nothing due today. Rare. Enjoy it.' :
               'List is clear. Add the next thing.'}
            </p>
            {filter !== 'completed' && (
              <div>
                <Button variant="secondary" onClick={openAdd} size="sm">+ ADD TASK</Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col">
            {filtered.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={() => toggleComplete(task.id)}
                onEdit={() => openEdit(task)}
                onDelete={() => deleteTask(task.id)}
              />
            ))}
          </div>
        )}
      </div>

      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editing ?? undefined}
      />
    </div>
  )
}

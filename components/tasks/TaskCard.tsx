'use client'

import { motion } from 'framer-motion'
import { Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { formatDueDate, isOverdue } from '@/utils/date'
import type { Task, Priority } from '@/types/database'

interface TaskCardProps {
  task: Task
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
}

const priorityBadge: Record<Priority, 'red' | 'amber' | 'neutral'> = {
  high: 'red',
  medium: 'amber',
  low: 'neutral',
}

export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  const overdue = isOverdue(task.due_date, task.completed)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{
        layout: { duration: 0.18 },
        opacity: { duration: 0.18 },
        height: { duration: 0.18 },
      }}
      className="glass px-4 py-3 flex items-center gap-3 group"
    >
      {/* Checkbox */}
      <button
        onClick={onToggle}
        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        className={`
          shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
          transition-all duration-150 cursor-pointer
          ${task.completed
            ? 'bg-[#a855f7] border-[#a855f7]'
            : 'border-[rgba(255,255,255,0.2)] hover:border-[#a855f7]'
          }
        `}
      >
        {task.completed && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm transition-all duration-180 ${task.completed ? 'line-through text-[#52525b]' : 'text-[#f4f4f5]'}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-[#71717a]">{task.subject}</span>
          <span className="text-xs text-[#3f3f46]">·</span>
          <span className={`text-xs ${overdue ? 'text-[#ef4444]' : 'text-[#71717a]'}`}>
            {formatDueDate(task.due_date)}
            {overdue && ' (overdue)'}
          </span>
        </div>
      </div>

      <Badge variant={priorityBadge[task.priority]}>{task.priority}</Badge>

      {/* Actions — visible on hover/focus */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150">
        <button
          onClick={onEdit}
          aria-label="Edit task"
          className="p-1.5 rounded-lg text-[#71717a] hover:text-[#f4f4f5] hover:bg-[rgba(255,255,255,0.08)] transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onDelete}
          aria-label="Delete task"
          className="p-1.5 rounded-lg text-[#71717a] hover:text-[#ef4444] hover:bg-[rgba(239,68,68,0.1)] transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  )
}

'use client'

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

const priorityGlyph: Record<Priority, string> = {
  high: '!!!',
  medium: '!!',
  low: '·',
}

export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  const overdue = isOverdue(task.due_date, task.completed)

  return (
    <div className="group flex items-center gap-3.5 px-1 py-3 border-b border-dashed border-[rgba(255,255,255,0.14)]">
      <button
        onClick={onToggle}
        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        className={`nos-check ${task.completed ? 'done' : ''}`}
      >
        {task.completed && (
          <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 12 12">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm ${task.completed ? 'line-through text-[#454545]' : 'text-[#FAFAFA]'}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5 font-[family-name:var(--font-jetbrains-mono)] text-[11px]">
          <span className="text-[#454545]">{task.subject.toUpperCase()}</span>
          <span className="text-[#454545]">·</span>
          <span className={overdue ? 'text-[#E5342B]' : 'text-[#7A7A7A]'}>
            {overdue ? 'OVERDUE' : formatDueDate(task.due_date).toUpperCase()}
          </span>
          <span className={task.priority === 'high' ? 'text-[#E5342B]' : 'text-[#454545]'}>
            {priorityGlyph[task.priority]} {task.priority.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 transition-opacity">
        <button
          onClick={onEdit}
          aria-label="Edit task"
          className="px-2 py-1 font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#7A7A7A] hover:text-[#FAFAFA] border border-transparent hover:border-[rgba(255,255,255,0.22)] transition-colors"
        >
          EDIT
        </button>
        <button
          onClick={onDelete}
          aria-label="Delete task"
          className="px-2 py-1 font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#7A7A7A] hover:text-[#E5342B] border border-transparent hover:border-[rgba(229,52,43,0.5)] transition-colors"
        >
          DEL
        </button>
      </div>
    </div>
  )
}

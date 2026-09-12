'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTasks } from '@/hooks/useTasks'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { TaskSkeleton } from '@/components/ui/Skeleton'
import { formatDueDate, isDueToday, isOverdue } from '@/utils/date'
import { CheckSquare, Plus, AlertTriangle } from 'lucide-react'
import type { Task, Priority } from '@/types/database'

const priorityBadge: Record<Priority, 'red' | 'amber' | 'neutral'> = {
  high: 'red',
  medium: 'amber',
  low: 'neutral',
}

function TaskRow({ task }: { task: Task }) {
  const overdue = isOverdue(task.due_date, task.completed)
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-[rgba(255,255,255,0.06)] last:border-0">
      <div
        className={`w-2 h-2 rounded-full shrink-0 ${
          task.priority === 'high' ? 'bg-[#ef4444]' :
          task.priority === 'medium' ? 'bg-[#f59e0b]' : 'bg-[#52525b]'
        }`}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[#f4f4f5] truncate">{task.title}</p>
        <p className={`text-xs mt-0.5 ${overdue ? 'text-[#ef4444]' : 'text-[#71717a]'}`}>
          {overdue && <AlertTriangle className="w-3 h-3 inline mr-1" />}
          {task.subject} · {formatDueDate(task.due_date)}
        </p>
      </div>
      <Badge variant={priorityBadge[task.priority]}>{task.priority}</Badge>
    </div>
  )
}

export function TasksPreview() {
  const { tasks, loading } = useTasks()

  if (loading) {
    return (
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-base font-semibold text-[#f4f4f5]">
            Tasks due today
          </h2>
        </div>
        {[0, 1, 2].map(i => <TaskSkeleton key={i} />)}
      </section>
    )
  }

  const pending = tasks.filter(t => !t.completed)
  const todayTasks = pending.filter(t => isDueToday(t.due_date))
  const shown = todayTasks.length > 0 ? todayTasks.slice(0, 3) : pending.slice(0, 3)

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-base font-semibold text-[#f4f4f5]">
          {todayTasks.length > 0 ? `Tasks due today (${todayTasks.length})` : 'Upcoming tasks'}
        </h2>
        <Link href="/tasks" className="text-xs text-[#a855f7] hover:text-[#c084fc] transition-colors">
          View all
        </Link>
      </div>

      {shown.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-8 text-center">
          <CheckSquare className="w-8 h-8 text-[#52525b]" />
          <div>
            <p className="text-sm font-medium text-[#a1a1aa]">Nothing due today</p>
            <p className="text-xs text-[#52525b] mt-1">Your schedule is clear — or add a task to get started</p>
          </div>
          <Link
            href="/tasks"
            className="inline-flex items-center gap-1.5 text-xs text-[#a855f7] hover:text-[#c084fc] transition-colors mt-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add your first task
          </Link>
        </Card>
      ) : (
        <Card className="divide-y divide-[rgba(255,255,255,0.06)] p-0 overflow-hidden">
          <div className="px-4">
            {shown.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <TaskRow task={task} />
              </motion.div>
            ))}
          </div>
          {pending.length > 3 && (
            <Link
              href="/tasks"
              className="block px-4 py-3 text-xs text-center text-[#71717a] hover:text-[#f4f4f5] hover:bg-[rgba(255,255,255,0.03)] transition-colors"
            >
              +{pending.length - 3} more tasks
            </Link>
          )}
        </Card>
      )}
    </section>
  )
}

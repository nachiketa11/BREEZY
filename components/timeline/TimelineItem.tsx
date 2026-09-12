'use client'

import { motion } from 'framer-motion'
import { format, isToday, isTomorrow, parseISO } from 'date-fns'
import { CheckSquare, Clock, AlertTriangle } from 'lucide-react'
import { formatEventTime, isOverdue } from '@/utils/date'
import type { TimelineEntry, Priority } from '@/types/database'

interface TimelineItemProps {
  entry: TimelineEntry
  index: number
}

const priorityColors: Record<Priority, string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#52525b',
}

function dateLabel(dateStr: string): string {
  const date = parseISO(dateStr)
  if (isToday(date)) return 'Today'
  if (isTomorrow(date)) return 'Tomorrow'
  return format(date, 'EEE, d MMM')
}

export function TimelineItem({ entry, index }: TimelineItemProps) {
  const overdue = entry.type === 'task'
    ? isOverdue(entry.date, entry.completed ?? false)
    : false

  const iconBg = entry.type === 'task'
    ? 'rgba(168,85,247,0.12)'
    : 'rgba(34,211,238,0.12)'

  const iconColor = entry.type === 'task' ? '#a855f7' : '#22d3ee'
  const isPast = overdue

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.22 }}
      className={`glass px-4 py-3 flex items-start gap-4 ${isPast ? 'opacity-60' : ''}`}
    >
      {/* Icon */}
      <div
        className="shrink-0 mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: iconBg }}
      >
        {entry.type === 'task'
          ? <CheckSquare className="w-4 h-4" style={{ color: iconColor }} />
          : <Clock className="w-4 h-4" style={{ color: iconColor }} />
        }
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 justify-between">
          <p className={`text-sm font-medium truncate ${entry.completed ? 'line-through text-[#52525b]' : 'text-[#f4f4f5]'}`}>
            {entry.title}
          </p>
          {entry.type === 'task' && entry.priority && (
            <div
              className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5"
              style={{ background: priorityColors[entry.priority] }}
            />
          )}
        </div>

        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className={`text-xs ${overdue ? 'text-[#ef4444]' : 'text-[#71717a]'}`}>
            {overdue && <AlertTriangle className="w-3 h-3 inline mr-0.5" />}
            {dateLabel(entry.date)}
            {entry.time && ` · ${formatEventTime(entry.time)}`}
          </span>
          {entry.subject && (
            <>
              <span className="text-xs text-[#3f3f46]">·</span>
              <span className="text-xs text-[#71717a]">{entry.subject}</span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

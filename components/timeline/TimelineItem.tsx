'use client'

import { format, isToday, isTomorrow, parseISO } from 'date-fns'
import { formatEventTime, isOverdue } from '@/utils/date'
import type { TimelineEntry } from '@/types/database'

interface TimelineItemProps {
  entry: TimelineEntry
  index: number
}

function dateLabel(dateStr: string): string {
  const date = parseISO(dateStr)
  if (isToday(date)) return 'TODAY'
  if (isTomorrow(date)) return 'TOMORROW'
  return format(date, 'EEE d MMM').toUpperCase()
}

export function TimelineItem({ entry }: TimelineItemProps) {
  const overdue = entry.type === 'task'
    ? isOverdue(entry.date, entry.completed ?? false)
    : false

  return (
    <div className={`flex items-start gap-4 px-1 py-3 border-b border-dashed border-[rgba(255,255,255,0.14)] ${overdue ? 'opacity-60' : ''}`}>
      <div className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#7A7A7A] w-20 shrink-0 pt-0.5">
        {entry.time ? entry.time.slice(0, 5) : dateLabel(entry.date)}
      </div>
      <div className={`w-1.5 h-1.5 mt-1.5 shrink-0 ${entry.type === 'task' ? (overdue ? 'bg-[#E5342B]' : 'bg-[#FAFAFA]') : 'border border-[#7A7A7A]'}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${entry.completed ? 'line-through text-[#454545]' : 'text-[#FAFAFA]'}`}>
          {entry.title}
        </p>
        <p className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#454545] mt-0.5">
          {entry.type === 'task' ? 'TASK' : 'EVENT'}
          {entry.subject && ` · ${entry.subject.toUpperCase()}`}
          {entry.time && entry.type === 'event' && ` · ${formatEventTime(entry.time)}`}
          {!entry.time && ` · ${dateLabel(entry.date)}`}
          {overdue && <span className="text-[#E5342B]"> · OVERDUE</span>}
        </p>
      </div>
    </div>
  )
}

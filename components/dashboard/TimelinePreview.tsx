'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/Card'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { formatDueDate, formatEventTime, todayISO } from '@/utils/date'
import { CalendarDays, Plus, CheckSquare, Clock } from 'lucide-react'
import type { Task, CalendarEvent, TimelineEntry } from '@/types/database'

export function TimelinePreview() {
  const [entries, setEntries] = useState<TimelineEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const today = todayISO()

      const [{ data: tasks }, { data: events }] = await Promise.all([
        supabase
          .from('tasks')
          .select('*')
          .eq('completed', false)
          .gte('due_date', today)
          .order('due_date', { ascending: true })
          .limit(5),
        supabase
          .from('events')
          .select('*')
          .gte('event_date', today)
          .order('event_date', { ascending: true })
          .order('event_time', { ascending: true })
          .limit(5),
      ])

      const taskEntries: TimelineEntry[] = (tasks as Task[] ?? []).map(t => ({
        id: t.id,
        type: 'task',
        title: t.title,
        date: t.due_date,
        subject: t.subject,
        priority: t.priority,
        completed: t.completed,
      }))

      const eventEntries: TimelineEntry[] = (events as CalendarEvent[] ?? []).map(e => ({
        id: e.id,
        type: 'event',
        title: e.title,
        date: e.event_date,
        time: e.event_time,
      }))

      const merged = [...taskEntries, ...eventEntries]
        .sort((a, b) => {
          const d = a.date.localeCompare(b.date)
          if (d !== 0) return d
          if (a.time && b.time) return a.time.localeCompare(b.time)
          return 0
        })
        .slice(0, 3)

      setEntries(merged)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <section className="flex flex-col gap-3">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-base font-semibold text-[#f4f4f5]">
          Coming up
        </h2>
        <CardSkeleton />
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-base font-semibold text-[#f4f4f5]">
          Coming up
        </h2>
        <Link href="/timeline" className="text-xs text-[#a855f7] hover:text-[#c084fc] transition-colors">
          Full timeline
        </Link>
      </div>

      {entries.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-8 text-center">
          <CalendarDays className="w-8 h-8 text-[#52525b]" />
          <div>
            <p className="text-sm font-medium text-[#a1a1aa]">Nothing scheduled yet</p>
            <p className="text-xs text-[#52525b] mt-1">Add a task or event to see your timeline</p>
          </div>
          <Link
            href="/tasks"
            className="inline-flex items-center gap-1.5 text-xs text-[#a855f7] hover:text-[#c084fc] transition-colors mt-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add something
          </Link>
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3 px-4 py-3 border-b border-[rgba(255,255,255,0.06)] last:border-0"
            >
              <div className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center bg-[rgba(255,255,255,0.06)]">
                {entry.type === 'task'
                  ? <CheckSquare className="w-3.5 h-3.5 text-[#a855f7]" />
                  : <Clock className="w-3.5 h-3.5 text-[#22d3ee]" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#f4f4f5] truncate">{entry.title}</p>
                <p className="text-xs text-[#71717a] mt-0.5">
                  {formatDueDate(entry.date)}
                  {entry.time && ` · ${formatEventTime(entry.time)}`}
                  {entry.subject && ` · ${entry.subject}`}
                </p>
              </div>
            </motion.div>
          ))}
        </Card>
      )}
    </section>
  )
}

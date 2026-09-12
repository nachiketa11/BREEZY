'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TimelineItem } from '@/components/timeline/TimelineItem'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { todayISO } from '@/utils/date'
import { format, parseISO, isToday, isTomorrow, isYesterday } from 'date-fns'
import { CalendarDays, Plus } from 'lucide-react'
import type { Task, CalendarEvent, TimelineEntry } from '@/types/database'
import { toast } from 'sonner'

function groupByDate(entries: TimelineEntry[]): Map<string, TimelineEntry[]> {
  const map = new Map<string, TimelineEntry[]>()
  for (const e of entries) {
    const existing = map.get(e.date) ?? []
    existing.push(e)
    map.set(e.date, existing)
  }
  return map
}

function sectionLabel(dateStr: string): string {
  const d = parseISO(dateStr)
  if (isYesterday(d)) return 'Yesterday'
  if (isToday(d)) return 'Today'
  if (isTomorrow(d)) return 'Tomorrow'
  return format(d, 'EEEE, d MMMM')
}

export function TimelineFeed() {
  const [entries, setEntries] = useState<TimelineEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [eventModalOpen, setEventModalOpen] = useState(false)
  const [eventTitle, setEventTitle] = useState('')
  const [eventDate, setEventDate] = useState(todayISO())
  const [eventTime, setEventTime] = useState('09:00')
  const [savingEvent, setSavingEvent] = useState(false)
  const [titleError, setTitleError] = useState('')

  async function loadEntries() {
    const supabase = createClient()
    const past = format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')

    const [{ data: tasks }, { data: events }] = await Promise.all([
      supabase.from('tasks').select('*').gte('due_date', past).order('due_date', { ascending: true }),
      supabase.from('events').select('*').gte('event_date', past).order('event_date', { ascending: true }).order('event_time', { ascending: true }),
    ])

    const te: TimelineEntry[] = (tasks as Task[] ?? []).map(t => ({
      id: t.id, type: 'task', title: t.title, date: t.due_date,
      subject: t.subject, priority: t.priority, completed: t.completed,
    }))

    const ee: TimelineEntry[] = (events as CalendarEvent[] ?? []).map(e => ({
      id: e.id, type: 'event', title: e.title, date: e.event_date, time: e.event_time,
    }))

    const merged = [...te, ...ee].sort((a, b) => {
      const d = a.date.localeCompare(b.date)
      if (d !== 0) return d
      if (a.time && b.time) return a.time.localeCompare(b.time)
      return 0
    })

    setEntries(merged)
    setLoading(false)
  }

  useEffect(() => { loadEntries() }, [])

  async function handleAddEvent(e: React.FormEvent) {
    e.preventDefault()
    if (!eventTitle.trim()) { setTitleError('Title is required'); return }
    setSavingEvent(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSavingEvent(false); return }

    const { error } = await supabase.from('events').insert({
      user_id: user.id,
      title: eventTitle.trim(),
      event_date: eventDate,
      event_time: `${eventTime}:00`,
    })
    setSavingEvent(false)
    if (error) { toast.error('Failed to add event'); return }
    toast.success('Event added')
    setEventModalOpen(false)
    setEventTitle('')
    loadEntries()
  }

  const groups = groupByDate(entries)
  const sortedDates = Array.from(groups.keys()).sort()
  let globalIndex = 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#f4f4f5]">
            Timeline
          </h1>
          <p className="text-sm text-[#71717a] mt-1">Tasks and events, chronologically</p>
        </div>
        <Button onClick={() => { setEventModalOpen(true); setTitleError('') }} size="sm">
          <Plus className="w-4 h-4" /> Add event
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[0, 1, 2, 3].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : entries.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <CalendarDays className="w-12 h-12 text-[#3f3f46]" />
          <div>
            <p className="text-sm font-medium text-[#71717a]">Nothing scheduled yet</p>
            <p className="text-xs text-[#52525b] mt-1">Add tasks or events to see your timeline</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {sortedDates.map(date => {
            const dayEntries = groups.get(date)!
            const isCurrentDay = isToday(parseISO(date))
            return (
              <section key={date}>
                <h2
                  className={`text-xs font-semibold uppercase tracking-widest mb-3 ${
                    isCurrentDay ? 'text-[#a855f7]' : 'text-[#52525b]'
                  }`}
                >
                  {sectionLabel(date)}
                </h2>
                <div className="flex flex-col gap-2">
                  {dayEntries.map(entry => {
                    const i = globalIndex++
                    return <TimelineItem key={entry.id} entry={entry} index={i} />
                  })}
                </div>
              </section>
            )
          })}
        </div>
      )}

      <Modal open={eventModalOpen} onClose={() => setEventModalOpen(false)} title="Add event">
        <form onSubmit={handleAddEvent} className="flex flex-col gap-4" noValidate>
          <Input
            label="Event title"
            placeholder="e.g. Semester exam, Lab submission"
            value={eventTitle}
            onChange={e => { setEventTitle(e.target.value); setTitleError('') }}
            error={titleError}
            autoFocus
          />
          <Input
            label="Date"
            type="date"
            value={eventDate}
            onChange={e => setEventDate(e.target.value)}
          />
          <Input
            label="Time"
            type="time"
            value={eventTime}
            onChange={e => setEventTime(e.target.value)}
          />
          <div className="flex gap-3">
            <Button variant="ghost" type="button" onClick={() => setEventModalOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={savingEvent} className="flex-1">Add event</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

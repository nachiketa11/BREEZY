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
  if (isYesterday(d)) return 'YESTERDAY'
  if (isToday(d)) return 'TODAY'
  if (isTomorrow(d)) return 'TOMORROW'
  return format(d, 'EEEE, d MMMM').toUpperCase()
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
    if (!eventTitle.trim()) { setTitleError('TITLE IS REQUIRED'); return }
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

  return (
    <div className="max-w-3xl mx-auto">
      <div className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#454545]">
        /// TIMELINE — {entries.length} ENTRIES
      </div>
      <div className="flex items-center justify-between gap-4 mt-2 pb-6 border-b border-dashed border-[rgba(255,255,255,0.14)]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Timeline</h1>
          <p className="text-[13px] text-[#7A7A7A] mt-1">Tasks and events, oldest → newest.</p>
        </div>
        <Button variant="primary" onClick={() => { setEventModalOpen(true); setTitleError('') }} size="sm">
          + EVENT
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col mt-4">
          {[0, 1, 2, 3].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : entries.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center border-b border-dashed border-[rgba(255,255,255,0.14)]">
          <div className="font-[family-name:var(--font-dot-gothic)] text-4xl text-[#454545]">—</div>
          <p className="text-sm text-[#7A7A7A]">Nothing scheduled yet.</p>
        </div>
      ) : (
        <div className="flex flex-col mt-2">
          {sortedDates.map(date => {
            const dayEntries = groups.get(date)!
            const current = isToday(parseISO(date))
            return (
              <section key={date} className="mt-6">
                <h2
                  className={`font-[family-name:var(--font-jetbrains-mono)] text-[11px] tracking-widest mb-1 ${
                    current ? 'text-[#E5342B]' : 'text-[#454545]'
                  }`}
                >
                  {current ? '● ' : ''}{sectionLabel(date)} — {dayEntries.length}
                </h2>
                <div className="border-t border-dashed border-[rgba(255,255,255,0.14)]">
                  {dayEntries.map(entry => (
                    <TimelineItem key={entry.id} entry={entry} index={0} />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}

      <Modal open={eventModalOpen} onClose={() => setEventModalOpen(false)} title="ADD EVENT">
        <form onSubmit={handleAddEvent} className="flex flex-col gap-5" noValidate>
          <Input
            label="Event title"
            placeholder="e.g. Semester exam"
            value={eventTitle}
            onChange={e => { setEventTitle(e.target.value); setTitleError('') }}
            error={titleError}
            autoFocus
          />
          <div className="grid grid-cols-2 gap-4">
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
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" type="button" onClick={() => setEventModalOpen(false)} className="flex-1">CANCEL</Button>
            <Button variant="primary" type="submit" loading={savingEvent} className="flex-1">ADD EVENT</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

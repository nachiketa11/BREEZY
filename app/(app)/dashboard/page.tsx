'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useTasks } from '@/hooks/useTasks'
import { useAttendance } from '@/hooks/useAttendance'
import { useUser } from '@/hooks/useUser'
import { createClient } from '@/lib/supabase/client'
import { enrichAttendance, sortByRisk } from '@/utils/attendance-math'
import { formatDueDate, isOverdue, formatEventTime } from '@/utils/date'
import type { CalendarEvent, Task } from '@/types/database'

export default function DashboardPage() {
  const { tasks, loading: tasksLoading, toggleComplete, addTask } = useTasks()
  const { records, loading: attLoading } = useAttendance()
  const { profile } = useUser()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [quickTitle, setQuickTitle] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const today = new Date().toISOString().split('T')[0]
      const { data } = await supabase
        .from('events')
        .select('*')
        .gte('event_date', today)
        .order('event_date', { ascending: true })
        .order('event_time', { ascending: true })
        .limit(6)
      if (data) setEvents(data as CalendarEvent[])
    }
    load()
  }, [])

  const todayLabel = new Date()
    .toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    .toUpperCase()

  // — attendance aggregate —
  const enriched = useMemo(() => sortByRisk(records.map(enrichAttendance)), [records])
  const totals = useMemo(() => {
    const att = records.reduce((s, r) => s + r.attended, 0)
    const tot = records.reduce((s, r) => s + r.total, 0)
    const pct = tot === 0 ? 0 : Math.round((att / tot) * 100)
    return { att, tot, pct }
  }, [records])
  const atRisk = totals.pct < 75
  const worst = enriched[0]

  const radius = 42
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (totals.pct / 100) * circumference

  // — tasks —
  const pending = tasks.filter((t) => !t.completed)
  const doneCount = tasks.filter((t) => t.completed).length
  const sortedTasks = [...pending]
    .sort((a, b) => a.due_date.localeCompare(b.due_date))
    .slice(0, 5)

  async function handleQuickAdd(e: React.FormEvent) {
    e.preventDefault()
    const title = quickTitle.trim()
    if (!title) return
    const today = new Date().toISOString().split('T')[0]
    await addTask({ title, subject: 'General', priority: 'medium', due_date: today })
    setQuickTitle('')
  }

  // — timeline merged —
  const timeline = useMemo(() => {
    const t: { time: string; text: string; now?: boolean; task?: Task }[] = []
    events.slice(0, 4).forEach((ev) => {
      const hm = ev.event_time.slice(0, 5)
      t.push({ time: hm, text: ev.title })
    })
    sortedTasks.slice(0, 2).forEach((task) => {
      t.push({ time: 'DUE', text: `${task.title} — ${formatDueDate(task.due_date)}`, task })
    })
    return t.slice(0, 5)
  }, [events, sortedTasks])

  const firstName = profile?.name?.split(' ')[0] ?? ''

  return (
    <div>
      {/* header line */}
      <div className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#454545] pt-1">
        /// TODAY — {todayLabel}
        {firstName && <span className="text-[#7A7A7A]"> · HI {firstName.toUpperCase()}</span>}
      </div>

      <div className="grid grid-cols-12 border-b border-dashed border-[rgba(255,255,255,0.14)] mt-0">
        {/* 01 ATTENDANCE */}
        <div className="col-span-12 lg:col-span-4 border-t border-dashed border-[rgba(255,255,255,0.14)] lg:border-r px-0 py-0">
          <div className="px-6 py-6">
            <div className="flex justify-between items-center mb-5 font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#7A7A7A]">
              <span>ATTENDANCE</span>
              <span className="text-[#454545]">01</span>
            </div>
            {attLoading ? (
              <div className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-[#454545]">LOADING…</div>
            ) : records.length === 0 ? (
              <div>
                <p className="text-sm text-[#7A7A7A]">No subjects tracked.</p>
                <Link href="/attendance" className="inline-block mt-3 font-[family-name:var(--font-jetbrains-mono)] text-[12px] border border-[rgba(255,255,255,0.22)] px-4 py-2.5 hover:bg-[#151515] transition-colors">
                  + ADD SUBJECT
                </Link>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-5">
                  <div className="relative w-24 h-24 shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                      <circle
                        cx="50" cy="50" r={radius} fill="none"
                        stroke={atRisk ? '#E5342B' : '#FAFAFA'}
                        strokeWidth="6"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        strokeLinecap="butt"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-[family-name:var(--font-dot-gothic)] text-2xl">
                      {totals.pct}
                      <span className="text-xs text-[#7A7A7A]">%</span>
                    </div>
                  </div>
                  <div>
                    <div className="font-[family-name:var(--font-dot-gothic)] text-[15px] text-[#E5342B] mb-1">
                      {records.length > 0 && totals.tot === 0 ? 'NO DATA' : atRisk ? 'AT RISK' : 'SAFE'}
                    </div>
                    <div className="text-[13px] text-[#7A7A7A] leading-snug">
                      {totals.tot === 0
                        ? 'Log classes to get a real number.'
                        : atRisk
                          ? worst
                            ? `${worst.subject}: attend ${worst.classesNeeded} more to hit 75%.`
                            : 'Below the 75% line. Fix it this week.'
                          : `${totals.att}/${totals.tot} classes. You can skip ${worst?.classesCanSkip ?? 0} and stay safe.`}
                    </div>
                  </div>
                </div>
                {enriched.slice(0, 3).map((r) => (
                  <div key={r.id} className="flex items-center justify-between py-2 border-b border-dashed border-[rgba(255,255,255,0.08)] last:border-0 text-[13px]">
                    <span className="truncate text-[#FAFAFA]">{r.subject}</span>
                    <span className={`font-[family-name:var(--font-jetbrains-mono)] text-[11px] ${r.riskLevel === 'danger' || r.riskLevel === 'warning' ? 'text-[#E5342B]' : 'text-[#7A7A7A]'}`}>
                      {r.percentage}%
                    </span>
                  </div>
                ))}
                <Link href="/attendance" className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#454545] hover:text-[#FAFAFA] transition-colors mt-2 inline-block">
                  OPEN ATTENDANCE →
                </Link>
              </>
            )}
          </div>
        </div>

        {/* 02 TASKS */}
        <div className="col-span-12 lg:col-span-5 border-t border-dashed border-[rgba(255,255,255,0.14)] lg:border-r">
          <div className="px-6 py-6">
            <div className="flex justify-between items-center mb-5 font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#7A7A7A]">
              <span>TASKS · {doneCount} OF {tasks.length} DONE</span>
              <span className="text-[#454545]">02</span>
            </div>
            {tasksLoading && <div className="text-[13px] text-[#454545] font-[family-name:var(--font-jetbrains-mono)]">LOADING…</div>}
            {!tasksLoading && sortedTasks.map((task) => {
              const overdue = isOverdue(task.due_date, task.completed)
              return (
                <div key={task.id} className="flex items-center gap-3.5 py-2.5 border-b border-dashed border-[rgba(255,255,255,0.14)] last:border-0">
                  <button
                    onClick={() => toggleComplete(task.id)}
                    aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                    className={`nos-check ${task.completed ? 'done' : ''}`}
                  >
                    {task.completed && (
                      <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 12 12">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    )}
                  </button>
                  <div className={`text-sm flex-1 truncate ${task.completed ? 'line-through text-[#454545]' : ''}`}>
                    {task.title}
                    <span className="text-[#454545] text-xs ml-2">{task.subject}</span>
                  </div>
                  <div className={`font-[family-name:var(--font-jetbrains-mono)] text-[11px] ${overdue ? 'text-[#E5342B]' : 'text-[#7A7A7A]'}`}>
                    {overdue ? 'OVERDUE' : formatDueDate(task.due_date).toUpperCase()}
                  </div>
                </div>
              )
            })}
            {!tasksLoading && tasks.length === 0 && (
              <div className="text-[13px] text-[#454545]">Nothing on the list yet.</div>
            )}
            {!tasksLoading && pending.length > 5 && (
              <Link href="/tasks" className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#454545] hover:text-[#FAFAFA] mt-2 inline-block">
                +{pending.length - 5} MORE →
              </Link>
            )}
            <form onSubmit={handleQuickAdd} className="flex gap-2 mt-4">
              <input
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                placeholder="+ quick add — due today…"
                className="flex-1 bg-black border border-[rgba(255,255,255,0.22)] px-3 py-2.5 text-[13px] placeholder:text-[#454545] focus:outline-none focus:border-[#E5342B]"
              />
              <button type="submit" className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] border border-[rgba(255,255,255,0.22)] px-4 hover:bg-[#151515] transition-colors">
                ADD
              </button>
            </form>
          </div>
        </div>

        {/* 03 TIMELINE */}
        <div className="col-span-12 lg:col-span-3 border-t border-dashed border-[rgba(255,255,255,0.14)]">
          <div className="px-6 py-6">
            <div className="flex justify-between items-center mb-5 font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#7A7A7A]">
              <span>TIMELINE</span>
              <span className="text-[#454545]">03</span>
            </div>
            {timeline.length === 0 ? (
              <div className="text-[13px] text-[#454545]">Nothing scheduled.<br />Enjoy the silence.</div>
            ) : (
              timeline.map((item, i) => (
                <div key={i} className="flex gap-3 py-2">
                  <div className="font-[family-name:var(--font-dot-gothic)] text-[13px] text-[#7A7A7A] w-11 shrink-0">
                    {item.time}
                  </div>
                  <div className="text-[13px] leading-snug">{item.text}</div>
                </div>
              ))
            )}
            <Link href="/timeline" className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#454545] hover:text-[#FAFAFA] transition-colors mt-3 inline-block">
              FULL TIMELINE →
            </Link>
            {events[0] && (
              <div className="mt-4 pt-4 border-t border-dashed border-[rgba(255,255,255,0.14)]">
                <div className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#454545] mb-1">NEXT UP</div>
                <div className="text-sm">{events[0].title}</div>
                <div className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#E5342B]">
                  {events[0].event_date} · {formatEventTime(events[0].event_time)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* strip */}
      <div className="grid md:grid-cols-3 border-b border-dashed border-[rgba(255,255,255,0.14)]">
        {[
          { n: '04', t: 'Log honestly', d: 'Missed class still counts. The math only works if you feed it truth.' },
          { n: '05', t: '75% is the line', d: 'Everything in Breezy is measured against it. No streaks, no XP, just the line.' },
          { n: '06', t: 'Clear it daily', d: 'Five pending tasks max. If the list grows, split it or drop something.' },
        ].map((s) => (
          <div key={s.n} className="px-6 py-8 md:border-r border-b md:border-b-0 border-dashed border-[rgba(255,255,255,0.14)] last:border-r-0 last:border-b-0">
            <div className="font-[family-name:var(--font-dot-gothic)] text-[#454545] text-[13px] mb-3">{s.n}</div>
            <div className="text-[16px] font-semibold mb-2">{s.t}</div>
            <div className="text-[13px] text-[#7A7A7A] max-w-[280px]">{s.d}</div>
          </div>
        ))}
      </div>

      <footer className="py-7 flex justify-between items-center font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#454545] flex-wrap gap-2">
        <div>BREEZY / STUDENT OS{profile?.branch ? ` / ${profile.branch.toUpperCase()}` : ''}</div>
        <div>V0.1</div>
      </footer>
    </div>
  )
}

// ── Breezy Database Types ─────────────────────────────────────────────────────
// Mirrors the exact Supabase Postgres schema. All IDs are UUIDs.

export interface Profile {
  id: string
  name: string
  branch: string
  semester: number
}

export interface Task {
  id: string
  user_id: string
  title: string
  subject: string
  priority: 'low' | 'medium' | 'high'
  due_date: string // ISO date string yyyy-MM-dd
  completed: boolean
}

export interface AttendanceRecord {
  id: string
  user_id: string
  subject: string
  attended: number
  total: number
}

export interface CalendarEvent {
  id: string
  user_id: string
  title: string
  event_date: string // ISO date string yyyy-MM-dd
  event_time: string // HH:mm:ss
}

// ── Derived / UI Types ────────────────────────────────────────────────────────

export type Priority = Task['priority']

export type RiskLevel = 'safe' | 'warning' | 'danger' | 'perfect'

export interface AttendanceWithRisk extends AttendanceRecord {
  percentage: number
  riskLevel: RiskLevel
  classesNeeded: number  // classes needed to reach 75%
  classesCanSkip: number // classes can skip while staying >= 75%
}

export interface TimelineEntry {
  id: string
  type: 'task' | 'event'
  title: string
  date: string       // ISO date
  time?: string      // HH:mm (events only)
  subject?: string   // tasks only
  priority?: Priority
  completed?: boolean
}

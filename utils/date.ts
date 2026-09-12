// ── Date Utilities ────────────────────────────────────────────────────────────

import { format, isToday, isTomorrow, isPast, differenceInCalendarDays, parseISO } from 'date-fns'

/**
 * Formats a yyyy-MM-dd string for human display.
 * Returns "Today", "Tomorrow", or "Mon 15 Sep" style.
 */
export function formatDueDate(dateStr: string): string {
  const date = parseISO(dateStr)
  if (isToday(date)) return 'Today'
  if (isTomorrow(date)) return 'Tomorrow'
  return format(date, 'EEE d MMM')
}

/**
 * Returns true if the given yyyy-MM-dd string is today.
 */
export function isDueToday(dateStr: string): boolean {
  return isToday(parseISO(dateStr))
}

/**
 * Returns true if the due date is in the past and task is not completed.
 */
export function isOverdue(dateStr: string, completed: boolean): boolean {
  if (completed) return false
  const date = parseISO(dateStr)
  return isPast(date) && !isToday(date)
}

/**
 * Returns how many days until a due date. Negative = overdue.
 */
export function daysUntilDue(dateStr: string): number {
  return differenceInCalendarDays(parseISO(dateStr), new Date())
}

/**
 * Formats a time string HH:mm:ss → "9:30 AM"
 */
export function formatEventTime(timeStr: string): string {
  // timeStr is HH:mm:ss from Postgres
  const [hours, minutes] = timeStr.split(':').map(Number)
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const h = hours % 12 || 12
  return `${h}:${minutes.toString().padStart(2, '0')} ${ampm}`
}

/**
 * Returns a time-aware greeting prefix.
 */
export function getGreetingPrefix(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

/**
 * Converts a yyyy-MM-dd string to a Date object for sorting.
 */
export function toDate(dateStr: string): Date {
  return parseISO(dateStr)
}

/**
 * Today as yyyy-MM-dd.
 */
export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { AttendanceRecord } from '@/types/database'
import { toast } from 'sonner'

export function useAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRecords = useCallback(async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .order('subject', { ascending: true })
    if (!error && data) setRecords(data as AttendanceRecord[])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchRecords()
  }, [fetchRecords])

  const addSubject = useCallback(
    async (subject: string) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const tempId = `temp-${Date.now()}`
      const optimistic: AttendanceRecord = { id: tempId, user_id: user.id, subject, attended: 0, total: 0 }
      setRecords(prev => [...prev, optimistic])

      const { data, error } = await supabase
        .from('attendance')
        .insert({ user_id: user.id, subject, attended: 0, total: 0 })
        .select()
        .single()

      if (error) {
        setRecords(prev => prev.filter(r => r.id !== tempId))
        toast.error('Failed to add subject')
        return
      }
      setRecords(prev => prev.map(r => (r.id === tempId ? (data as AttendanceRecord) : r)))
      toast.success(`${subject} added`)
    },
    []
  )

  /**
   * Logs a class — increments total (and optionally attended).
   */
  const logClass = useCallback(
    async (id: string, attended: boolean) => {
      const supabase = createClient()
      const record = records.find(r => r.id === id)
      if (!record) return

      const updates = {
        total: record.total + 1,
        attended: attended ? record.attended + 1 : record.attended,
      }

      // Optimistic update
      setRecords(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)))

      const { error } = await supabase.from('attendance').update(updates).eq('id', id)

      if (error) {
        setRecords(prev => prev.map(r => (r.id === id ? record : r)))
        toast.error('Failed to log class')
      }
    },
    [records]
  )

  const deleteSubject = useCallback(
    async (id: string) => {
      const supabase = createClient()
      const snapshot = records
      setRecords(prev => prev.filter(r => r.id !== id))

      const { error } = await supabase.from('attendance').delete().eq('id', id)
      if (error) {
        setRecords(snapshot)
        toast.error('Failed to remove subject')
        return
      }
      toast.success('Subject removed')
    },
    [records]
  )

  return { records, loading, addSubject, logClass, deleteSubject, refetch: fetchRecords }
}

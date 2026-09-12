'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Task } from '@/types/database'
import { toast } from 'sonner'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTasks = useCallback(async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('due_date', { ascending: true })
    if (!error && data) setTasks(data as Task[])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const addTask = useCallback(
    async (payload: Omit<Task, 'id' | 'user_id' | 'completed'>) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Optimistic insert with temp id
      const tempId = `temp-${Date.now()}`
      const optimistic: Task = { ...payload, id: tempId, user_id: user.id, completed: false }
      setTasks(prev => [...prev, optimistic])

      const { data, error } = await supabase
        .from('tasks')
        .insert({ ...payload, user_id: user.id, completed: false })
        .select()
        .single()

      if (error) {
        setTasks(prev => prev.filter(t => t.id !== tempId))
        toast.error('Failed to save task')
        return
      }
      setTasks(prev => prev.map(t => (t.id === tempId ? (data as Task) : t)))
      toast.success('Task added')
    },
    []
  )

  const updateTask = useCallback(
    async (id: string, updates: Partial<Omit<Task, 'id' | 'user_id'>>) => {
      const supabase = createClient()
      const prev = tasks.find(t => t.id === id)
      if (!prev) return

      // Optimistic update
      setTasks(tasks => tasks.map(t => (t.id === id ? { ...t, ...updates } : t)))

      const { error } = await supabase.from('tasks').update(updates).eq('id', id)

      if (error) {
        // Rollback
        setTasks(tasks => tasks.map(t => (t.id === id ? prev : t)))
        toast.error('Failed to update task')
      }
    },
    [tasks]
  )

  const toggleComplete = useCallback(
    async (id: string) => {
      const task = tasks.find(t => t.id === id)
      if (!task) return
      await updateTask(id, { completed: !task.completed })
    },
    [tasks, updateTask]
  )

  const deleteTask = useCallback(
    async (id: string) => {
      const supabase = createClient()
      const snapshot = tasks
      setTasks(prev => prev.filter(t => t.id !== id))

      const { error } = await supabase.from('tasks').delete().eq('id', id)
      if (error) {
        setTasks(snapshot)
        toast.error('Failed to delete task')
        return
      }
      toast.success('Task deleted')
    },
    [tasks]
  )

  return { tasks, loading, addTask, updateTask, toggleComplete, deleteTask, refetch: fetchTasks }
}

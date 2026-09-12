'use client'

import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { todayISO } from '@/utils/date'
import type { Task, Priority } from '@/types/database'

interface TaskModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: Omit<Task, 'id' | 'user_id' | 'completed'>) => Promise<void>
  initialData?: Task
}

const PRIORITIES: Priority[] = ['low', 'medium', 'high']

const priorityColors: Record<Priority, string> = {
  low: 'text-[#a1a1aa]',
  medium: 'text-[#f59e0b]',
  high: 'text-[#ef4444]',
}

export function TaskModal({ open, onClose, onSave, initialData }: TaskModalProps) {
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [dueDate, setDueDate] = useState(todayISO())
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setTitle(initialData?.title ?? '')
      setSubject(initialData?.subject ?? '')
      setPriority(initialData?.priority ?? 'medium')
      setDueDate(initialData?.due_date ?? todayISO())
      setErrors({})
    }
  }, [open, initialData])

  function validate() {
    const e: Record<string, string> = {}
    if (!title.trim()) e.title = 'Title is required'
    if (!subject.trim()) e.subject = 'Subject is required'
    if (!dueDate) e.dueDate = 'Due date is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    await onSave({ title: title.trim(), subject: subject.trim(), priority, due_date: dueDate })
    setLoading(false)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialData ? 'Edit task' : 'New task'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="Task title"
          placeholder="e.g. Submit lab report"
          value={title}
          onChange={e => setTitle(e.target.value)}
          error={errors.title}
          autoFocus
        />

        <Input
          label="Subject"
          placeholder="e.g. Physics"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          error={errors.subject}
        />

        {/* Priority segmented control */}
        <div className="flex flex-col gap-1.5">
          <span className="text-sm text-[#a1a1aa] font-medium">Priority</span>
          <div
            className="flex gap-1 p-1 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)]"
            role="radiogroup"
            aria-label="Priority"
          >
            {PRIORITIES.map(p => (
              <button
                key={p}
                type="button"
                role="radio"
                aria-checked={priority === p}
                onClick={() => setPriority(p)}
                className={`
                  flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors duration-150
                  ${priority === p
                    ? `bg-[rgba(255,255,255,0.10)] ${priorityColors[p]}`
                    : 'text-[#71717a] hover:text-[#a1a1aa]'
                  }
                `}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Due date"
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          error={errors.dueDate}
          min={todayISO()}
        />

        <div className="flex gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" loading={loading} className="flex-1">
            {initialData ? 'Save changes' : 'Add task'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

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

export function TaskModal({ open, onClose, onSave, initialData }: TaskModalProps) {
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [dueDate, setDueDate] = useState(todayISO())
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

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
    if (!title.trim()) e.title = 'TITLE IS REQUIRED'
    if (!subject.trim()) e.subject = 'SUBJECT IS REQUIRED'
    if (!dueDate) e.dueDate = 'DUE DATE IS REQUIRED'
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
      title={initialData ? 'EDIT TASK' : 'NEW TASK'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
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

        <div className="flex flex-col gap-2">
          <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#7A7A7A] uppercase tracking-widest">Priority</span>
          <div className="grid grid-cols-3 border border-[rgba(255,255,255,0.22)]" role="radiogroup" aria-label="Priority">
            {PRIORITIES.map(p => (
              <button
                key={p}
                type="button"
                role="radio"
                aria-checked={priority === p}
                onClick={() => setPriority(p)}
                className={`
                  py-2.5 font-[family-name:var(--font-jetbrains-mono)] text-[11px] uppercase tracking-widest transition-colors
                  border-r border-[rgba(255,255,255,0.14)] last:border-r-0
                  ${priority === p
                    ? p === 'high' ? 'bg-[#E5342B] text-black' : 'bg-[#FAFAFA] text-black'
                    : 'text-[#7A7A7A] hover:text-[#FAFAFA] hover:bg-[#151515]'
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

        <div className="flex gap-3 pt-1">
          <Button variant="ghost" type="button" onClick={onClose} className="flex-1">
            CANCEL
          </Button>
          <Button variant="primary" type="submit" loading={loading} className="flex-1">
            {initialData ? 'SAVE' : 'ADD TASK'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

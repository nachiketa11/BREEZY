'use client'

import { useState } from 'react'
import { useAttendance } from '@/hooks/useAttendance'
import { AttendanceCard } from '@/components/attendance/AttendanceCard'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { enrichAttendance, sortByRisk } from '@/utils/attendance-math'
import { GraduationCap, Plus } from 'lucide-react'

export default function AttendancePage() {
  const { records, loading, addSubject, logClass, deleteSubject } = useAttendance()
  const [modalOpen, setModalOpen] = useState(false)
  const [newSubject, setNewSubject] = useState('')
  const [subjectError, setSubjectError] = useState('')
  const [saving, setSaving] = useState(false)

  const enriched = sortByRisk(records.map(enrichAttendance))

  async function handleAddSubject(e: React.FormEvent) {
    e.preventDefault()
    if (!newSubject.trim()) { setSubjectError('Enter a subject name'); return }
    if (records.some(r => r.subject.toLowerCase() === newSubject.trim().toLowerCase())) {
      setSubjectError('Subject already added'); return
    }
    setSaving(true)
    await addSubject(newSubject.trim())
    setSaving(false)
    setNewSubject('')
    setModalOpen(false)
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#f4f4f5]">
            Attendance
          </h1>
          <p className="text-sm text-[#71717a] mt-1">Track your class attendance per subject</p>
        </div>
        <Button onClick={() => { setModalOpen(true); setSubjectError(''); setNewSubject('') }} size="sm">
          <Plus className="w-4 h-4" /> Add subject
        </Button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[0, 1, 2].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : enriched.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <GraduationCap className="w-12 h-12 text-[#3f3f46]" />
          <div>
            <p className="text-sm font-medium text-[#71717a]">No subjects tracked yet</p>
            <p className="text-xs text-[#52525b] mt-1">
              Add your subjects and log every class to see your attendance risk
            </p>
          </div>
          <Button onClick={() => setModalOpen(true)} variant="secondary" size="sm">
            <Plus className="w-4 h-4" /> Add your first subject
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {enriched.map((record, i) => (
            <AttendanceCard
              key={record.id}
              record={record}
              index={i}
              onLogClass={(attended) => logClass(record.id, attended)}
              onDelete={() => deleteSubject(record.id)}
            />
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add subject"
      >
        <form onSubmit={handleAddSubject} className="flex flex-col gap-4" noValidate>
          <Input
            label="Subject name"
            placeholder="e.g. Algorithms & Data Structures"
            value={newSubject}
            onChange={e => { setNewSubject(e.target.value); setSubjectError('') }}
            error={subjectError}
            autoFocus
          />
          <div className="flex gap-3">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" loading={saving} className="flex-1">
              Add subject
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

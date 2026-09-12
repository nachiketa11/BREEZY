'use client'

import { useState } from 'react'
import { useAttendance } from '@/hooks/useAttendance'
import { AttendanceCard } from '@/components/attendance/AttendanceCard'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { enrichAttendance, sortByRisk } from '@/utils/attendance-math'

export default function AttendancePage() {
  const { records, loading, addSubject, logClass, deleteSubject } = useAttendance()
  const [modalOpen, setModalOpen] = useState(false)
  const [newSubject, setNewSubject] = useState('')
  const [subjectError, setSubjectError] = useState('')
  const [saving, setSaving] = useState(false)

  const enriched = sortByRisk(records.map(enrichAttendance))
  const totalAtt = records.reduce((s, r) => s + r.attended, 0)
  const totalTot = records.reduce((s, r) => s + r.total, 0)
  const overall = totalTot === 0 ? 0 : Math.round((totalAtt / totalTot) * 100)

  async function handleAddSubject(e: React.FormEvent) {
    e.preventDefault()
    if (!newSubject.trim()) { setSubjectError('ENTER A SUBJECT NAME'); return }
    if (records.some(r => r.subject.toLowerCase() === newSubject.trim().toLowerCase())) {
      setSubjectError('SUBJECT ALREADY ADDED'); return
    }
    setSaving(true)
    await addSubject(newSubject.trim())
    setSaving(false)
    setNewSubject('')
    setModalOpen(false)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#454545]">
        /// ATTENDANCE — LINE IS 75%
      </div>

      <div className="flex items-center justify-between gap-4 mt-2 pb-6 border-b border-dashed border-[rgba(255,255,255,0.14)]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Attendance{' '}
            {totalTot > 0 && (
              <span className={`font-[family-name:var(--font-dot-gothic)] font-normal text-xl ml-1 ${overall < 75 ? 'text-[#E5342B]' : 'text-[#7A7A7A]'}`}>
                {overall}%
              </span>
            )}
          </h1>
          <p className="text-[13px] text-[#7A7A7A] mt-1">
            {totalTot === 0 ? 'Add subjects, then log every class. No faking.' : `${totalAtt}/${totalTot} classes overall. Sorted worst-first.`}
          </p>
        </div>
        <Button variant="primary" onClick={() => { setModalOpen(true); setSubjectError(''); setNewSubject('') }} size="sm">
          + SUBJECT
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col mt-4">
          {[0, 1, 2].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : enriched.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center border-b border-dashed border-[rgba(255,255,255,0.14)]">
          <div className="font-[family-name:var(--font-dot-gothic)] text-4xl text-[#454545]">%</div>
          <p className="text-sm text-[#7A7A7A]">No subjects tracked yet.</p>
          <p className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#454545]">ADD THEM ONE BY ONE. LOG AFTER EVERY CLASS.</p>
          <Button onClick={() => setModalOpen(true)} variant="secondary" size="sm">
            + ADD YOUR FIRST SUBJECT
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-0 mt-4 border-b border-l border-r border-dashed border-[rgba(255,255,255,0.14)]">
          {enriched.map((record, i) => (
            <div key={record.id} className="border-r border-dashed border-[rgba(255,255,255,0.14)] last:border-r-0 sm:[&:nth-child(2n)]:border-r-0">
              <AttendanceCard
                record={record}
                index={i}
                onLogClass={(attended) => logClass(record.id, attended)}
                onDelete={() => deleteSubject(record.id)}
              />
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="ADD SUBJECT"
      >
        <form onSubmit={handleAddSubject} className="flex flex-col gap-5" noValidate>
          <Input
            label="Subject name"
            placeholder="e.g. Data Structures"
            value={newSubject}
            onChange={e => { setNewSubject(e.target.value); setSubjectError('') }}
            error={subjectError}
            autoFocus
          />
          <div className="flex gap-3">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)} className="flex-1">
              CANCEL
            </Button>
            <Button variant="primary" type="submit" loading={saving} className="flex-1">
              ADD SUBJECT
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

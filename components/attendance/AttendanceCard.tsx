'use client'

import { useState } from 'react'
import { getRiskCopy } from '@/utils/attendance-math'
import type { AttendanceWithRisk } from '@/types/database'

interface AttendanceCardProps {
  record: AttendanceWithRisk
  onLogClass: (attended: boolean) => void
  onDelete: () => void
  index: number
}

export function AttendanceCard({ record, onLogClass, onDelete, index }: AttendanceCardProps) {
  const [confirming, setConfirming] = useState(false)
  const radius = 30
  const circ = 2 * Math.PI * radius
  const off = circ - (record.percentage / 100) * circ
  const danger = record.riskLevel === 'danger' || record.riskLevel === 'warning'
  const idx = String(index + 1).padStart(2, '0')

  return (
    <div className="bg-[#0D0D0D] border-t border-dashed border-[rgba(255,255,255,0.14)] p-6 flex flex-col gap-5">
      <div className="flex justify-between items-center font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#7A7A7A]">
        <span className="truncate mr-3 text-[#FAFAFA] text-[13px] font-[family-name:var(--font-space-grotesk)] font-semibold tracking-normal">
          {record.subject.toUpperCase()}
        </span>
        <span className="text-[#454545] shrink-0">{idx}</span>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative w-[72px] h-[72px] shrink-0">
          <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
            <circle cx="40" cy="40" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
            <circle
              cx="40" cy="40" r={radius} fill="none"
              stroke={danger ? '#E5342B' : '#FAFAFA'}
              strokeWidth="5"
              strokeDasharray={circ}
              strokeDashoffset={off}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-[family-name:var(--font-dot-gothic)] text-lg">
            {record.percentage}
          </div>
        </div>
        <div className="min-w-0">
          <p className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#7A7A7A]">
            {record.attended}/{record.total} CLASSES
          </p>
          <p className={`text-[13px] mt-1 leading-snug ${danger ? 'text-[#E5342B]' : 'text-[#7A7A7A]'}`}>
            {getRiskCopy(record)}
          </p>
          {/* bunk-o-meter: plain sentence, no gamification */}
          {record.total > 0 && (
            <p className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#454545] mt-1">
              {record.classesCanSkip > 0
                ? `BUNK BUDGET: ${record.classesCanSkip}`
                : record.classesNeeded > 0
                  ? `NEED: +${record.classesNeeded} TO RECOVER`
                  : 'ON THE LINE — GO TO CLASS'}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 border border-[rgba(255,255,255,0.22)]">
        <button
          onClick={() => onLogClass(true)}
          aria-label={`Mark attended for ${record.subject}`}
          className="py-2.5 font-[family-name:var(--font-jetbrains-mono)] text-[11px] tracking-widest text-[#FAFAFA] border-r border-[rgba(255,255,255,0.14)] hover:bg-[#151515] transition-colors"
        >
          + PRESENT
        </button>
        <button
          onClick={() => onLogClass(false)}
          aria-label={`Mark missed for ${record.subject}`}
          className="py-2.5 font-[family-name:var(--font-jetbrains-mono)] text-[11px] tracking-widest text-[#7A7A7A] hover:text-[#E5342B] hover:bg-[rgba(229,52,43,0.08)] transition-colors"
        >
          − ABSENT
        </button>
      </div>

      <div className="flex justify-end">
        {confirming ? (
          <div className="flex items-center gap-2 font-[family-name:var(--font-jetbrains-mono)] text-[11px]">
            <span className="text-[#7A7A7A]">REMOVE?</span>
            <button onClick={() => { setConfirming(false); onDelete() }} className="text-[#E5342B] border border-[rgba(229,52,43,0.5)] px-2 py-1">YES</button>
            <button onClick={() => setConfirming(false)} className="text-[#7A7A7A] border border-[rgba(255,255,255,0.14)] px-2 py-1">NO</button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            aria-label="Remove subject"
            className="font-[family-name:var(--font-jetbrains-mono)] text-[11px] text-[#454545] hover:text-[#E5342B] transition-colors"
          >
            REMOVE _
          </button>
        )}
      </div>
    </div>
  )
}

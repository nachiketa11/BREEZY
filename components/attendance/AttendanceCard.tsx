'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ProgressRing } from '@/components/attendance/ProgressRing'
import { RiskBadge } from '@/components/attendance/RiskBadge'
import { Button } from '@/components/ui/Button'
import { getRiskCopy } from '@/utils/attendance-math'
import { Trash2, CheckCircle, XCircle } from 'lucide-react'
import type { AttendanceWithRisk } from '@/types/database'

interface AttendanceCardProps {
  record: AttendanceWithRisk
  onLogClass: (attended: boolean) => void
  onDelete: () => void
  index: number
}

export function AttendanceCard({ record, onLogClass, onDelete, index }: AttendanceCardProps) {
  const [confirming, setConfirming] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.22 }}
      className="glass p-5 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        <ProgressRing percentage={record.percentage} riskLevel={record.riskLevel} />
        <div className="flex-1 min-w-0">
          <h3 className="font-[family-name:var(--font-space-grotesk)] text-base font-semibold text-[#f4f4f5] truncate">
            {record.subject}
          </h3>
          <p className="text-xs text-[#71717a] mt-1">
            {record.attended} of {record.total} classes attended
          </p>
          <div className="mt-2">
            <RiskBadge riskLevel={record.riskLevel} copy={getRiskCopy(record)} />
          </div>
        </div>

        {/* Delete */}
        {confirming ? (
          <div className="flex flex-col gap-1">
            <p className="text-xs text-[#71717a] text-right mb-1">Remove?</p>
            <div className="flex gap-1">
              <button
                onClick={() => { setConfirming(false); onDelete() }}
                aria-label="Confirm remove subject"
                className="p-1.5 rounded-lg text-[#ef4444] hover:bg-[rgba(239,68,68,0.1)] transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => setConfirming(false)}
                aria-label="Cancel"
                className="p-1.5 rounded-lg text-[#71717a] hover:bg-[rgba(255,255,255,0.08)] transition-colors"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            aria-label="Remove subject"
            className="p-1.5 rounded-lg text-[#3f3f46] hover:text-[#ef4444] hover:bg-[rgba(239,68,68,0.08)] transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Log class actions */}
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          onClick={() => onLogClass(true)}
          aria-label={`Mark attended class for ${record.subject}`}
        >
          <CheckCircle className="w-3.5 h-3.5 text-[#22c55e]" />
          Attended
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          onClick={() => onLogClass(false)}
          aria-label={`Mark missed class for ${record.subject}`}
        >
          <XCircle className="w-3.5 h-3.5 text-[#ef4444]" />
          Missed
        </Button>
      </div>
    </motion.div>
  )
}

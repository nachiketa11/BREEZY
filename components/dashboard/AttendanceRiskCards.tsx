'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAttendance } from '@/hooks/useAttendance'
import { Card } from '@/components/ui/Card'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { enrichAttendance, sortByRisk, getRiskCopy } from '@/utils/attendance-math'
import { GraduationCap, Plus, AlertTriangle, CheckCircle } from 'lucide-react'
import type { AttendanceWithRisk } from '@/types/database'

function MiniRiskCard({ record }: { record: AttendanceWithRisk }) {
  const riskColors = {
    danger:  { text: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)' },
    warning: { text: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' },
    safe:    { text: '#22d3ee', bg: 'rgba(34,211,238,0.08)', border: 'rgba(34,211,238,0.15)' },
    perfect: { text: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.15)' },
  }
  const colors = riskColors[record.riskLevel]

  return (
    <div
      className="p-3 rounded-xl border flex items-center gap-3"
      style={{ background: colors.bg, borderColor: colors.border }}
    >
      {record.riskLevel === 'danger' || record.riskLevel === 'warning' ? (
        <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: colors.text }} />
      ) : (
        <CheckCircle className="w-4 h-4 shrink-0" style={{ color: colors.text }} />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#f4f4f5] truncate">{record.subject}</p>
        <p className="text-xs mt-0.5" style={{ color: colors.text }}>
          {record.percentage}% — {getRiskCopy(record)}
        </p>
      </div>
    </div>
  )
}

export function AttendanceRiskCards() {
  const { records, loading } = useAttendance()

  if (loading) {
    return (
      <section className="flex flex-col gap-3">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-base font-semibold text-[#f4f4f5]">
          Attendance risk
        </h2>
        {[0, 1].map(i => <CardSkeleton key={i} />)}
      </section>
    )
  }

  const enriched = sortByRisk(records.map(enrichAttendance))
  // Show up to 3 on dashboard — prioritise danger/warning
  const atRisk = enriched.filter(r => r.riskLevel === 'danger' || r.riskLevel === 'warning')
  const shown = atRisk.length > 0 ? atRisk.slice(0, 3) : enriched.slice(0, 2)

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-base font-semibold text-[#f4f4f5]">
          Attendance risk
        </h2>
        <Link href="/attendance" className="text-xs text-[#a855f7] hover:text-[#c084fc] transition-colors">
          View all
        </Link>
      </div>

      {enriched.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-8 text-center">
          <GraduationCap className="w-8 h-8 text-[#52525b]" />
          <div>
            <p className="text-sm font-medium text-[#a1a1aa]">No subjects tracked yet</p>
            <p className="text-xs text-[#52525b] mt-1">Add your subjects to monitor attendance risk</p>
          </div>
          <Link
            href="/attendance"
            className="inline-flex items-center gap-1.5 text-xs text-[#a855f7] hover:text-[#c084fc] transition-colors mt-1"
          >
            <Plus className="w-3.5 h-3.5" /> Track attendance
          </Link>
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {shown.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <MiniRiskCard record={r} />
            </motion.div>
          ))}
          {enriched.length > 3 && (
            <Link href="/attendance" className="text-xs text-center text-[#71717a] hover:text-[#f4f4f5] transition-colors mt-1">
              +{enriched.length - 3} more subjects
            </Link>
          )}
        </div>
      )}
    </section>
  )
}

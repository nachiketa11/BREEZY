import type { RiskLevel } from '@/types/database'

interface RiskBadgeProps {
  riskLevel: RiskLevel
  copy: string
}

const config: Record<RiskLevel, { label: string; className: string }> = {
  danger:  { label: 'At risk',  className: 'bg-[rgba(239,68,68,0.12)] text-[#ef4444] border-[rgba(239,68,68,0.3)]' },
  warning: { label: 'Warning',  className: 'bg-[rgba(245,158,11,0.12)] text-[#f59e0b] border-[rgba(245,158,11,0.3)]' },
  safe:    { label: 'Safe',     className: 'bg-[rgba(34,211,238,0.10)] text-[#22d3ee] border-[rgba(34,211,238,0.3)]' },
  perfect: { label: 'Excellent',className: 'bg-[rgba(34,197,94,0.10)] text-[#22c55e] border-[rgba(34,197,94,0.3)]' },
}

export function RiskBadge({ riskLevel, copy }: RiskBadgeProps) {
  const { label, className } = config[riskLevel]
  return (
    <div className={`px-2 py-1 rounded-lg border text-xs font-medium ${className}`}>
      <span className="font-semibold">{label}</span>
      {' — '}
      {copy}
    </div>
  )
}

import type { RiskLevel } from '@/types/database'

interface RiskBadgeProps {
  riskLevel: RiskLevel
  copy: string
}

const config: Record<RiskLevel, { label: string; danger: boolean }> = {
  danger:  { label: 'AT RISK', danger: true },
  warning: { label: 'WARNING', danger: true },
  safe:    { label: 'SAFE', danger: false },
  perfect: { label: 'CLEAR', danger: false },
}

export function RiskBadge({ riskLevel, copy }: RiskBadgeProps) {
  const { label, danger } = config[riskLevel]
  return (
    <div className={`inline-block px-2 py-1 border font-[family-name:var(--font-jetbrains-mono)] text-[11px] tracking-wide ${danger ? 'text-[#E5342B] border-[rgba(229,52,43,0.5)] bg-[rgba(229,52,43,0.14)]' : 'text-[#7A7A7A] border-[rgba(255,255,255,0.14)]'}`}>
      <span className="font-medium">{label}</span>
      {' — '}
      {copy}
    </div>
  )
}

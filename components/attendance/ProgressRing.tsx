'use client'

import type { RiskLevel } from '@/types/database'

interface ProgressRingProps {
  percentage: number
  riskLevel: RiskLevel
  size?: number
  strokeWidth?: number
}

export function ProgressRing({
  percentage,
  riskLevel,
  size = 80,
  strokeWidth = 6,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference
  const danger = riskLevel === 'danger' || riskLevel === 'warning'
  const color = danger ? '#E5342B' : '#FAFAFA'

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label={`${percentage}% attendance`}
      role="img"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fill: '#FAFAFA', fontSize: size < 60 ? 11 : 13, fontFamily: 'var(--font-dot-gothic), monospace' }}
      >
        {percentage}%
      </text>
    </svg>
  )
}

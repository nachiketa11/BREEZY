'use client'

import { useEffect, useRef } from 'react'
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion'
import type { RiskLevel } from '@/types/database'

interface ProgressRingProps {
  percentage: number
  riskLevel: RiskLevel
  size?: number
  strokeWidth?: number
}

const riskColors: Record<RiskLevel, string> = {
  danger: '#ef4444',
  warning: '#f59e0b',
  safe: '#22d3ee',
  perfect: '#22c55e',
}

export function ProgressRing({
  percentage,
  riskLevel,
  size = 80,
  strokeWidth = 6,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const color = riskColors[riskLevel]

  // Spring-driven count-up
  const motionVal = useMotionValue(0)
  const spring = useSpring(motionVal, { stiffness: 60, damping: 15 })
  const displayVal = useTransform(spring, v => Math.round(v))
  const dashOffset = useTransform(spring, v =>
    circumference - (v / 100) * circumference
  )
  const displayRef = useRef<SVGTextElement>(null)

  useEffect(() => {
    // Skip animation if reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      motionVal.set(percentage)
      return
    }
    motionVal.set(0)
    const t = setTimeout(() => motionVal.set(percentage), 50)
    return () => clearTimeout(t)
  }, [percentage, motionVal])

  useEffect(() => {
    return displayVal.on('change', v => {
      if (displayRef.current) displayRef.current.textContent = `${v}%`
    })
  }, [displayVal])

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label={`${percentage}% attendance`}
      role="img"
    >
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={strokeWidth}
      />
      {/* Arc */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        style={{ strokeDashoffset: dashOffset }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      {/* Label */}
      <text
        ref={displayRef}
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-semibold"
        style={{ fill: color, fontSize: size < 60 ? 11 : 13, fontWeight: 600 }}
      >
        0%
      </text>
    </svg>
  )
}

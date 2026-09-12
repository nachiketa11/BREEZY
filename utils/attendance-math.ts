// ── Attendance Math ───────────────────────────────────────────────────────────

import type { AttendanceRecord, AttendanceWithRisk, RiskLevel } from '@/types/database'

const THRESHOLD = 0.75 // 75%

/**
 * Calculates attendance percentage, risk level, and derived counts.
 */
export function enrichAttendance(record: AttendanceRecord): AttendanceWithRisk {
  const { attended, total } = record
  const percentage = total === 0 ? 100 : Math.round((attended / total) * 100)
  const riskLevel = getRiskLevel(attended, total)
  const classesNeeded = getClassesNeededToReach75(attended, total)
  const classesCanSkip = getClassesCanSkip(attended, total)

  return {
    ...record,
    percentage,
    riskLevel,
    classesNeeded,
    classesCanSkip,
  }
}

/**
 * Determines risk level for a subject.
 */
export function getRiskLevel(attended: number, total: number): RiskLevel {
  if (total === 0) return 'safe'
  const pct = attended / total
  if (pct >= 0.90) return 'perfect'
  if (pct >= 0.75) return 'safe'
  if (pct >= 0.65) return 'warning'
  return 'danger'
}

/**
 * How many consecutive classes must be attended to reach ≥ 75%.
 * Returns 0 if already at or above threshold.
 *
 * Solves: (attended + x) / (total + x) >= 0.75
 * => attended + x >= 0.75 * (total + x)
 * => x (1 - 0.75) >= 0.75 * total - attended
 * => x >= (0.75 * total - attended) / 0.25
 */
export function getClassesNeededToReach75(attended: number, total: number): number {
  if (total === 0) return 0
  if (attended / total >= THRESHOLD) return 0
  const needed = Math.ceil((THRESHOLD * total - attended) / (1 - THRESHOLD))
  return Math.max(0, needed)
}

/**
 * How many classes can be skipped while still staying at or above 75%.
 * Returns 0 if already below threshold.
 *
 * Solves: attended / (total + x) >= 0.75
 * => attended >= 0.75 * (total + x)
 * => x <= attended / 0.75 - total
 */
export function getClassesCanSkip(attended: number, total: number): number {
  if (total === 0) return 0
  if (attended / total < THRESHOLD) return 0
  const canSkip = Math.floor(attended / THRESHOLD - total)
  return Math.max(0, canSkip)
}

/**
 * Human-readable risk copy for the attendance card.
 */
export function getRiskCopy(record: AttendanceWithRisk): string {
  switch (record.riskLevel) {
    case 'danger':
      return `Attend ${record.classesNeeded} more class${record.classesNeeded === 1 ? '' : 'es'} to reach 75%`
    case 'warning':
      return `${record.classesNeeded} class${record.classesNeeded === 1 ? '' : 'es'} away from 75%`
    case 'safe':
      return record.classesCanSkip > 0
        ? `Can skip ${record.classesCanSkip} class${record.classesCanSkip === 1 ? '' : 'es'}`
        : 'Just above the limit — attend your next class'
    case 'perfect':
      return `Great attendance — can skip ${record.classesCanSkip} class${record.classesCanSkip === 1 ? '' : 'es'}`
  }
}

/**
 * Sorts subjects by risk (danger first, then warning, then safe, perfect last).
 */
export function sortByRisk(records: AttendanceWithRisk[]): AttendanceWithRisk[] {
  const order: Record<RiskLevel, number> = { danger: 0, warning: 1, safe: 2, perfect: 3 }
  return [...records].sort((a, b) => order[a.riskLevel] - order[b.riskLevel])
}

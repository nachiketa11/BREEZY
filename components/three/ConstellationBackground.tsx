'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Points } from 'three'

const STAR_COUNT = 120
const SPREAD = 12

/**
 * Sparse constellation background — static points with subtle shimmer.
 * Shimmer disabled when prefers-reduced-motion is set.
 */
export function ConstellationBackground() {
  const pointsRef = useRef<Points>(null)

  const prefersReduced = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const { positions, baseOpacities } = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3)
    const opacities = new Float32Array(STAR_COUNT)

    for (let i = 0; i < STAR_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * SPREAD
      pos[i * 3 + 1] = (Math.random() - 0.5) * SPREAD
      pos[i * 3 + 2] = (Math.random() - 0.5) * SPREAD * 0.5 - 2 // push behind orb
      opacities[i] = 0.2 + Math.random() * 0.6
    }

    return { positions: pos, baseOpacities: opacities }
  }, [])

  const opacitiesAttr = useMemo(() => {
    return new Float32Array(STAR_COUNT).fill(1)
  }, [])

  useFrame((state) => {
    if (!pointsRef.current || prefersReduced) return
    const t = state.clock.elapsedTime

    // Subtle shimmer by modulating opacity
    const colors = pointsRef.current.geometry.attributes.opacity
    if (colors) {
      for (let i = 0; i < STAR_COUNT; i++) {
        const shimmer = Math.sin(t * 0.8 + i * 0.5) * 0.3 + 0.7
        ;(colors.array as Float32Array)[i] = baseOpacities[i] * shimmer
      }
      colors.needsUpdate = true
    }
  })

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.03,
      color: new THREE.Color('#a1a1aa'),
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
      depthWrite: false,
    })
  }, [])

  return (
    <points ref={pointsRef} material={material}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-opacity"
          args={[opacitiesAttr, 1]}
        />
      </bufferGeometry>
    </points>
  )
}

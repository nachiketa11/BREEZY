'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import * as THREE from 'three'

/**
 * Slow-rotating low-poly icosahedron with purple→cyan gradient shader.
 * Float animation respects prefers-reduced-motion.
 */
export function HeroOrb() {
  const meshRef = useRef<Mesh>(null)

  // Check reduced motion preference once
  const prefersReduced = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color('#a855f7') },
        uColorB: { value: new THREE.Color('#22d3ee') },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
          float gradient = (vPosition.y + 1.2) / 2.4;
          vec3 color = mix(uColorA, uColorB, gradient);
          float alpha = 0.6 + fresnel * 0.4;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      wireframe: false,
    })
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime

    // Slow rotation
    meshRef.current.rotation.y = t * 0.15
    meshRef.current.rotation.x = t * 0.08

    // Gentle float (disabled for reduced motion)
    if (!prefersReduced) {
      meshRef.current.position.y = Math.sin(t * 0.5) * 0.15
    }

    // Update time uniform
    shaderMaterial.uniforms.uTime.value = t
  })

  return (
    <mesh ref={meshRef} material={shaderMaterial}>
      <icosahedronGeometry args={[1.4, 1]} />
    </mesh>
  )
}

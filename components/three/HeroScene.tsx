'use client'

import { Canvas } from '@react-three/fiber'
import { HeroOrb } from './HeroOrb'
import { ConstellationBackground } from './ConstellationBackground'

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#a855f7" />
      <pointLight position={[-5, -3, 3]} intensity={0.4} color="#22d3ee" />
      <HeroOrb />
      <ConstellationBackground />
    </Canvas>
  )
}

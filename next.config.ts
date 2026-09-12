import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Allow @react-three/fiber and drei to be transpiled correctly
  transpilePackages: [],
  experimental: {
    // Turbopack is the default dev bundler in Next 16
  },
}

export default nextConfig

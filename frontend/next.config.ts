import path from 'node:path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // ✅ CORRECT: Use `remotePatterns` instead of deprecated `domains`
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // ✅ REMOVE: `swcMinify` is no longer a valid top-level option
  // swcMinify: true, // DELETE THIS LINE

  // ✅ CORRECT: `optimizeCss` is an experimental feature
  experimental: {
    optimizeCss: true,
  },
  
  // ✅ CORRECT: Set the `turbopack.root` to fix the lockfile warning
  turbopack: {
    root: path.resolve(__dirname), // Points to the frontend directory
  },
  
  // Optional: Keep this if you had it
  poweredByHeader: false,
}

export default nextConfig
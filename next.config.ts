import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['images.pexels.com', 'img.clerk.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
}

export default nextConfig

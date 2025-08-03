import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['images.pexels.com', 'img.clerk.com'],
  },
  serverExternalPackages: ['@prisma/client'],
}

export default nextConfig

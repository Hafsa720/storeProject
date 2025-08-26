import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'fcjjjdleknisnmpxwzih.supabase.co',
        // allow any files served from the public storage path
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  serverExternalPackages: ['@prisma/client'],
}

export default nextConfig

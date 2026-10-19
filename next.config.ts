import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp'],
    minimumCacheTTL: 2592000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/api/**'
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        pathname: '/api/**'
      },
      {
        protocol: 'https',
        hostname: 'gallery.buraksaglik.com',
        pathname: '/api/**'
      },
      {
        protocol: 'https',
        hostname: 'api.buraksaglik.com',
        pathname: '/api/**'
      },
      {
        protocol: 'https',
        hostname: 'buraksaglik.com',
        pathname: '/**'
      }
    ]
  }
};

export default nextConfig;

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
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

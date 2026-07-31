import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/api/files/**'
      },
      {
        protocol: 'https',
        hostname: 'gallery.buraksaglik.com',
        pathname: '/api/files/**'
      }
    ]
  }
};

export default nextConfig;

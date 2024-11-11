import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'www.codesymbol.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'buraksaglik.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'http',
        hostname: 'localhost:5001',
        port: '',
        pathname: '/**'
      }
    ]
  }
};

export default nextConfig;

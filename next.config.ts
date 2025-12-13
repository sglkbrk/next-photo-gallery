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
        protocol: 'https',
        hostname: 'gallery.buraksaglik.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'http',
        hostname: 'localhost:5001',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'api.buraksaglik.com',
        port: '',
        pathname: '/**'
      }
    ]
  }
};

export default nextConfig;

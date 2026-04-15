import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://nginx:80/api/:path*',
      },
      {
        source: '/sanctum/:path*',
        destination: 'http://nginx:80/sanctum/:path*',
      },
      {
        source: '/auth/login',
        destination: 'http://nginx:80/login',
      },
      {
        source: '/auth/logout',
        destination: 'http://nginx:80/logout',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-a8395051699348cd862cbff28dac1add.r2.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

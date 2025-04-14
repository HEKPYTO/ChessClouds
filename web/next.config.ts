import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/init',
        destination: 'http://localhost:8000/init'
      },
      {
        source: '/games',
        destination: 'http://localhost:8000/games'
      }
    ]
  }
};

export default nextConfig;

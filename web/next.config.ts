import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_GOOGLE_AUTH_ENDPOINT: process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENDPOINT,
    NEXT_PUBLIC_ENGINE_API_URL: process.env.NEXT_PUBLIC_ENGINE_API_URL,
    NEXT_PUBLIC_WS_SERVER_URL: process.env.NEXT_PUBLIC_WS_SERVER_URL,
    NEXT_PUBLIC_MATCHMAKING_SERVER_URL: process.env.NEXT_PUBLIC_MATCHMAKING_SERVER_URL
  }
};

export default nextConfig;
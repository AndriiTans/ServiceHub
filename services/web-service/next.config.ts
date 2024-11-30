import type { NextConfig } from 'next';
import { loadEnvConfig } from '@next/env';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: '12312',
    NEXT_AUTH_API_URL: process.env.AUTH_API_URL,
    SHOP_API_URL: process.env.SHOP_API_URL,
  },
};

export default nextConfig;

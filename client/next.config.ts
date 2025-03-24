import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  output: 'standalone',
  outputFileTracingIncludes: {
    '*': ['./public/**/*', './.next/static/**/*'], //copy the static files to standalone folder for custom server
  },
   env: {
    HOSTNAME: '0.0.0.0', //ensures that the server listens to all interfaces and hosts on localhost for external access
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb'
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
      },
    ],
  }
};

export default nextConfig;

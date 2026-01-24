import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh4.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh5.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh6.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
      },
      {
        protocol: 'https',
        hostname: '*.gstatic.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/blog',
        destination: '/guides',
        permanent: true,
      },
      {
        source: '/blog/:slug',
        destination: '/guides/:slug',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;

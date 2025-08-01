/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Enable static export for GitHub Pages/static hosting
  // output: 'export', // Temporarily disabled for development - re-enable for production build
  trailingSlash: true,
  // distDir: 'out', // Use default .next for server mode
  
  // Include both tsx and ts files for pages and API routes
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  // Exclude admin pages and other unnecessary pages from build
  webpack: (config) => {
    config.module.rules.push({
      test: /\.tsx?$/,
      exclude: [
        /pages\/admin/,
        /pages\/_excluded/,
        /pages\/register/,
      ],
    });
    return config;
  },
  
  // Ignore build errors
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Ignore ESLint errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Performance Optimizations
  compress: true,
  poweredByHeader: false,
  
  // Image Optimization for Cloudflare
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap.xml',
        permanent: true,
      },
    ];
  },
  
  // Environment Variables
  env: {
    MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
    FIREBASE_CONFIG: process.env.FIREBASE_CONFIG,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'https://beyond2c.pages.dev',
    MONGODB_URI: process.env.MONGODB_URI,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
}

module.exports = nextConfig

module.exports = nextConfig

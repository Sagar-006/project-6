import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    formats: ["image/avif", "image/webp"], // better image compression
    minimumCacheTTL: 60, // cache images for 1 minute
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // allow optimized remote images (like from YouTube, CDN, etc.)
      },
    ],
  },

  compress: true, // enables gzip compression
  swcMinify: true, // faster JS minification
  experimental: {
    optimizeCss: true, // improves CSS loading performance
    scrollRestoration: true, // smoother navigation
  },
};

export default nextConfig;

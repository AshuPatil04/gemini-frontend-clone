// next.config.ts

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // ✅ Ignore TS build errors on Vercel
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Ignore ESLint errors on Vercel
  },
};

export default nextConfig;

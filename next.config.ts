// next.config.ts

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // ✅ Ignore TS build errors on Vercel
  },
};

export default nextConfig;

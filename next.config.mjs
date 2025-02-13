/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['flvhpuholufzxclylrvh.supabase.co'],
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    // Dynamically set NEXTAUTH_URL based on environment
    NEXTAUTH_URL: process.env.VERCEL_ENV === 'production' 
      ? 'https://eriethioresearch.com'
      : process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000',
  },
  // Remove static export for now to allow API routes
  output: 'standalone',
  trailingSlash: true,
}

export default nextConfig

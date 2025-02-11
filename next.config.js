/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-supabase-storage-url.supabase.co'],
    formats: ['image/avif', 'image/webp'],
  },
  // Add other optimizations
} 
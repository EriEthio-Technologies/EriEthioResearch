module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['flvhpuholufzxclylrvh.supabase.co'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' *.sentry.io;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: *.supabase.co;
              font-src 'self';
              connect-src 'self' *.supabase.co;
              frame-src 'self' *.youtube.com *.vimeo.com;
            `.replace(/\n/g, '')
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' }
        ]
      }
    ]
  }
} 
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-inline' *.sentry.io;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: *.supabase.co;
      font-src 'self';
      connect-src 'self' *.supabase.co;
      frame-src *.youtube.com *.vimeo.com;
    `.replace(/\s+/g, ' ')
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  }
} 
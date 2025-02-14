module.exports = {
  ci: {
    collect: {
      staticDistDir: './out',
      url: ['http://localhost:3000'],
      numberOfRuns: 3,
    },
    assert: {
      preset: 'lighthouse:no-pwa',
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 1 }],
      }
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}; 
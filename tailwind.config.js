module.exports = {
  theme: {
    extend: {
      colors: {
        'neon-cyan': '#00f3ff',
        'neon-magenta': '#ff00ff',
        'accessible-gray': {
          100: '#f8f9fa',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#6c757d',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
        }
      },
      contrast: {
        85: '85%',
      }
    }
  },
  variants: {
    extend: {
      contrast: ['hover', 'focus'],
    }
  }
} 
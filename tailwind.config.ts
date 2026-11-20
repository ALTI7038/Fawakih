import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f8f3',
          100: '#dcefe0',
          200: '#bcdfc4',
          300: '#8fc69c',
          400: '#5da571',
          500: '#3d8653',
          600: '#2d6a41',
          700: '#245536',
          800: '#1f442d',
          900: '#1a3926',
          950: '#0e2015',
        },
        cream: {
          50: '#fdfcf8',
          100: '#faf7ef',
          200: '#f3edd8',
          300: '#e9dfba',
          400: '#ddcb8f',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out both',
        'slide-up': 'slideUp 0.5s ease-out both',
        'scale-in': 'scaleIn 0.3s ease-out both',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      boxShadow: {
        card: '0 1px 3px rgba(26, 57, 38, 0.06), 0 4px 16px rgba(26, 57, 38, 0.04)',
        'card-hover':
          '0 4px 12px rgba(26, 57, 38, 0.08), 0 12px 32px rgba(26, 57, 38, 0.08)',
      },
    },
  },
  plugins: [],
}

export default config

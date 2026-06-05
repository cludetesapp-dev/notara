import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        green: {
          DEFAULT: '#166534',
          mid: '#15803d',
          light: '#4ade80',
          pale: '#f0fdf4',
          muted: '#dcfce7',
        },
        soil: '#1c1917',
        clay: '#44403c',
        stone: '#78716c',
        cream: '#fafaf9',
        border: '#e5e7eb',
        bg: '#eef4ee',
      },
      borderRadius: {
        DEFAULT: '14px',
        sm: '10px',
        lg: '20px',
      },
    },
  },
  plugins: [],
} satisfies Config

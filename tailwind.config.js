/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#050814',
          card: 'rgba(10, 15, 30, 0.75)',
          border: 'rgba(0, 243, 255, 0.2)',
          cyan: '#00f3ff',
          blue: '#3b82f6',
          purple: '#a855f7',
          pink: '#ec4899',
          green: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 243, 255, 0.4)',
        'neon-purple': '0 0 20px rgba(168, 85, 247, 0.4)',
        'neon-green': '0 0 20px rgba(16, 185, 129, 0.4)',
        'neon-rose': '0 0 20px rgba(244, 63, 94, 0.4)'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-line': 'scan 3s linear infinite',
        'glow-pulse': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' }
        },
        glow: {
          '0%': { opacity: '0.4', filter: 'drop-shadow(0 0 5px rgba(0, 243, 255, 0.5))' },
          '100%': { opacity: '1', filter: 'drop-shadow(0 0 20px rgba(0, 243, 255, 0.9))' }
        }
      }
    },
  },
  plugins: [],
}

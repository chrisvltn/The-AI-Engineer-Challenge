/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        boho: {
          50: '#fefefe',
          100: '#fdfcf9',
          200: '#faf7f0',
          300: '#f5f0e6',
          400: '#ede4d1',
          500: '#e2d5b8',
          600: '#d4c39a',
          700: '#c3ad7a',
          800: '#b0975f',
          900: '#9a7f4a',
        },
        sage: {
          50: '#f6f7f6',
          100: '#e3e7e3',
          200: '#c7d0c7',
          300: '#a3b3a3',
          400: '#7a907a',
          500: '#5d735d',
          600: '#4a5d4a',
          700: '#3d4b3d',
          800: '#333d33',
          900: '#2b322b',
        }
      },
      fontFamily: {
        'serif': ['Georgia', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} 
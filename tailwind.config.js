/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        cream: '#FBF7F1',
        ink: '#1F3A5F',
        rose: {
          soft: '#FFD6E0',
          deep: '#FF6F91',
        },
        sage: {
          soft: '#D8E4D5',
          deep: '#7A9B72',
        },
        gold: '#FFC56B',
        sky: {
          50: '#EAF6FF',
          100: '#D6ECFF',
          200: '#B3DBFF',
          300: '#87C5FF',
          400: '#5BAEF8',
          500: '#3B97EC',
          600: '#1E78CC',
          700: '#155DA0',
        },
        mint: { soft: '#CFF3E1', deep: '#3FBF8F' },
        lemon: { soft: '#FFF4B8', deep: '#F4C430' },
        lilac: { soft: '#E6D6FF', deep: '#9B7CE0' },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'float-slow': 'floatX 60s linear infinite',
        'float-mid': 'floatX 45s linear infinite',
        'float-fast': 'floatX 30s linear infinite',
        'bob': 'bob 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
        },
        floatX: {
          '0%': { transform: 'translateX(-10vw)' },
          '100%': { transform: 'translateX(110vw)' },
        },
        bob: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}

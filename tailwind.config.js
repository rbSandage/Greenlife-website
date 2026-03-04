/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        green: {
          50:  '#f0faf4',
          100: '#e8f5e9',
          200: '#c8e6c9',
          300: '#a5d6a7',
          400: '#52c786',
          500: '#2d9e5f',
          600: '#1a6b3c',
          700: '#145230',
          800: '#0f3d24',
          900: '#0d1f13',
        },
        amber: {
          400: '#f59e0b',
          500: '#e8a020',
          600: '#c67a10',
        },
        dark: '#0d1f13',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans:    ['DM Sans', 'sans-serif'],
        heading: ['Syne', 'sans-serif'],
      },
      animation: {
        'float':       'float 4s ease-in-out infinite',
        'float-slow':  'float 6s ease-in-out infinite',
        'pulse-dot':   'pulseDot 2s ease-in-out infinite',
        'ticker':      'ticker 28s linear infinite',
        'fade-up':     'fadeUp .6s ease both',
      },
      keyframes: {
        float:    { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        pulseDot: { '0%,100%': { opacity: 1, transform: 'scale(1)' }, '50%': { opacity: 0.4, transform: 'scale(1.5)' } },
        ticker:   { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        fadeUp:   { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0d1f13 0%, #132a1a 60%, #0a2e18 100%)',
        'dark-gradient': 'linear-gradient(135deg, #0d1f13 0%, #132a1a 100%)',
        'green-gradient': 'linear-gradient(135deg, #1a6b3c 0%, #0f4a28 100%)',
      },
    },
  },
  plugins: [],
}

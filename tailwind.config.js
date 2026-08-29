/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f8f6',
          100: '#e1f0ec',
          200: '#c5e2da',
          500: '#12604F',
          600: '#0E5546',
          700: '#0B4A3E',
          800: '#093B32',
          900: '#062821',
        },
        gold: {
          DEFAULT: '#D4A017',
          50: '#fefce8',
          100: '#fef9c3',
          400: '#facc15',
          500: '#D4A017',
          600: '#b8860b',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

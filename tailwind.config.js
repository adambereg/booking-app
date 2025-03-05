/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF5A5F',
          dark: '#FF385C',
          light: '#FF8589',
        },
        secondary: {
          DEFAULT: '#00A699',
          dark: '#008F86',
          light: '#33B5AB',
        },
        neutral: {
          50: '#F8F8F8',
          100: '#F3F3F3',
          200: '#E8E8E8',
          300: '#DDDDDD',
          400: '#CCCCCC',
          500: '#999999',
          600: '#666666',
          700: '#444444',
          800: '#222222',
          900: '#111111',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 6px 16px rgba(0, 0, 0, 0.12)',
        dropdown: '0 2px 16px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
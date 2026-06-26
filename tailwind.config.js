/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff8ff',
          100: '#dff0ff',
          200: '#b9e2ff',
          300: '#78caff',
          400: '#35adff',
          500: '#078ff2',
          600: '#0071ce',
          700: '#005aa7',
          800: '#064d86',
          900: '#0b416f',
        },
        secondary: {
          50: '#f0fdff',
          100: '#ccf7ff',
          200: '#99efff',
          300: '#5ee2f6',
          400: '#22c8dd',
          500: '#06a8c0',
          600: '#07879b',
          700: '#0d6d7e',
          800: '#115969',
          900: '#134b59',
        },
      },
      fontFamily: {
        sans: [
          'Nunito',
          'Comic Sans MS',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Fira Sans',
          'Droid Sans',
          'Helvetica Neue',
          'sans-serif',
        ],
        display: [
          'Baloo 2',
          'Nunito',
          'Comic Sans MS',
          'Segoe Print',
          'cursive',
        ],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

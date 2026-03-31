/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-black': '#1B1B19',
      },
      fontFamily: {
        Montserrat: ['Montserrat'],
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/templates/**/*.html",
    "./app/static/js/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        undertale: ['"Press Start 2P"', 'monospace'],
      },
      borderWidth: {
        '4': '4px',
      },
    },
  },
  plugins: [],
};


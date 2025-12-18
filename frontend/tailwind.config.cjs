/** @type {import('tailwindcss').Config} */
const path = require('path')

module.exports = {
  content: [
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'src/**/*.js'),
    path.join(__dirname, 'src/**/*.jsx'),
    path.join(__dirname, 'src/**/*.ts'),
    path.join(__dirname, 'src/**/*.tsx'),
    path.join(__dirname, 'src/**/*.html'),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

/* eslint global-require: "off" */

module.exports = {
  plugins: [
    require('tailwindcss')('./tailwind.config.js'),
    require('autoprefixer')
  ]
}

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx, html}",
    "./node_modules/flowbite/**/*.{js,jsx,ts,tsx, html}",
    './src/components/**/*.{js,jsx,ts,tsx, html}',
    './src/pages/**/*.{js,jsx,ts,tsx, html}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
  darkMode: 'class',
}

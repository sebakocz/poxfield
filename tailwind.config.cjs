/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      backgroundColor: {
        'blue-25': '#91a8d0',
        'blue-50': '#5c7da9',
        'blue-75': '#2b4d7e',
        'blue-100': '#2452a1',
        'orange-25': '#d6a78f',
        'orange-50': '#b5834e',
        'orange-75': '#7d542b',
        'orange-100': '#a16524',
        'lightblue-25': '#8fcbd6',
        'lightblue-50': '#4e97b5',
        'lightblue-75': '#2b657d',
        'lightblue-100': '#247ba1',
        'purple-25': '#a38fd6',
        'purple-50': '#744eb5',
        'purple-75': '#412b7d',
        'purple-100': '#4524a1',
      },
    },
  },
  plugins: [],
};

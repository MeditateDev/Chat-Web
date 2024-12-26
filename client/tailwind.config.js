/** @type {import('tailwindcss').Config} */
const withMT = require('@material-tailwind/react/utils/withMT');
const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = withMT({
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        primary: '#22c55e',
        background: '#f3f0f6',
        white: '#fff',
        ...defaultTheme.colors,
      },
    },
    screens: {
      mobile: { min: '320px', max: '640px' },
      tablet: { min: '640px', max: '1024px' },
      desktop: { min: '1024px', max: '1440px' },
      ...defaultTheme.screens,
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.hide-scrollbar': {
          'scrollbar-width': 'none' /* Firefox */,
          '-ms-overflow-style': 'none' /* IE and Edge */,
          '&::-webkit-scrollbar': {
            display: 'none' /* Chrome, Safari, and Opera */,
          },
        },
      });
    },
  ],
});

const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    fontSize: {
      xs: ['0.75rem'],
      sm: ['0.875rem'],
      base: ['1rem'],
      lg: ['1.125rem'],
      xl: ['1.25rem'],
      '2xl': ['1.5rem'],
      '3xl': ['2rem'],
      '4xl': ['2.5rem'],
      '5xl': ['3rem'],
      '6xl': ['3.75rem'],
      '7xl': ['4.5rem'],
      '8xl': ['6rem'],
      '9xl': ['8rem'],
    },
    extend: {
      borderRadius: {
        '4xl': '2rem',
      },
      maxWidth: {
        '2xl': '40rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    plugin(function({ addComponents, theme }) {
      addComponents({
        '.card-decorator': {
          'display': 'flex',
          'position': 'absolute',
        },
        '.card-decorator-top': {
          'top': '0',
          'left': '0',
          'width': '100%',
          'height': '0.5rem',
          'background-color': theme('colors.neutral.500'),
        },
        '.card-decorator-left': {
          'top': '0',
          'left': '0',
          'width': '0.375rem',
          'height': '100%',
          'background-color': theme('colors.neutral.500'),
        },
        '.card-container': {
          'position': 'relative',
          'overflow': 'hidden',
          'border-radius': theme('borderRadius.sm'),
        },
      })
    })
  ],
}

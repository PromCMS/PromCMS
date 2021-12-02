module.exports = {
  purge: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    container: {
      padding: {
        DEFAULT: '1rem',
      },
    },
    fontFamily: {
      sans: ['"Open Sans"', 'sans-serif'],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

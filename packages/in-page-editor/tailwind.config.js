/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,vue,css,scss,yaml,html}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    container: {
      padding: {
        DEFAULT: '1rem',
      },
    },
    fontFamily: {
      sans: ['"Open Sans"', 'sans-serif'],
    },
    extend: {
      borderRadius: {
        prom: '0.5rem',
      },
      colors: {
        project: {
          details: {
            900: '#6a6deb',
          },
          border: '#e5e7ebcc',
        },
      },
      animation: {
        infiniteLoader: 'infiniteLoader 1.5s ease-out infinite',
      },
      keyframes: {
        infiniteLoader: {
          '0%': {
            left: '-20%',
            width: '50%',
          },
          '50%': {},
          '100%': {
            left: '120%',
            width: '20%',
          },
          '0%, 100%': {
            transform: 'translateX(-50%)',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

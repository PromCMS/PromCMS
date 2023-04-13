/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,vue,css,scss,yaml}'],
  theme: {
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '4rem',
        lg: '4rem',
        xl: '4rem',
        '2xl': '4rem',
      },
      screens: {
        sm: '600px',
        md: '728px',
        lg: '984px',
        xl: '1024px',
        '2xl': '1290px',
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
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};

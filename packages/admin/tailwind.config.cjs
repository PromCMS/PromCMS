/** @type {import('tailwindcss').Config["safelist"]} */
const safelist = [];

const MAX_SIZE = 12;
const iterableAry = [...new Array(MAX_SIZE).fill(true)].map(
  (_, index) => index + 1
);

safelist.push({
  pattern: new RegExp(`w-(${iterableAry.join('|')})/12`, 'g'),
});

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,css,scss}'],
  safelist: safelist,
  theme: {
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '2.2rem',
        lg: '2.2rem',
        xl: '2.2rem',
        '2xl': '2.2rem',
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
  plugins: [
    {
      handler({ addBase, theme }) {
        addBase({
          '.wysiwyg-editor': {
            ul: {
              listStyle: 'disc',
              paddingLeft: '1.5rem',
              margin: '0.7rem 0',
            },
            ol: {
              listStyle: 'list',
              paddingLeft: '1.5rem',
              margin: '0.7rem 0',
            },
            a: {
              color: theme('colors.sky.400'),
            },
            blockquote: {
              fontWeight: 500,
              fontStyle: 'italic',
              color: theme('colors.gray.700'),
              borderLeftWidth: '0.25rem',
              borderLeftColor: theme('colors.gray.300'),
              marginTop: '1.6em',
              marginBottom: '1.6em',
              paddingLeft: '1em',
            },
          },
          '.tiptap': {
            'p.is-editor-empty': {
              '&:first-child::before': {
                color: '#adb5bd',
                content: 'attr(data-placeholder)',
                float: 'left',
                height: 0,
                pointerEvents: 'none',
              },
            },
          },
        });
      },
    },
  ],
};

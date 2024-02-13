/** @type {import('tailwindcss').Config["safelist"]} */
const safelist = [];

const MAX_SIZE = 12;
const iterableAry = [...new Array(MAX_SIZE).fill(true)].map(
  (_, index) => index + 1
);

safelist.push({
  pattern: new RegExp(`w-(${iterableAry.join('|')})/12`, 'g'),
});

safelist.push({
  pattern: new RegExp(`field-mapper-item-(${iterableAry.join('|')})`, 'g'),
  variants: ['sm'],
});

safelist.push({
  pattern: new RegExp(`grid-cols-(${iterableAry.join('|')})`, 'g'),
  variants: ['sm'],
});

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,css,scss,html}'],
  safelist: safelist,
  darkMode: 'class',
  theme: {
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        // lg: '2.2rem',
        // xl: '2.2rem',
        // '2xl': '1.5rem',
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
      handler({ addBase, theme, addUtilities }) {
        /**
         * @type {import('tailwindcss/types/config').CSSRuleObject}
         */
        const utilities = {};

        for (const currentWidth of iterableAry) {
          utilities[`.field-mapper-item-${currentWidth}`] = {
            width: `calc(${(100 / 12) * Number(currentWidth)}% - 1rem)`,
            marginLeft: '1rem',
          };
        }

        addUtilities(utilities);

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
            '&:focus': {
              outline: 'none',
            },
            '.ProseMirror-gapcursor:after': {
              top: '-2px',
              width: '1px',
              height: '20px!important',
              borderRight: '1px solid black',
            },
            'div[data-layout-root]': {
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              gap: theme('spacing.2'),
              margin: ` ${theme('spacing.2')} 0`,
              minHeight: '10rem',
            },
            '&:not(.ProseMirror-focused)': {
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
          },
        });
      },
    },
  ],
};

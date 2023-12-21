export default {
  trailingComma: 'es5',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  jsxSingleQuote: false,
  plugins: [
    '@prettier/plugin-php',
    '@prettier/plugin-xml',
    '@trivago/prettier-plugin-sort-imports',
  ],
  phpVersion: '8.2',
  importOrder: ['<THIRD_PARTY_MODULES>', '^@prom-cms/(.*)$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,

  overrides: [
    {
      files: ['**/*.css', '**/*.scss', '**/*.html'],
      options: {
        singleQuote: false,
      },
    },

    {
      files: ['*.json', '*.jsonc', '.babelrc', '.prettierrc'],
      options: {
        parser: 'json',
      },
    },

    {
      files: ['*.ts(x)?'],
      options: {
        parser: 'typescript',
      },
    },

    {
      files: ['*.php', '*.php.ejs'],
      options: {
        parser: 'php',
        phpVersion: '8.0',
        tabWidth: 2,
        plugins: ['@prettier/plugin-php'],
      },
    },
  ],
};

const prettierPhpPlugin = require('@prettier/plugin-php');

module.exports = {
  trailingComma: 'es5',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  jsxSingleQuote: false,
  plugins: [prettierPhpPlugin],
  phpVersion: '7.4',

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
        phpVersion: '7.4',
        tabWidth: 2,
        plugins: [prettierPhpPlugin],
      },
    },
  ],
};

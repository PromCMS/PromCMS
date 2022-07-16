const prettierPhpPlugin = require("@prettier/plugin-php");

module.exports = {
  trailingComma: "es5",
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  jsxSingleQuote: false,
  parser: "babel",

  overrides: [
    {
      files: ["**/*.css", "**/*.scss", "**/*.html"],
      options: {
        singleQuote: false,
      },
    },

    {
      files: ["*.json", "*.jsonc", ".babelrc", ".prettierrc"],
      options: {
        parser: "json",
      },
    },

    {
      files: ["*.ts"],
      options: {
        parser: "typescript",
      },
    },

    {
      files: ["*.php", "*.php.ejs"],
      options: {
        parser: "php",
        phpVersion: "7.3",
        tabWidth: 2,
        plugins: [prettierPhpPlugin],
      },
    },
  ],
};

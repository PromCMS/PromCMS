const prettierPhpPlugin = require('@prettier/plugin-php');

module.exports = {
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true,
  "jsxSingleQuote": false,

  "overrides": [
    {
      "files": ["*.js", "*.cjs", "*.mjs"],
      "options": {
        "parser": "javascript"
      }
    },

    {
      "files": "*.ts",
      "options": {
        "parser": "typescript"
      }
    },

    {
      "files": ["*.json", "*.jsonc", ".babelrc", ".prettierrc"],
      "options": {
        "parser": "json"
      }
    },

    {
      "files": ["*.php"],
      "options": {
        "parser": "php",
        "phpVersion": "7.3",
        "tabWidth": 2,
        "plugins": [prettierPhpPlugin]
      }
    }
  ]
}

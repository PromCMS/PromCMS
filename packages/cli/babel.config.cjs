module.exports = {
  presets: [
    ['@babel/env', { targets: ['last 2 versions'] }],
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      '@babel/plugin-proposal-decorators',
      {
        decoratorsBeforeExport: true,
      },
    ],
  ],
};

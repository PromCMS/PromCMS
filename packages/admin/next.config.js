require('dotenv').config(require('find-config')('.env'));

const { PORT: PORT_FRONT = 3004 } = process.env;
const isDev = process.env.NODE_ENV == 'development';

const withNextTranspileModules = require('next-transpile-modules')(
  ['@prom-cms/shared'],
  {
    resolveSymlinks: true,
    debug: false,
  }
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { esmExternals: true },
  externalDir: true,
  trailingSlash: true,
  // TODO accept a another route prefix
  basePath: isDev ? '' : '/admin',
  webpack: (config, options) => {
    config.experiments = { ...(config.experiments || {}), topLevelAwait: true };

    return config;
  },
  publicRuntimeConfig: {
    isDev,
  },
  async rewrites() {
    return [
      {
        source: '/api/:slug*',
        destination: `http://localhost:${PORT_FRONT + 1}/api/:slug*`,
      },
    ];
  },
};

const config = withNextTranspileModules(nextConfig);

module.exports = config;

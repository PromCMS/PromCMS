import defaultConfig from '@prom-cms/config/default.tsup.mjs';
import { Options } from 'tsup';

const config: Options = {
  ...defaultConfig,
  entry: ['./src/index.ts'],
  inject: ['./react-shim.js'],
};

export default config;

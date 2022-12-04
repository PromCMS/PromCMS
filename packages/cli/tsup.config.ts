import defaultConfig from '@prom-cms/config/default.tsup.mjs';
import { Options } from 'tsup';

const config: Options = {
  ...defaultConfig,
  inject: ['./react-shim.js'],
};

export default config;

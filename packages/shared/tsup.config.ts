import { configValue } from '@prom-cms/config/default.tsup.mjs';
import { defineConfig } from 'tsup';

export default defineConfig({
  ...configValue,
  entry: [...configValue.entry, './src/generator', './src/internal'],
});

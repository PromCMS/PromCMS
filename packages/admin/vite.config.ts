import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Pages from 'vite-plugin-pages';
import tsconfigPaths from 'vite-tsconfig-paths';
import { loadRootEnv } from '../shared/src';
import path from 'path';
loadRootEnv();

const { PORT = 3000 } = process.env;

console.log(path.resolve(path.join(__dirname, 'src', 'pages')));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    Pages({
      dirs: [{ dir: 'src/pages', baseRoute: '' }],
      exclude: ['src/pages/**/components/*.tsx'],
    }),
  ],
  server: {
    port: Number(PORT),
    proxy: {
      '/api': `http://localhost:${Number(PORT) + 1}`,
    },
  },
});

import { defineConfig } from 'vite';

const { PORT = 3004 } = process.env;
const isDev = process.env.NODE_ENV == 'development';
const APP_PORT = Number(PORT);

export default defineConfig({
  base: isDev ? '/' : '/admin',
  server: {
    port: Number(APP_PORT),
    proxy: {
      '^/api/.*': {
        target: `http://localhost:${APP_PORT + 1}`,
        changeOrigin: false,
      },
    },
  },
});

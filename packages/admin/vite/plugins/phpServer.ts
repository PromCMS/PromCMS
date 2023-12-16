import { Plugin as VitePlugin } from 'vite';
// @ts-ignore
import httpProxy from 'http-proxy';
// TODO: rework plugin to export this byitself or just use plugin as is
import { utils as vitePromUtils } from '@prom-cms/vite-plugin';
import { Readable } from 'node:stream';

import { runBeforeExiting } from '../utils';
import { watchFiles } from '../utils/watchFiles';

// @ts-ignore
import { existsSync } from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const isAdminRoute = (url: string) =>
  url === '/admin' || url.startsWith('/admin/');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const monorepoRoot = path.join(__dirname, '..', '..', '..', '..');
export const developmentPHPAppPath = path.join(
  monorepoRoot,
  'node_modules',
  '.prom-cms',
  'php-app'
);

export const phpServerVitePlugin = (): VitePlugin => ({
  name: 'prom-internal-dev-server',
  async configureServer(server) {
    // TODO: Check for empty?
    if (!existsSync(developmentPHPAppPath)) {
      // TODO: run this automatically?
      throw new Error(
        'PromCMS development app not created yet - run "npm run generate:dev"'
      );
    }

    const abortController = new AbortController();
    const phpServerPort = server.config.server.port! + 1;
    const serverOrigin = `http://127.0.0.1:${phpServerPort}`;
    const serverProcess = vitePromUtils.startPHPServer({
      port: phpServerPort,
      cwd: developmentPHPAppPath,
    });
    const fileWatcher = watchFiles({ abortController });
    const proxy = httpProxy.createProxyServer({ selfHandleResponse: true });
    const htmlTransform = server.transformIndexHtml;

    // And then before starting your server...
    runBeforeExiting(async (...rest) => {
      console.error(rest);
      console.log('Vite server closing, cleaning up...');

      abortController.abort();
      await fileWatcher.close();

      if (serverProcess) {
        serverProcess.kill();
      }
    });

    proxy.on('proxyRes', (proxyRes, clientReq, clientRes) => {
      var bodyChunks: any[] = [];

      proxyRes.on('data', function (chunk: any) {
        bodyChunks.push(chunk);
      });

      proxyRes.on('end', async function () {
        let body = Buffer.concat(bodyChunks);

        // Flip headers
        for (const [key, value] of Object.entries(proxyRes.headers)) {
          if (value) {
            clientRes.setHeader(key, value);
          }
        }

        // Set a status code
        clientRes.statusCode = proxyRes.statusCode ?? 500;

        const stream = Readable.from(body);
        stream.pipe(clientRes);
      });
    });

    // We catch all routes and check if they need to be proxied to PHP server first
    server.middlewares.use(async (req, res, next) => {
      if (isAdminRoute(req.url || '')) {
        next();

        return;
      }

      try {
        proxy.web(req, res, {
          target: serverOrigin,
        });

        return;
      } catch (error) {
        console.log({ 'Failed middleware': error });
      }

      next();
    });
  },
});

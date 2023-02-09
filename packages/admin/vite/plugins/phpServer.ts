import { Plugin as VitePlugin } from 'vite';
import httpProxy from 'http-proxy';
import { Readable } from 'node:stream';

import { runBeforeExiting, runPHPServer } from '../utils';

const isAdminRoute = (url: string) =>
  url === '/admin' || url.startsWith('/admin/');

export const phpServerVitePlugin = (): VitePlugin => ({
  name: 'prom-internal-dev-server',
  async configureServer(server) {
    const abortController = new AbortController();
    const phpServerPort = server.config.server.port! + 1;
    const serverOrigin = `http://localhost:${phpServerPort}`;
    const { serverProcess, fileWatcher } = await runPHPServer(phpServerPort, {
      abortController,
    });
    const proxy = httpProxy.createProxyServer({ selfHandleResponse: true });
    const htmlTransform = server.transformIndexHtml;

    // And then before starting your server...
    runBeforeExiting(async (...rest) => {
      console.log('Cleaning up...');
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

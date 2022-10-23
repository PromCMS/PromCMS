import type { Plugin } from 'vite';
import path from 'path';
import httpProxy from 'http-proxy';

import { runBeforeExiting } from './utils/runBeforeExiting';
import { startPhpServer } from './utils/startPhpServer';

export const promCmsVitePlugin = async (): Promise<Plugin> => {
  const projectRoot = process.cwd();
  const { default: fetch } = await import('node-fetch');

  return {
    name: 'prom-cms-vite-dev-tools',
    config(c, envConfig) {
      c.root ??= 'frontend-src';
      c.base ??= envConfig.mode === 'development' ? '/' : '/dist/';

      c.server ??= {};
      c.server.port ??= 3000;
      c.server.strictPort = true;

      c.build ??= {};
      c.build.outDir ??= '../public/dist';
      c.build.manifest = true;
      c.build.rollupOptions ??= {};
      c.build.rollupOptions.input ??= path.join(
        projectRoot,
        c.root,
        '/index.ts'
      );
    },
    async configureServer(server) {
      const serverPort = server.config.server.port! + 1;
      const serverOrigin = `http://localhost:${serverPort}`;
      const { serverProcess } = await startPhpServer(serverPort);
      const proxy = httpProxy.createProxyServer({ selfHandleResponse: true });

      const htmlTransform = server.transformIndexHtml;
      proxy.on('proxyRes', (proxyRes, clientReq, clientRes) => {
        var bodyChunks: any[] = [];
        proxyRes.on('data', function (chunk: any) {
          bodyChunks.push(chunk);
        });
        proxyRes.on('end', async function () {
          const originalBody = Buffer.concat(bodyChunks).toString();
          const body = await htmlTransform(clientReq.url ?? '/', originalBody);
          clientRes.end(body);
        });
      });

      // And then before starting your server...
      runBeforeExiting(async () => {
        console.log('Cleaning up...');
        if (serverProcess) {
          serverProcess.kill();
        }
      });

      server.middlewares.use(async (req, res, next) => {
        try {
          const requestUrl = new URL(req.url!, serverOrigin);
          const checkPage = await fetch(requestUrl.toString(), {
            method: req.method,
          });

          if (checkPage.status === 200) {
            proxy.web(req, res, {
              target: serverOrigin,
            });

            return;
          }
        } catch (e) {
          console.log('Failed middleware');
        }

        next();
      });
    },
  };
};

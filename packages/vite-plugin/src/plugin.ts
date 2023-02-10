import type { Plugin } from 'vite';
import path from 'path';
import httpProxy from 'http-proxy';

import { runBeforeExiting } from './utils/runBeforeExiting';
import { startPhpServer } from './utils/startPhpServer';
import fs from 'fs-extra';
import mime from 'mime';
import { Readable } from 'stream';

const log = (inp: string) => console.log(`[proms-cms-vite] ${inp}`);

export const promCmsVitePlugin = async (): Promise<Plugin> => {
  const projectRoot = process.cwd();
  const { default: fetch } = await import('node-fetch');

  return {
    name: 'prom-cms-vite-plugin',
    config(c, envConfig) {
      c.root ??= 'frontend-src';
      c.base ??= envConfig.mode === 'development' ? '/' : '/dist/';

      c.server ??= {};
      c.server.port ??= 3000;
      c.server.strictPort = true;

      c.build ??= {};
      c.build.outDir ??= '../public/dist';
      c.publicDir ??= path.join(projectRoot, 'public');
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

      // And then before starting your server...
      runBeforeExiting(async () => {
        log('Cleaning up...');
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

          // If its not an api request we use vite htmlTransform
          if (!clientReq.url?.startsWith('/api/')) {
            body = Buffer.from(
              await htmlTransform(clientReq.url ?? '/', body.toString())
            );
          }

          const stream = Readable.from(body);
          stream.pipe(clientRes);
        });
      });

      // Take care of admin on development - this is cared for in production of each app by apache
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/admin')) {
          next();
          return;
        }

        if (req.url.startsWith('/admin/assets')) {
          const fileUrl = new URL(req.url, 'http://localhost');
          const filePath = path.join('public', fileUrl.pathname);

          // End if file does not exist
          if (!(await fs.pathExists(filePath))) {
            res.writeHead(404);
            res.end();

            return;
          }

          const file = fs.createReadStream(filePath);
          const fileStats = await fs.stat(filePath);
          res.writeHead(200, {
            'Content-Type': mime.getType(filePath) ?? 'text',
            'Content-Length': fileStats.size,
          });

          return file.pipe(res);
        }

        proxy.web(req, res, {
          target: serverOrigin,
        });
      });

      // We catch all routes and check if they need to be proxied to PHP server first
      server.middlewares.use(async (req, res, next) => {
        try {
          const requestUrl = new URL(req.url!, serverOrigin);
          const checkPage = await fetch(requestUrl.toString(), {
            method: req.method,
          });

          if (checkPage.status !== 404) {
            proxy.web(req, res, {
              target: serverOrigin,
            });

            return;
          }
        } catch (e) {
          log('Failed middleware');
        }

        next();
      });
    },
  };
};

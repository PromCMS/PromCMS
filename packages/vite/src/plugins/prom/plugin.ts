import { watch } from 'chokidar';
import fs from 'fs-extra';
import httpProxy from 'http-proxy';
import mime from 'mime';
import fetch from 'node-fetch';
import path from 'path';
import { Readable } from 'stream';
import type { Logger, Plugin } from 'vite';

import { runBeforeExiting } from './runBeforeExiting.js';
import { startPHPServer } from './startPhpServer.js';

export type VitePromPluginOptions = {
  onExit?: () => void | Promise<void>;
  watchFiles?: {
    files: string[];
    onChange: (options: {
      logger?: Logger;
      type: 'add' | 'change' | 'remove';
      fileInfo: { filePath: string; stats?: fs.Stats };
    }) => void | Promise<void>;
  };
};

export const plugin = (options?: VitePromPluginOptions): Plugin => {
  const projectRoot = process.cwd();
  let logger: Logger | undefined;
  const projectPackageJsonPath = path.join(projectRoot, 'package.json');

  if (!fs.pathExistsSync(projectPackageJsonPath)) {
    throw new Error('Could not find package json in current working directory');
  }

  const projectPackageJson = fs.readJsonSync(
    path.join(projectRoot, 'package.json')
  );
  const currentPackageName = projectPackageJson.name;
  const currentPackageIsPromAdmin = currentPackageName === '@prom-cms/admin';

  return {
    name: 'prom-cms-vite-plugin',
    config(c, envConfig) {
      c.root ??= 'frontend-src';
      c.base ??= envConfig.mode === 'development' ? '/' : '/dist/';

      c.server ??= {};
      c.server.host ??= '0.0.0.0';
      c.server.port ??= 3000;
      c.server.strictPort = true;

      c.build ??= {};
      c.build.outDir ??= '../public/dist';
      // Serve static file on development but ignore in production build
      c.publicDir ??=
        envConfig.command === 'build'
          ? false
          : path.join(projectRoot, 'public');
      c.build.manifest = true;
      c.build.rollupOptions ??= {};

      if (!currentPackageIsPromAdmin) {
        c.build.rollupOptions.input ??= path.join(
          projectRoot,
          c.root,
          '/index.ts'
        );
      }
    },
    configResolved: (config) => {
      logger = config.logger;
    },
    async configureServer(server) {
      const serverPort = server.config.server.port! + 1;
      const serverOrigin = `http://127.0.0.1:${serverPort}`;
      const serverProcess = startPHPServer({ port: serverPort });
      const proxy = httpProxy.createProxyServer({ selfHandleResponse: true });
      const htmlTransform = server.transformIndexHtml;

      // And then before starting your server...
      runBeforeExiting(async (...args) => {
        // TODO: Make this message more clear on what happened
        logger?.error(args.toString(), { timestamp: true });
        // TODO: use viteConfig.logger instead
        logger?.info('Vite server closing, cleaning up...', {
          timestamp: true,
        });
        await Promise.resolve(options?.onExit?.());

        if (serverProcess) {
          serverProcess.kill();
        }
      });

      if (options?.watchFiles) {
        const instance = watch(options.watchFiles.files, {
          persistent: true,
          cwd: projectRoot,
        });

        instance.on('change', (path, stats) => {
          options.watchFiles?.onChange?.({
            logger,
            type: 'change',
            fileInfo: { filePath: path, stats },
          });
        });
        instance.on('add', (path, stats) => {
          options.watchFiles?.onChange?.({
            logger,
            type: 'add',
            fileInfo: { filePath: path, stats },
          });
        });
      }

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
            try {
              body = Buffer.from(
                await htmlTransform(clientReq.url ?? '/', body.toString())
              );
            } catch (error) {
              if (
                error instanceof Error &&
                error.message.startsWith(
                  'Unable to parse HTML; parse5 error code unexpected-question-mark-instead-of-tag-name'
                )
              ) {
                logger?.error('Some error happened on PHP server', {
                  timestamp: true,
                  error,
                });
                body = Buffer.from(body.toString());
              } else {
                logger?.error(
                  'Error happened during transform of server response',
                  { timestamp: true, error: error as any }
                );
                logger?.error(String(error), {
                  timestamp: true,
                  error: error as any,
                });
                body = Buffer.from('Some error happened');
              }
            }
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

        // Take care of admin assets only for promcms instances
        if (req.url.startsWith('/admin/assets') && !currentPackageIsPromAdmin) {
          const fileUrl = new URL(req.url, 'http://127.0.0.1');
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

      if (!currentPackageIsPromAdmin) {
        // TODO: this is kind of bad since server gets two requests instead of one
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
          } catch (error) {
            const message = (error as Error).message;
            logger?.error(`Request to PHP server failed because: ${message}`, {
              timestamp: true,
              error: error as Error,
            });
          }

          next();
        });
      }
    },
  };
};

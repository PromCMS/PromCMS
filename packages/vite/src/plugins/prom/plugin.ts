import bodyParser from 'body-parser';
import { watch } from 'chokidar';
import { ExecaChildProcess } from 'execa';
import formidable from 'formidable';
import fs from 'fs-extra';
import mime from 'mime';
import fetch, { File, FormData, RequestInit } from 'node-fetch';
import path from 'path';
import type { Logger, Plugin } from 'vite';

import { runBeforeExiting } from './runBeforeExiting.js';
import { startPHPServer } from './startPhpServer.js';

declare module 'http' {
  export interface IncomingMessage {
    body?: string | Record<any, any> | FormData;
  }
}

export type VitePromPluginOptions = {
  paths?: { project?: string; phpFiles?: string };
  onExit?: () => void | Promise<void>;
  watchFiles?: {
    files: string[];
    onChange: (options: {
      logger?: Logger;
      type: 'add' | 'change' | 'remove';
      fileInfo: { filePath: string; stats?: fs.Stats };
    }) => void | Promise<void>;
  };
  phpServer?: {
    /**
     * @default true
     */
    enabled?: boolean;
  };
};

export const plugin = (options?: VitePromPluginOptions): Plugin => {
  const projectRoot = options?.paths?.project ?? process.cwd();
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
      c.root ??= path.join('src', 'frontend');
      c.base ??= envConfig.mode === 'development' ? '/' : '/dist/';

      c.server ??= {};
      c.server.host ??= '0.0.0.0';
      c.server.port ??= 3000;
      c.server.strictPort = true;

      c.build ??= {};
      c.build.outDir ??= '../../public/dist';
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
      let serverProcess: ExecaChildProcess<string> | undefined = undefined;

      if (options?.phpServer?.enabled ?? true) {
        serverProcess = startPHPServer({
          port: serverPort,
          cwd: options?.paths?.phpFiles,
          logger,
        });
      }

      const htmlTransform = server.transformIndexHtml;

      const viteTransformHtml = async (
        incomming: string,
        incommingUrl: string
      ) => {
        let body: Buffer = Buffer.from('');
        try {
          body = Buffer.from(
            await htmlTransform(incommingUrl ?? '/', incomming)
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
            body = Buffer.from(incomming);
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

        return body;
      };

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

      server.middlewares.use(bodyParser.json());
      server.middlewares.use(bodyParser.urlencoded({ extended: true }));
      server.middlewares.use(async (request, response, next) => {
        if (
          request.method !== 'GET' &&
          request.method !== 'HEAD' &&
          request.headers['content-type']?.includes('multipart/')
        ) {
          // parse a file upload
          const form = formidable({});

          const [fields, files] = await form.parse(request);

          const formData = new FormData();
          for (const [fieldName, fieldValues] of Object.entries(fields)) {
            if (!fieldValues) {
              continue;
            }

            for (const fieldValue of fieldValues) {
              formData[fieldValues.length === 1 ? 'set' : 'append'](
                fieldName,
                fieldValue
              );
            }
          }

          for (const [fileName, uploadedFiles] of Object.entries(files)) {
            if (!uploadedFiles) {
              continue;
            }

            for (const uploadedFile of uploadedFiles) {
              const file = await fs.readFile(uploadedFile.filepath);

              formData[uploadedFiles.length === 1 ? 'set' : 'append'](
                fileName,
                new File([file], uploadedFile.originalFilename ?? '', {
                  type: uploadedFile.mimetype ?? undefined,
                })
              );
            }
          }

          request.body = formData;
        }

        if (
          request.headers['content-type'] ===
            'application/x-www-form-urlencoded' &&
          typeof request.body === 'object'
        ) {
          request.body = new URLSearchParams(
            Object.entries(request.body)
          ).toString();
        }

        next();
      });

      server.middlewares.use(async (clientRequest, res, next) => {
        // Take care of admin assets only for PromCMS instances
        if (
          clientRequest.url?.startsWith('/admin/assets') &&
          !currentPackageIsPromAdmin
        ) {
          const fileUrl = new URL(clientRequest.url, 'http://127.0.0.1');
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
        } else if (
          !(
            currentPackageIsPromAdmin && clientRequest.url?.startsWith('/admin')
          ) &&
          // This is just for development anyway
          !clientRequest.url?.startsWith('/@vite')
        ) {
          const abortController = new AbortController();
          const requestInit: RequestInit = {
            signal: abortController.signal,
            method: clientRequest.method,
            redirect: 'manual',
            headers: new Headers(
              Object.entries(clientRequest.headers)
                .map(([key, value]) => [
                  key,
                  Array.isArray(value) ? value.join(',') : value,
                ])
                .filter(([_key, value]) => value !== undefined) as [
                string,
                string,
              ][]
            ),
          };

          // Bubble up the abort of request to php server
          // Find alternative
          // clientRequest.on('close', () => {
          //   abortController.abort();
          // });

          try {
            // GET and HEAD does not have any body
            if (
              clientRequest.method !== 'GET' &&
              clientRequest.method !== 'HEAD'
            ) {
              requestInit.body =
                clientRequest.body instanceof FormData
                  ? clientRequest.body
                  : typeof clientRequest.body === 'string'
                    ? clientRequest.body
                    : JSON.stringify(clientRequest.body);

              const headers = requestInit.headers! as Headers;
              if (
                headers.get('content-type')?.includes('multipart/form-data')
              ) {
                headers.delete('content-type');
              }
            }

            const phpServerResult = await fetch(
              new URL(clientRequest.url!, serverOrigin).toString(),
              requestInit
            );
            const isHtmlResponse = (
              phpServerResult.headers.get('content-type') ?? 'text/html'
            ).includes('text/html');
            let responseBody = isHtmlResponse
              ? await viteTransformHtml(
                  await phpServerResult.text(),
                  clientRequest.url ?? '/'
                )
              : await phpServerResult
                  .blob()
                  .then((result) => result.arrayBuffer())
                  .then((arrayResult) => Buffer.from(arrayResult));

            if (phpServerResult.status !== 404) {
              res.statusCode = phpServerResult.status;
              res.statusMessage = phpServerResult.statusText;

              for (const [key, value] of phpServerResult.headers) {
                res.setHeader(key, value);
              }

              return res.end(responseBody);
            } else {
              const oldEnd = res.end;

              // Return 404 page from PHP server instead of vite 404
              res.end = function (...params) {
                if (this.statusCode === 404) {
                  res.write(responseBody);
                }

                // @ts-expect-error -- it still works, but we need to catch all parameters and pass it
                return oldEnd.apply(this, params);
              };
            }
          } catch (error) {
            // No need to log on abort
            if (!abortController.signal.aborted) {
              const message = (error as Error).message;
              logger?.error(
                `Request to PHP server failed because: ${message}`,
                {
                  timestamp: true,
                  error: error as Error,
                }
              );
            }
          }
        }

        next();
      });
    },
  };
};

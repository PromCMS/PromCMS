import { type ExecaChildProcess, execa } from 'execa';
import { Logger } from 'vite';

export interface StartPHPServerOptions {
  port: number;
  cwd?: string;
  logger?: Logger;
}

export const startPHPServer = ({
  port,
  cwd = process.cwd(),
  logger,
}: StartPHPServerOptions): ExecaChildProcess<string> => {
  let lastLineFromProcess = '';
  const serverProcess = execa(
    'php',
    ['-S', `127.0.0.1:${port}`, '-t', './public', './public/index.php'],
    { cwd }
  );

  if (serverProcess.stderr) {
    // Ensure encoding
    serverProcess.stderr.setEncoding('utf8');
    // Log what happens on server
    // TODO - enable by some toggle
    serverProcess.stderr.on('data', function (data) {
      // logger?.info(`[PHP Server] ${data}`);
      lastLineFromProcess = data;
    });
  }

  serverProcess.on('close', (code) => {
    if (code !== 0) {
      throw new Error(`PHP Server closed because: ${lastLineFromProcess}`);
    }
  });

  return serverProcess;
};

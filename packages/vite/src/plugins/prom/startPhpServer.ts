import { type ExecaChildProcess, execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';

export interface StartPHPServerOptions {
  port: number;
  cwd?: string;
}

export const startPHPServer = ({
  port,
  cwd = process.cwd(),
}: StartPHPServerOptions): ExecaChildProcess<string> => {
  const serverProcess = execa(
    'php',
    ['-S', `127.0.0.1:${port}`, '-t', './public', './public/index.php'],
    { cwd }
  );

  if (!serverProcess.stderr) {
    throw Error('Stderr not found');
  }

  // Ensure encoding
  serverProcess.stderr.setEncoding('utf8');

  serverProcess.on('close', (code) => {
    console.log({ code });
  });

  // Log what happens on server
  serverProcess.stderr.on('data', function (data) {
    const projectRoot = path.join(cwd, '.temp');

    fs.ensureDirSync(projectRoot);
    fs.appendFileSync(path.join(projectRoot, 'log.txt'), data);
  });

  return serverProcess;
};

import fs from 'fs-extra';
import type { ExecaChildProcess } from 'execa';
import path from 'path';
import { cwd } from 'process';

export const startPhpServer = async (
  port: number
): Promise<ExecaChildProcess<string>> => {
  const { execa } = await import('execa');

  const serverProcess = execa(
    'php',
    ['-S', `127.0.0.1:${port}`, '-t', './public', './public/index.php'],
    { cwd: process.cwd() }
  );

  if (!serverProcess.stderr) {
    throw Error('Stderr not found');
  }

  // Ensure encoding
  serverProcess.stderr.setEncoding('utf8');

  // Log what happens on server
  serverProcess.stderr.on('data', function (data) {
    const root = process.cwd();
    const projectRoot = path.join(root, '.temp');

    fs.ensureDir(projectRoot);
    fs.appendFileSync(path.join(projectRoot, 'log.txt'), data);
  });

  return serverProcess;
};

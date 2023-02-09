import prettier from 'prettier';
import path from 'path';
import { createRequire } from 'module';

export const formatCodeString = async (content: string, filename: string) => {
  const ignoreFileParts = ['.gitignore', '.htaccess', 'Dockerfile', '.env'];

  const ignoreFileExtensions = ['.yml', '.yaml', '.twig', '.md'];

  if (
    ignoreFileParts.find((part) => filename.includes(part)) ||
    ignoreFileExtensions.find((extension) => filename.endsWith(extension))
  ) {
    return content;
  }

  let result = content;
  const require = createRequire(import.meta.url);
  const config = require('../../.prettierrc.cjs');

  result = prettier.format(result, {
    ...config,
    filepath: filename,
  });

  return result;
};

import prettier from 'prettier';
import path from 'path';
import { PACKAGE_ROOT } from '@constants';

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
  const { default: config } = await import(
    `file:///${path.resolve(PACKAGE_ROOT, '.prettierrc.cjs')}`
  );

  result = prettier.format(result, {
    ...config,
    filepath: filename,
  });

  return result;
};

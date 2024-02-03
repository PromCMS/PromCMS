import prettier from 'prettier';

import { Logger } from './logger.js';

export const formatCodeString = async (content: string, filename: string) => {
  const ignoreFileParts = [
    '.gitignore',
    '.htaccess',
    'Dockerfile',
    '.env',
    '.DS_Store',
  ];

  const ignoreFileExtensions = ['.twig', '.md', '.sqlite'];

  if (
    ignoreFileParts.find((part) => filename.includes(part)) ||
    ignoreFileExtensions.find((extension) => filename.endsWith(extension))
  ) {
    return content;
  }

  let result = content;
  try {
    const { default: config } = await import('@prom-cms/prettier-config');

    result = await prettier.format(result, {
      ...config,
      filepath: filename,
    });
  } catch (error) {
    Logger.error(
      `Failed to format file "${filename}" (but still wrote it), because:`
    );
    console.log(error);
  }

  return result;
};

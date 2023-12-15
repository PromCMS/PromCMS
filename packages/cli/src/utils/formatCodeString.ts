import prettier from 'prettier';

export const formatCodeString = async (content: string, filename: string) => {
  const ignoreFileParts = ['.gitignore', '.htaccess', 'Dockerfile', '.env'];

  const ignoreFileExtensions = ['.twig', '.md'];

  if (
    ignoreFileParts.find((part) => filename.includes(part)) ||
    ignoreFileExtensions.find((extension) => filename.endsWith(extension))
  ) {
    return content;
  }

  let result = content;
  // TODO import from config package
  const { default: config } = await import(
    '@prom-cms/config/default.prettier.js'
  );

  result = await prettier.format(result, {
    ...config,
    filepath: filename,
  });

  return result;
};

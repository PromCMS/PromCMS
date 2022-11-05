import prettier from 'prettier';

export const formatCodeString = async (content: string, filename: string) => {
  const ignoreFileParts = [
    '.gitignore',
    '.htaccess',
    'Dockerfile',
    '.twig',
    '.env',
  ];

  if (
    ignoreFileParts.find((part) => filename.includes(part)) ||
    filename.endsWith('.md')
  ) {
    return content;
  }

  let result = content;
  const config = await prettier.resolveConfig(filename);

  if (config) {
    result = prettier.format(result, config);
  }

  return result;
};

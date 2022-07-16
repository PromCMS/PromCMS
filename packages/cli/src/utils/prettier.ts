import prettier from 'prettier';

export const formatCodeString = async (content: string, filename: string) => {
  if (
    filename === '.gitignore' ||
    filename === '.htaccess' ||
    filename === 'Dockerfile' ||
    filename.includes('.twig') ||
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

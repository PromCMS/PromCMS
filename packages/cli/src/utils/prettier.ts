import prettier from 'prettier';

export const formatCodeString = async (content: string, filename: string) => {
  let result = content;
  const config = await prettier.resolveConfig(filename);
  if (config) {
    result = prettier.format(result, config);
  }

  return result;
};

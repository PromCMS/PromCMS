import path from 'path';
import prettier from 'prettier';
import findConfig from 'find-config';

prettier.resolveConfig.sync(findConfig('.prettierrc.js') as string);

const supportedPrettierExtensions = prettier
  .getSupportInfo()
  .languages.reduce((finalValue, currentInfo) => {
    finalValue = [...finalValue, ...(currentInfo.extensions || [])];
    return finalValue;
  }, [] as string[]);

export const formatCodeString = (content: string, filename: string) => {
  let result = content;
  const fileExt = path.parse(filename).ext;
  if (supportedPrettierExtensions.includes(fileExt)) {
    result = prettier.format(result, { filepath: filename });
  }

  return result;
};

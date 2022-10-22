import { capitalizeFirstLetter, removeDiacritics } from '@prom-cms/shared';

/**
 * Takes a project name and it generates ready to use folder name
 */
export const getModuleFolderName = (projectName: string) => {
  const unserializedModuleName = capitalizeFirstLetter(
    projectName,
    false
  ).split(' ')[0];

  return removeDiacritics(unserializedModuleName);
};

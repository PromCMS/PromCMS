import upperFirst from 'lodash/upperFirst.js';

const removeDiacritics = (input: string) =>
  input.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

/**
 * Takes a project name and it generates ready to use folder name
 */
export const getModuleFolderName = (projectName: string) => {
  const unserializedModuleName = upperFirst(
    removeDiacritics(projectName).split(' ')[0]
  );

  return unserializedModuleName;
};

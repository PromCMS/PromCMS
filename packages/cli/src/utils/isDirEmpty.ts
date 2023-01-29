import fs from 'fs-extra';

export const isDirEmpty = async (dirname) => {
  if (!fs.pathExists(dirname)) {
    return true;
  }

  return fs.readdir(dirname).then((files) => {
    return files.length === 0;
  });
};

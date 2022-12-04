export const getFilenameBase = (fileName: string) =>
  fileName.split('.').slice(0, -1).join('.');

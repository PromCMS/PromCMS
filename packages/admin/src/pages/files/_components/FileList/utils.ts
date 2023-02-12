import { UploadingFiles } from './types';

export const formatDroppedFiles = (
  currentPath: string,
  files: File[]
): UploadingFiles =>
  files.map((file) => ({
    key: `${currentPath === '/' ? '' : currentPath}/${file.name}`,
    file,
    formattedSize: file.size / 1000000 + 'MB',
    name: file.name.split('.').slice(0, -1).join(),
    uploaded: false,
  }));

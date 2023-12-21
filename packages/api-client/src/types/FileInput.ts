import { FileItem } from './FileItem';

export type FileInput = Pick<FileItem, 'private' | 'description'> & {
  root: string;
};

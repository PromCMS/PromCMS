import { FileItem } from './FileItem';

export interface MutatedFile extends Omit<FileItem, 'filepath'> {
  filepath: string[];
}

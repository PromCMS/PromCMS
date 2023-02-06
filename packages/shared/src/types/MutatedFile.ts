import { File } from './File.js';

export interface MutatedFile extends Omit<File, 'filepath'> {
  filepath: string[];
}

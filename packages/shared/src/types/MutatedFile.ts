import { File } from "./File";

export interface MutatedFile extends Omit<File, 'filepath'> {
  filepath: string[];
}
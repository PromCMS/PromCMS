import { File } from '@prom-cms/shared';

export type FileInput = Pick<File, 'private' | 'description'> & {
  root: string;
};

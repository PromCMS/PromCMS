import { Entity } from './Entity';

export type FileItem = Entity & {
  filename: string;
  filepath: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  mimeType?: string;
  private?: '0' | '1';
};

import { ItemID } from './api';

export enum UserRoles {
  Editor = 'Editor',
  Admin = 'Admin',
}

export interface User {
  id: ItemID;
  name: string;
  password: string;
  email: string;
  role: UserRoles;
  /** Avatar url */
  avatar: string;
  [x: string]: any;
}

export interface File {
  id: ItemID;
  filename: string;
  filepath: string;
  created_at: string;
  updated_at: string;
  description?: string;
  private?: '0' | '1';
}

export interface MutatedFile extends Omit<File, 'filepath'> {
  filepath: string[];
}

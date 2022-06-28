import { ModelUserPermissions } from '.';
import { ItemID } from './api';

export type UserRole = {
  id: ItemID;
  slug: string;
  label: string;
  description?: string;
  permissions?: {
    hasAccessToAdmin: boolean;
    models: ModelUserPermissions;
  };
};

export enum UserStates {
  active = 'active',
  blocked = 'blocked',
  invited = 'invited',
  passwordReset = 'password-reset',
}

export interface User {
  id: ItemID;
  name: string;
  password: string;
  email: string;
  role: number | UserRole;
  /** Avatar url */
  avatar: string;
  state: UserStates;
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

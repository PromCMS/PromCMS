import { FileItem } from './FileItem.js';
import { ResultItem } from './ResultItem.js';
import { UserRole } from './UserRole.js';
import { UserStates } from './UserStates.js';

export interface User extends ResultItem {
  name: string;
  firstname: string;
  lastname: string;
  password?: string;
  email: string;
  role: string | UserRole;
  /** Avatar url */
  avatar?: FileItem | null;
  state: UserStates;
}

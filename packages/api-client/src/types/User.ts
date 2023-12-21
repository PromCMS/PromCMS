import { ItemID } from './ItemID.js';
import { UserRole } from './UserRole.js';
import { UserStates } from './UserStates.js';

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

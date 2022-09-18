import { ItemID } from './ItemID';
import { UserRole } from './UserRole';
import { UserStates } from './UserStates';

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

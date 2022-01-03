export enum UserRoles {
  Anonymous = 'Anonymous',
  Admin = 'Admin',
}

export interface User {
  id: number;
  name: string;
  password: string;
  email: string;
  role: UserRoles;
  /** Avatar url */
  avatar: string;
  [x: string]: any;
}

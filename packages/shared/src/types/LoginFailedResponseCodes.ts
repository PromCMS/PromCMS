import { UserStates } from './UserStates.js';

export type LoginFailedResponseCodes =
  | 'invalid-credentials'
  | `user-state-${UserStates}`;

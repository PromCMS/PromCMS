import { UserStates } from './UserStates';

export type LoginFailedResponseCodes =
  | 'invalid-credentials'
  | `user-state-${UserStates}`;

import { DatabaseConfigModel, DatabaseTableName } from './generateConfig';
import { UserStates } from './UserStates';

export type PrimitiveTypes = 'number' | 'string' | 'boolean' | 'date';

export type LoginFailedResponseCodes =
  | 'invalid-credentials'
  | `user-state-${UserStates}`;

export interface ApiResultModel
  extends Omit<
    DatabaseConfigModel,
    'timestamp' | 'softDelete' | 'sorting' | 'draftable' | 'sharable'
  > {
  hasTimestamps: DatabaseConfigModel['timestamp'];
  hasSoftDelete: DatabaseConfigModel['softDelete'];
  hasOrdering: DatabaseConfigModel['sorting'];
  isDraftable: DatabaseConfigModel['draftable'];
  isSharable?: DatabaseConfigModel['sharable'];
}

export type ApiResultModels = Record<DatabaseTableName, ApiResultModel>;

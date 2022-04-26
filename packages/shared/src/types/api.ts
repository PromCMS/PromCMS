import { DatabaseConfigModel, DatabaseTableName } from './generateConfig';
import { File as FileInfo, UserStates } from './users';

export type PrimitiveTypes = 'number' | 'string' | 'boolean' | 'date';

export type LoginFailedResponseCodes =
  | 'invalid-credentials'
  | `user-state-${UserStates}`;

export type ItemID = number | string;

export interface ApiResultItem {
  /**
   * Every returned model item has its own ID that is unique.
   */
  id: ItemID;
  [x: string]: any;
}

export type ApiFileInputData = Pick<FileInfo, 'private' | 'description'> & {
  root: string;
};

export interface ApiResultModel
  extends Omit<
    DatabaseConfigModel,
    'timestamp' | 'softDelete' | 'sorting' | 'draftable' | 'permissions'
  > {
  hasTimestamps: DatabaseConfigModel['timestamp'];
  hasSoftDelete: DatabaseConfigModel['softDelete'];
  hasOrdering: DatabaseConfigModel['sorting'];
  isDraftable: DatabaseConfigModel['draftable'];
  hasPermissions?: DatabaseConfigModel['permissions'];
}

export type ApiResultModels = Record<DatabaseTableName, ApiResultModel>;

export interface PagedResult<T> {
  /**
   * Resulted data for page
   */
  data: T[];
  /**
   * Current resulted page
   */
  current_page: number;
  /**
   * Last possible page
   */
  last_page: number;
  /**
   * First index in current page
   */
  from: number;
  /**
   * Number of items on page
   */
  per_page: number;
  /**
   * Last index in current page
   */
  to: number;
  /**
   * Total number of items in model
   */
  total: number;
}

import { DatabaseConfigModel } from './DatabaseConfigModel.js';

export interface ApiResultModel
  extends Omit<
    DatabaseConfigModel,
    'timestamp' | 'softDelete' | 'sorting' | 'draftable' | 'sharable'
  > {
  isSingleton: boolean;
  hasTimestamps: DatabaseConfigModel['timestamp'];
  hasSoftDelete: DatabaseConfigModel['softDelete'];
  hasOrdering: DatabaseConfigModel['sorting'];
  isDraftable: DatabaseConfigModel['draftable'];
  isSharable?: DatabaseConfigModel['sharable'];
}

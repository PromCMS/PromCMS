import { DatabaseConfigModel } from './DatabaseConfigModel';

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

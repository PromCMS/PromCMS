import { ApiResultModel } from './ApiResultModel.js';

export type ApiResultModelSingleton = Omit<ApiResultModel, 'tableName'> & {
  name: string;
};

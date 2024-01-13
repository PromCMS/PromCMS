import { Axios } from 'axios';

import { ApiResultSingletons, RichAxiosRequestConfig } from '../../types';
import { ApiClientPart } from '../ApiClientPart';
import { SingletonByTableNamePart } from './SingletonByTableNamePart';

export class SingletonsPart extends ApiClientPart {
  constructor(axios: Axios) {
    super(axios);

    this.basePathname += `/singletons`;
  }

  async getInfo(config?: RichAxiosRequestConfig<ApiResultSingletons>) {
    return this.request<ApiResultSingletons>({
      method: 'GET',
      ...config,
    });
  }

  private createdEntities = new Map<string, SingletonByTableNamePart>();
  entity(tableName: string) {
    if (!this.createdEntities.has(tableName)) {
      this.createdEntities.set(
        tableName,
        new SingletonByTableNamePart(tableName, this.axios)
      );
    }

    return this.createdEntities.get(tableName)!;
  }
}

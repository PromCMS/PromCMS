import { Axios } from 'axios';

import { ApiResultModels, RichAxiosRequestConfig } from '../../types';
import { ApiClientPart } from '../ApiClientPart';
import { EntryByTableNamePart } from './EntryByTableNamePart';

export class EntriesPart extends ApiClientPart {
  constructor(axios: Axios) {
    super(axios);

    this.basePathname += `/entry-types`;
  }

  async getInfo(config?: RichAxiosRequestConfig<ApiResultModels>) {
    return this.request<ApiResultModels>({
      method: 'GET',
      ...config,
    });
  }

  private createdEntities = new Map<string, EntryByTableNamePart>();
  entity(tableName: string) {
    if (!this.createdEntities.has(tableName)) {
      this.createdEntities.set(
        tableName,
        new EntryByTableNamePart(tableName, this.axios)
      );
    }

    return this.createdEntities.get(tableName)!;
  }
}

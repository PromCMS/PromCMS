import { ItemID } from '@prom-cms/shared';
import { PagedResponse, QueryParams, Response, ResultItem } from '../../types';
import { formatQueryParams } from '../../utils';
import { ApiClientBase } from '../ApiClientBase';

export class EntryApiClient extends ApiClientBase {
  static getBaseUrl(modelId: string) {
    return `/api/entry-types/${modelId}`;
  }

  static getItemsUrl(modelId: string) {
    return `${this.getBaseUrl(modelId)}/items`;
  }

  static getItemUrl(modelId: string, id: ItemID) {
    return `${this.getItemsUrl(modelId)}/${id}`;
  }

  async getOne<T extends ResultItem>(modelId: string, id: ItemID) {
    return this.axios.get<Response<T>>(EntryApiClient.getItemUrl(modelId, id));
  }

  async getMany<T extends ResultItem>(modelId: string, options: QueryParams) {
    return this.axios.get<PagedResponse<T>>(
      EntryApiClient.getItemsUrl(modelId),
      {
        params: formatQueryParams(options),
      }
    );
  }

  async update<T extends ResultItem>(
    modelId: string,
    id: ItemID,
    payload: Omit<ResultItem, 'id'>
  ) {
    return this.axios.patch<Response<T>>(
      EntryApiClient.getItemUrl(modelId, id),
      {
        data: payload,
      }
    );
  }

  async delete<T extends ResultItem>(modelId: string, id: ItemID) {
    return this.axios.delete<Response<T>>(
      EntryApiClient.getItemUrl(modelId, id)
    );
  }

  async create<T extends ResultItem>(
    modelId: string,
    payload: Omit<ResultItem, 'id'>
  ) {
    return this.axios.post<Response<T>>(
      `${EntryApiClient.getItemsUrl(modelId)}/create`,
      {
        data: payload,
      }
    );
  }
}

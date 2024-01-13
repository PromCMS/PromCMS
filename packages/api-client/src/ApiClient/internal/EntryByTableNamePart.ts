import { Axios } from 'axios';

import {
  ApiResultModel,
  ItemID,
  PagedResponse,
  Response,
  ResultItem,
  RichAxiosRequestConfig,
} from '../../types';
import { ApiClientPart } from '../ApiClientPart';

export class EntryByTableNamePart extends ApiClientPart {
  constructor(entityTableName: string, axios: Axios) {
    super(axios);

    this.basePathname += `/entry-types/${entityTableName}`;
  }

  async getInfo(config?: RichAxiosRequestConfig<ApiResultModel>) {
    return this.request<Response<ApiResultModel>>({
      method: 'GET',
      ...config,
    });
  }

  async getOne<T extends ResultItem>(
    id: ItemID,
    config?: RichAxiosRequestConfig<T>
  ) {
    return this.request<Response<T>>({
      ...config,
      method: 'GET',
      url: `/items/${id}`,
    });
  }

  async getMany<T extends ResultItem>(config?: RichAxiosRequestConfig<T>) {
    return this.request<PagedResponse<T>>({
      ...config,
      method: 'GET',
      url: `/items`,
    });
  }

  async update<T extends ResultItem>(
    id: ItemID,
    payload: Omit<ResultItem, 'id'>,
    config?: RichAxiosRequestConfig<T>
  ) {
    return this.request<Response<T>>({
      ...config,
      method: 'PATCH',
      url: `/items/${id}`,
      data: {
        data: payload,
      },
    });
  }

  async delete<T extends ResultItem>(
    id: ItemID,
    config?: RichAxiosRequestConfig<T>
  ) {
    return this.request<Response<T>>({
      ...config,
      method: 'DELETE',
      url: `/items/${id}`,
    });
  }

  async create<T extends ResultItem>(
    payload: Omit<ResultItem, 'id'>,
    config?: RichAxiosRequestConfig<T>
  ) {
    return this.request<Response<T>>({
      ...config,
      method: 'POST',
      url: `/items/create`,
      data: {
        data: payload,
      },
    });
  }

  async swap<T extends ResultItem>(
    payload: { fromId: ItemID; toId: ItemID },
    config?: RichAxiosRequestConfig<T>
  ) {
    return this.request<Response<T>>({
      ...config,
      method: 'PATCH',
      url: `/items/reorder`,
      data: payload,
    });
  }
}

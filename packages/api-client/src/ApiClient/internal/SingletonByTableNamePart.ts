import { Axios } from 'axios';

import {
  ApiResultModelSingleton,
  Response,
  ResultItem,
  RichAxiosRequestConfig,
} from '../../types';
import { ApiClientPart } from '../ApiClientPart';

export class SingletonByTableNamePart extends ApiClientPart {
  constructor(singletonTableName: string, axios: Axios) {
    super(axios);

    this.basePathname += `/singletons/${singletonTableName}`;
  }

  async getInfo(config?: RichAxiosRequestConfig<ApiResultModelSingleton>) {
    return this.request<Response<ApiResultModelSingleton>>({
      method: 'GET',
      url: '/info',
      ...config,
    });
  }

  async get<T extends ResultItem>(config?: RichAxiosRequestConfig<T>) {
    return this.request<Response<T>>({
      ...config,
      method: 'GET',
      url: ``,
    });
  }

  async update<T extends ResultItem>(
    payload: Omit<ResultItem, 'id'>,
    config?: RichAxiosRequestConfig<T>
  ) {
    return this.request<Response<T>>({
      ...config,
      method: 'PATCH',
      url: ``,
      data: {
        data: payload,
      },
    });
  }

  async clear<T extends ResultItem>(config?: RichAxiosRequestConfig<T>) {
    return this.request<Response<T>>({
      ...config,
      method: 'DELETE',
      url: ``,
    });
  }
}

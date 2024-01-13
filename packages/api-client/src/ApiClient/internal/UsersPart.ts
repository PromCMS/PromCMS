import { Axios, AxiosResponse } from 'axios';

import {
  ItemID,
  PagedResponse,
  Response,
  ResultItem,
  RichAxiosRequestConfig,
  User,
} from '../../types';
import { EntryByTableNamePart } from './EntryByTableNamePart';

export class UsersPart extends EntryByTableNamePart {
  constructor(axios: Axios) {
    super('prom__users', axios);
  }

  getOne<T extends ResultItem = User>(
    id: ItemID,
    config?: RichAxiosRequestConfig<T> | undefined
  ) {
    return super.getOne<T>(id, config);
  }

  getMany<T extends ResultItem = User>(
    config?: RichAxiosRequestConfig<T> | undefined
  ): Promise<AxiosResponse<PagedResponse<T>, any>> {
    return super.getMany<T>(config);
  }

  update<T extends ResultItem = User>(
    id: ItemID,
    payload: Omit<ResultItem, 'id'>,
    config?: RichAxiosRequestConfig<T> | undefined
  ) {
    return super.update<T>(id, payload, config);
  }

  delete<T extends ResultItem = User>(
    id: ItemID,
    config?: RichAxiosRequestConfig<T> | undefined
  ) {
    return super.delete<T>(id, config);
  }

  create<T extends ResultItem = User>(
    payload: Omit<ResultItem, 'id'>,
    config?: RichAxiosRequestConfig<T> | undefined
  ): Promise<AxiosResponse<Response<T, string | number>, any>> {
    return super.create<T>(payload, config);
  }

  block<T = User>(
    userId: ItemID,
    config?: RichAxiosRequestConfig<T> | undefined
  ) {
    return this.request<T>({
      ...config,
      method: 'PATCH',
      url: `/items/${userId}/block`,
    });
  }

  unblock<T = User>(
    userId: ItemID,
    config?: RichAxiosRequestConfig<T> | undefined
  ) {
    return this.request<T>({
      ...config,
      method: 'PATCH',
      url: `/items/${userId}/unblock`,
    });
  }
}

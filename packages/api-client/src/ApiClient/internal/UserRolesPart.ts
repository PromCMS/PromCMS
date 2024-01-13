import { Axios } from 'axios';

import {
  ItemID,
  Response,
  ResultItem,
  RichAxiosRequestConfig,
  User,
  UserRole,
} from '../../types';
import { ApiClientPart } from '../ApiClientPart';

export class UserRolesPart extends ApiClientPart {
  constructor(axios: Axios) {
    super(axios);

    this.basePathname += `/entry-types/prom__user_roles`;
  }

  getOne<T extends ResultItem = UserRole>(
    id: ItemID,
    config?: RichAxiosRequestConfig<T> | undefined
  ) {
    return this.request<Response<T>>({
      method: 'GET',
      url: `/items/${id}`,
      ...config,
    });
  }

  getMany<T extends ResultItem = UserRole>(
    config?: RichAxiosRequestConfig<T> | undefined
  ) {
    return this.request<T>({
      method: 'GET',
      url: `/items`,
      ...config,
    });
  }
}

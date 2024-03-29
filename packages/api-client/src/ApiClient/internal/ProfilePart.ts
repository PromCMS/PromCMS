import { Axios } from 'axios';

import { Response, RichAxiosRequestConfig, User } from '../../types';
import { ApiClientPart } from '../ApiClientPart';

export class ProfilePart extends ApiClientPart {
  constructor(axios: Axios) {
    super(axios);

    this.basePathname += `/profile`;
  }

  me<T = User>(requestOptions?: Omit<RichAxiosRequestConfig<T>, 'url'>) {
    return this.request<T>({
      url: `/me`,
      ...requestOptions,
    });
  }

  update<T = User>(payload: Partial<Omit<T, 'id'>>) {
    return this.request<T>({
      method: 'POST',
      url: '/update',
      data: {
        data: payload,
      },
    });
  }

  changePassword<
    T = Response<
      any,
      'new-password-invalid' | 'old-password-invalid' | 'missing-body-values'
    >,
  >(newPassword: string, oldPassword: string) {
    return this.request<T>({
      method: 'POST',
      data: {
        oldPassword,
        newPassword,
      },
    });
  }

  requestPasswordReset<T = User>(email: string) {
    return this.request<T>({
      method: 'GET',
      url: `/request-password-reset`,
      params: {
        email,
      },
    });
  }

  finalizePasswordReset<T = User>(payload: {
    new_password: string;
    token: string;
  }) {
    return this.request<T>({
      method: 'POST',
      url: `/finalize-password-reset`,
      data: payload,
    });
  }
}

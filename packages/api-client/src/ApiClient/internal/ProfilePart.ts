import { Axios } from 'axios';

import { Response, User } from '../../types';
import { ApiClientPart } from '../ApiClientPart';

export class ProfilePart extends ApiClientPart {
  constructor(axios: Axios) {
    super(axios);

    this.basePathname += `/profile`;
  }

  update<T = User>(payload: Partial<Omit<T, 'id'>>) {
    return this.axios.post<Response<T>>('/update', {
      data: payload,
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

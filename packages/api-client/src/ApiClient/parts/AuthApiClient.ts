import { Axios, AxiosRequestConfig } from 'axios';
import { User } from '@prom-cms/shared';

import { Response } from '../../types';
import { ApiClientBase } from '../ApiClientBase';

export class AuthApiClient extends ApiClientBase {
  login(
    props: { email: string; password: string },
    config?: AxiosRequestConfig
  ) {
    return this.axios.post<Response<User>>('/api/profile/login', props, config);
  }

  logout(
    props: { email: string; password: string },
    config?: AxiosRequestConfig
  ) {
    return this.axios.post<Response>('/api/profile/logout', props, config);
  }
}

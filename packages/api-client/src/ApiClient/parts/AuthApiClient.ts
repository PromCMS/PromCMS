import { AxiosRequestConfig } from 'axios';

import { Response, User } from '../../types';
import { ApiClientBase } from '../ApiClientBase';

export class AuthApiClient extends ApiClientBase {
  login(
    props: { email: string; password: string },
    config?: AxiosRequestConfig
  ) {
    return this.axios.post<Response<User>>('/profile/login', props, config);
  }

  logout(config?: AxiosRequestConfig) {
    return this.axios.get<Response>('/profile/logout', config);
  }
}

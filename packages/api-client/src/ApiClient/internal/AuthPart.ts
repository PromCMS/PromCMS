import { AxiosRequestConfig } from 'axios';

import { Response, User } from '../../types';
import { ApiClientPart } from '../ApiClientPart';

export class AuthPart extends ApiClientPart {
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

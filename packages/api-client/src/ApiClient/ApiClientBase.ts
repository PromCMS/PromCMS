import { Axios } from 'axios';
import { RichAxiosRequestConfig } from '../types';
import { formatQueryParams } from '../utils';

export class ApiClientBase {
  axios: Axios;

  constructor(axiosClient: Axios) {
    this.axios = axiosClient;
  }

  public formatAxiosConfig<T extends any>(
    config: RichAxiosRequestConfig<T> & {} = {}
  ) {
    return {
      ...config,
      params: formatQueryParams({
        ...config.params,
        ...(config?.language && { lang: config.language }),
      }),
    };
  }
}

import { Axios, AxiosResponse } from 'axios';

import { RichAxiosRequestConfig } from '../types';
import { formatQueryParams } from '../utils';

export abstract class ApiClientPart {
  protected basePathname: string = '/api';
  protected axios: Axios;

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

  protected request<T = any, R = AxiosResponse<T, any>, D = any>(
    config: RichAxiosRequestConfig<D>
  ): Promise<R> {
    return this.axios.request({
      ...this.formatAxiosConfig(config),
      baseURL: (config.baseURL ?? '') + this.basePathname,
    });
  }
}

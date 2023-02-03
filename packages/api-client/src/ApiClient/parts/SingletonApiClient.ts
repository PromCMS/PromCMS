import { Response, ResultItem, RichAxiosRequestConfig } from '../../types';
import { ApiClientBase } from '../ApiClientBase';

export class SingletonApiClient extends ApiClientBase {
  static getBaseUrl() {
    return `/singletons`;
  }

  static getItemUrl(singletonId: string) {
    return `${this.getBaseUrl()}/${singletonId}`;
  }

  async getOne<T extends ResultItem>(
    singletonId: string,
    config?: RichAxiosRequestConfig<T>
  ) {
    return this.axios.get<Response<T>>(
      SingletonApiClient.getItemUrl(singletonId),
      this.formatAxiosConfig<T>(config)
    );
  }

  async update<T extends ResultItem>(
    singletonId: string,
    payload: Omit<ResultItem, 'id'>,
    config?: RichAxiosRequestConfig<T>
  ) {
    return this.axios.patch<Response<T>>(
      SingletonApiClient.getItemUrl(singletonId),
      {
        data: payload,
      },
      this.formatAxiosConfig<T>(config)
    );
  }

  async clear<T extends ResultItem>(
    singletonId: string,
    config?: RichAxiosRequestConfig<T>
  ) {
    return this.axios.delete<Response<T>>(
      SingletonApiClient.getItemUrl(singletonId),
      this.formatAxiosConfig<T>(config)
    );
  }
}

import {
  ApiResultModelSingleton,
  ApiResultSingletons,
  Response,
  ResultItem,
  RichAxiosRequestConfig,
} from '../../types';
import { formatColumns } from '../../utils/formatColumns';
import { ApiClientBase } from '../ApiClientBase';

export class SingletonApiClient extends ApiClientBase {
  static getBaseUrl() {
    return `/singletons`;
  }

  static getItemUrl(singletonId: string) {
    return `${this.getBaseUrl()}/${singletonId}`;
  }

  async aboutAll(config?: RichAxiosRequestConfig<ApiResultSingletons>) {
    return this.axios
      .get<ApiResultSingletons>(
        SingletonApiClient.getBaseUrl(),
        this.formatAxiosConfig(config)
      )
      .then(({ data, ...rest }) => ({
        ...rest,
        data: formatColumns(data),
      }));
  }

  async aboutOne(
    singletonId: string,
    config?: RichAxiosRequestConfig<ApiResultModelSingleton>
  ) {
    return this.axios.get<Response<ApiResultModelSingleton>>(
      `${SingletonApiClient.getItemUrl(singletonId)}/info`,
      this.formatAxiosConfig(config)
    );
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

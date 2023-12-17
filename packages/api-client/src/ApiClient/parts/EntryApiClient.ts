import {
  ApiResultModel,
  ApiResultModels,
  ItemID,
  PagedResponse,
  Response,
  ResultItem,
  RichAxiosRequestConfig,
} from '../../types';
import { formatColumns } from '../../utils/formatColumns';
import { ApiClientBase } from '../ApiClientBase';

const routePrefix = '/entry-types';

export class EntryApiClient extends ApiClientBase {
  static getBaseUrl(modelId: string) {
    return `${routePrefix}/${modelId}`;
  }

  static getItemsUrl(modelId: string) {
    return `${this.getBaseUrl(modelId)}/items`;
  }

  static getItemUrl(modelId: string, id: ItemID) {
    return `${this.getItemsUrl(modelId)}/${id}`;
  }

  async aboutAll(config?: RichAxiosRequestConfig<ApiResultModels>) {
    return this.axios
      .get<ApiResultModels>(routePrefix, this.formatAxiosConfig(config))
      .then(({ data, ...rest }) => ({
        ...rest,
        data: formatColumns(data),
      }));
  }

  async aboutOne(
    modelId: string,
    config?: RichAxiosRequestConfig<ApiResultModel>
  ) {
    return this.axios.get<Response<ApiResultModel>>(
      EntryApiClient.getBaseUrl(modelId),
      this.formatAxiosConfig(config)
    );
  }

  async getOne<T extends ResultItem>(
    modelId: string,
    id: ItemID,
    config?: RichAxiosRequestConfig<T>
  ) {
    return this.axios.get<Response<T>>(
      EntryApiClient.getItemUrl(modelId, id),
      this.formatAxiosConfig<T>(config)
    );
  }

  async getMany<T extends ResultItem>(
    modelId: string,
    config?: RichAxiosRequestConfig<T>
  ) {
    return this.axios.get<PagedResponse<T>>(
      EntryApiClient.getItemsUrl(modelId),
      this.formatAxiosConfig<T>(config)
    );
  }

  async update<T extends ResultItem>(
    modelId: string,
    id: ItemID,
    payload: Omit<ResultItem, 'id'>,
    config?: RichAxiosRequestConfig<T>
  ) {
    return this.axios.patch<Response<T>>(
      EntryApiClient.getItemUrl(modelId, id),
      {
        data: payload,
      },
      this.formatAxiosConfig<T>(config)
    );
  }

  async delete<T extends ResultItem>(
    modelId: string,
    id: ItemID,
    config?: RichAxiosRequestConfig<T>
  ) {
    return this.axios.delete<Response<T>>(
      EntryApiClient.getItemUrl(modelId, id),
      this.formatAxiosConfig<T>(config)
    );
  }

  async create<T extends ResultItem>(
    modelId: string,
    payload: Omit<ResultItem, 'id'>,
    config?: RichAxiosRequestConfig<T>
  ) {
    return this.axios.post<Response<T>>(
      `${EntryApiClient.getItemsUrl(modelId)}/create`,
      {
        data: payload,
      },
      this.formatAxiosConfig<T>(config)
    );
  }

  async swap(modelId: string, payload: { fromId: ItemID; toId: ItemID }) {
    return this.axios.patch(`${EntryApiClient.getItemsUrl(modelId)}/reorder`, {
      data: payload,
    });
  }
}

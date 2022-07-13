import { ApiResultItem } from '@prom-cms/shared';
import { ApiClientBase } from '../ApiClientBase';

export class EntryApiClient extends ApiClientBase {
  static getBaseUrl(modelId: string) {
    return `/api/entry-types/${modelId}`;
  }

  static getItemsUrl(modelId: string) {
    return `${this.getBaseUrl(modelId)}/items`;
  }

  static getItemUrl(modelId: string, id: string) {
    return `${this.getItemsUrl(modelId)}/${id}`;
  }

  async getOne(modelId: string, id: string) {
    return this.axios.get(EntryApiClient.getItemUrl(modelId, id));
  }

  async getMany(modelId: string, options: { page: number; limit?: number }) {
    return this.axios.get(EntryApiClient.getItemsUrl(modelId), {
      params: options,
    });
  }

  async update(modelId: string, id: string, payload: ApiResultItem) {
    return this.axios.patch(EntryApiClient.getItemUrl(modelId, id), {
      data: payload,
    });
  }

  async delete(modelId: string, id: string) {
    return this.axios.delete(EntryApiClient.getItemUrl(modelId, id));
  }

  async create(modelId: string, payload: ApiResultItem) {
    return this.axios.post(`${EntryApiClient.getItemsUrl(modelId)}/create`, {
      data: payload,
    });
  }
}

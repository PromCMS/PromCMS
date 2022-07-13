import { ApiResultItem } from '@prom-cms/shared';
import { ApiClientBase } from '../ApiClientBase';
import { EntryApiClient } from './EntryApiClient';

export class UserApiClient extends ApiClientBase {
  private modelId = 'users';

  async getOne(id: string) {
    return this.axios.get(EntryApiClient.getItemUrl(this.modelId, id));
  }

  async getMany(options: { page: number; limit?: number }) {
    return this.axios.get(EntryApiClient.getItemsUrl(this.modelId), {
      params: options,
    });
  }

  async update(id: string, payload: ApiResultItem) {
    return this.axios.patch(EntryApiClient.getItemUrl(this.modelId, id), {
      data: payload,
    });
  }

  async delete(id: string) {
    return this.axios.delete(EntryApiClient.getItemUrl(this.modelId, id));
  }

  async create(payload: ApiResultItem) {
    return this.axios.post(
      `${EntryApiClient.getItemsUrl(this.modelId)}/create`,
      {
        data: payload,
      }
    );
  }

  block(userId: string) {
    return this.axios.patch(
      `${EntryApiClient.getItemUrl(this.modelId, userId)}/block`
    );
  }

  unblock(userId: string) {
    return this.axios.patch(
      `${EntryApiClient.getItemUrl(this.modelId, userId)}/unblock`
    );
  }
}

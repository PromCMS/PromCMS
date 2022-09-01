import { ItemID, User } from '@prom-cms/shared';
import { PagedResponse, QueryParams, Response } from '../../types';
import { formatQueryParams } from '../../utils';
import { ApiClientBase } from '../ApiClientBase';
import { EntryApiClient } from './EntryApiClient';

export class UserApiClient extends ApiClientBase {
  private modelId = 'users';

  async getOne(id: ItemID) {
    return this.axios.get<Response<User>>(
      EntryApiClient.getItemUrl(this.modelId, id)
    );
  }

  async getMany(options: QueryParams = {}) {
    return this.axios.get<PagedResponse<User>>(
      EntryApiClient.getItemsUrl(this.modelId),
      {
        params: formatQueryParams(options),
      }
    );
  }

  async update(id: ItemID, payload: Omit<Partial<User>, 'id'>) {
    return this.axios.patch<Response<User>>(
      EntryApiClient.getItemUrl(this.modelId, id),
      {
        data: payload,
      }
    );
  }

  async delete(id: ItemID) {
    return this.axios.delete<Response<User>>(
      EntryApiClient.getItemUrl(this.modelId, id)
    );
  }

  async create(payload: Omit<User, 'id'>) {
    return this.axios.post<Response<User>>(
      `${EntryApiClient.getItemsUrl(this.modelId)}/create`,
      {
        data: payload,
      }
    );
  }

  block(userId: ItemID) {
    return this.axios.patch<Response<User>>(
      `${EntryApiClient.getItemUrl(this.modelId, userId)}/block`
    );
  }

  unblock(userId: ItemID) {
    return this.axios.patch<Response<User>>(
      `${EntryApiClient.getItemUrl(this.modelId, userId)}/unblock`
    );
  }

  requestPasswordReset(email: string) {
    return this.axios.get<Response<User>>(`/profile/request-password-reset`, {
      params: {
        email,
      },
    });
  }

  finalizePasswordReset(payload: { new_password: string; token: string }) {
    return this.axios.post('/profile/finalize-password-reset', payload);
  }
}

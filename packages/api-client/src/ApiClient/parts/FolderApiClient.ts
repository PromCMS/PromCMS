import { Response } from '../../types';
import { ApiClientBase } from '../ApiClientBase';
import { EntryApiClient } from './EntryApiClient';

export class FolderApiClient extends ApiClientBase {
  private modelId = 'folders';

  async getMany(path: string) {
    return this.axios.get<Response<string[]>>(
      EntryApiClient.getBaseUrl(this.modelId),
      {
        params: {
          path,
        },
      }
    );
  }

  /* TODO
  async update(modelId: string, id: string, payload: ApiResultItem) {
    return this.axios.patch(EntryApiClient.getItemUrl(modelId, id), {
      data: payload,
    });
  }
  */

  async delete(path: string) {
    return this.axios.delete<Response<string>>(
      EntryApiClient.getBaseUrl(this.modelId),
      {
        params: {
          path,
        },
      }
    );
  }

  async create(path: string) {
    return this.axios.post<Response<string>>(
      EntryApiClient.getBaseUrl(this.modelId),
      {
        data: {
          path: path.replaceAll(' ', '_'),
        },
      }
    );
  }
}

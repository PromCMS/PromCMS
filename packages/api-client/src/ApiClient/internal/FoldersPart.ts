import { Response } from '../../types';
import { ApiClientPart } from '../ApiClientPart';

export class FoldersPart extends ApiClientPart {
  private baseUrl = '/api/library/folders';

  async getMany(path: string) {
    return this.axios.get<Response<string[]>>(this.baseUrl, {
      params: {
        path,
      },
    });
  }

  /* TODO
  async update(modelId: string, id: string, payload: ApiResultItem) {
    return this.axios.patch(EntryApiClient.getItemUrl(modelId, id), {
      data: payload,
    });
  }
  async move(modelId: string, id: string, payload: ApiResultItem) {
    return this.axios.patch(EntryApiClient.getItemUrl(modelId, id), {
      data: payload,
    });
  }
  */

  async delete(path: string) {
    return this.axios.delete<Response<string>>(this.baseUrl, {
      params: {
        path,
      },
    });
  }

  async create(path: string) {
    return this.axios.post<Response<string>>(this.baseUrl, {
      data: {
        path: path.replaceAll(' ', '_'),
      },
    });
  }
}

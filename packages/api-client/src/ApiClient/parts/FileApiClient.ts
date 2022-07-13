import { ApiFileInputData, ApiResultItem } from '@prom-cms/shared';
import { ApiClientBase } from '../ApiClientBase';
import { EntryApiClient } from './EntryApiClient';

export class FileApiClient extends ApiClientBase {
  getFileUrl(fileId: string, searchParams: Record<string, string> = {}) {
    const params = new URLSearchParams(searchParams).toString();
    return `${EntryApiClient.getItemUrl('files', fileId)}/raw${
      params ? `?${params}` : ''
    }`;
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

  async create(file: File, info?: ApiFileInputData) {
    const formData = new FormData();
    formData.append('file', file);

    return this.axios.post(
      `${EntryApiClient.getItemsUrl('files')}/create`,
      formData,
      {
        params: info || {},
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }
}

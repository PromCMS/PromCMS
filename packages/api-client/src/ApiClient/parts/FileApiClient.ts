import { File as FileItem, ItemID } from '@prom-cms/shared';
import { QueryParams, Response, FileInput, PagedResponse } from "../../types";
import { formatQueryParams } from "../../utils";
import { ApiClientBase } from '../ApiClientBase';
import { EntryApiClient } from './EntryApiClient';

export class FileApiClient extends ApiClientBase {
  private modelId = 'files';

  getFileUrl(fileId: string, searchParams: Record<string, string> = {}) {
    const params = new URLSearchParams(searchParams).toString();
    return `${EntryApiClient.getItemUrl(this.modelId, fileId)}/raw${params ? `?${params}` : ''
      }`;
  }

  async getOne(id: ItemID) {
    return this.axios.get<Response<FileItem>>(EntryApiClient.getItemUrl(this.modelId, id));
  }

  async getMany(options: QueryParams = {}) {
    return this.axios.get<PagedResponse<FileItem>>(EntryApiClient.getItemsUrl(this.modelId), {
      params: formatQueryParams(options),
    });
  }

  async update(id: ItemID, payload: FileInput) {
    return this.axios.patch<Response<FileItem>>(EntryApiClient.getItemUrl(this.modelId, id), {
      data: payload,
    });
  }

  async delete(id: ItemID) {
    return this.axios.delete<Response<FileItem>>(EntryApiClient.getItemUrl(this.modelId, id));
  }

  async create(file: File, info?: Omit<FileItem, "id">) {
    const formData = new FormData();
    formData.append('file', file);

    return this.axios.post<Response<FileItem>>(
      `${EntryApiClient.getItemsUrl(this.modelId)}/create`,
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

import { Axios } from 'axios';

import {
  FileInput,
  FileItem,
  ItemID,
  PagedResponse,
  QueryParams,
  Response,
} from '../../types';
import { ApiClientPart } from '../ApiClientPart';

export class FilesPart extends ApiClientPart {
  constructor(axios: Axios) {
    super(axios);

    this.basePathname += `/library/files`;
  }

  getUrl(fileId: ItemID, searchParams: Record<string, string> = {}) {
    const url = new URL(
      `${this.basePathname}/items/${fileId}`,
      this.axios.defaults.baseURL || window.location.origin
    );
    url.search = new URLSearchParams(searchParams).toString();

    return url;
  }

  /**
   * Gets files metadata from
   */
  async getOne(fileId: ItemID) {
    return this.request<Response<FileItem>>({
      method: 'GET',
      url: `/items/${fileId}`,
      headers: {
        Accept: 'application/json',
      },
    });
  }

  async getMany(options: QueryParams = {}) {
    return this.request<PagedResponse<FileItem>>({
      method: 'GET',
      url: `/items`,
      params: options,
    });
  }

  async update(fileId: ItemID, payload: FileInput) {
    return this.request<Response<FileItem>>({
      method: 'PATCH',
      url: `/items/${fileId}`,
      data: payload,
    });
  }

  async delete(fileId: ItemID) {
    return this.request<Response<FileItem>>({
      method: 'DELETE',
      url: `/items/${fileId}`,
    });
  }

  async create(
    file: File,
    info?: { root: string } & Partial<
      Omit<FileItem, 'id' | 'created_at' | 'updated_at'>
    >
  ) {
    const formData = new FormData();

    formData.append('file', file);

    return this.request<Response<FileItem>>({
      method: 'POST',
      url: `/items/create`,
      params: info || {},
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

import { Axios } from 'axios';

import { ApiResultModel, Response, RichAxiosRequestConfig } from '../../types';
import { ApiClientPart } from '../ApiClientPart';

export class GeneralTranslationsPart extends ApiClientPart {
  constructor(axios: Axios) {
    super(axios);

    this.basePathname += `/entry-types/prom__general_translations`;
  }

  async getInfo(config?: RichAxiosRequestConfig<ApiResultModel>) {
    return this.request<ApiResultModel>({
      method: 'GET',
      ...config,
    });
  }

  async getManyForLanguage(lang: string) {
    return this.request<Response<Record<string, string>>>({
      method: 'GET',
      params: {
        lang,
      },
    });
  }

  async update(key: string, value: string, language: string) {
    return this.request<Response<Record<string, string>>>({
      method: 'POST',
      url: '/update',
      data: {
        value,
        key,
        lang: language,
      },
    });
  }

  /**
   * Deletes key for ALL languages
   */
  async delete(key: string) {
    return this.request<Response<Record<string, string>>>({
      method: 'DELETE',
      url: '/delete',
      data: { data: { key } },
    });
  }

  /**
   * Creates key in default language
   */
  async create(key: string) {
    return this.request<Response<Record<string, string>>>({
      method: 'DELETE',
      url: '/create',
      data: { data: { key } },
    });
  }
}

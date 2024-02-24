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

  async upsert(key: string, value: string, language: string) {
    return this.request<Response<Record<string, string>>>({
      method: 'POST',
      url: '/items/upsert',
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
      url: '/items/delete',
      data: { data: { key } },
    });
  }
}

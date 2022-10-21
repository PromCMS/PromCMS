import { Response } from '../../types';
import { ApiClientBase } from '../ApiClientBase';
import { EntryApiClient } from './EntryApiClient';

export class GeneralTranslationsApiClient extends ApiClientBase {
  private modelId = 'generalTranslations';

  async getMany(lang: string) {
    return this.axios.get<Response<Record<string, string>>>(
      EntryApiClient.getItemsUrl(this.modelId),
      {
        params: {
          lang,
        },
      }
    );
  }

  async updateTranslation(key: string, value: string, language: string) {
    return this.axios.post<Response<Record<string, string>>>(
      `${EntryApiClient.getItemsUrl(this.modelId)}/update`,
      {
        value,
        key,
        lang: language,
      }
    );
  }

  async deleteKey(key: string) {
    return this.axios.delete<Response<Record<string, string>>>(
      `${EntryApiClient.getItemsUrl(this.modelId)}/delete`,
      { data: { key } }
    );
  }

  async createKey(key: string) {
    return this.axios.post<Response<Record<string, string>>>(
      `${EntryApiClient.getItemsUrl(this.modelId)}/create`,
      {
        data: {
          key,
        },
      }
    );
  }
}

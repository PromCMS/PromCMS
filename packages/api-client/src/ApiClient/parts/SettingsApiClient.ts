import {
  ItemID,
  PagedResponse,
  Response,
  RichAxiosRequestConfig,
  Settings,
  SettingsItem,
} from '../../types';
import { ApiClientBase } from '../ApiClientBase';
import { EntryApiClient } from './EntryApiClient';

export class SettingsApiClient extends ApiClientBase {
  private modelId = 'settings';

  async getOne(id: ItemID, config?: RichAxiosRequestConfig<SettingsItem>) {
    return this.axios.get<Response<SettingsItem>>(
      EntryApiClient.getItemUrl(this.modelId, id),
      this.formatAxiosConfig<SettingsItem>(config)
    );
  }

  async getMany(config?: RichAxiosRequestConfig<SettingsItem>) {
    return this.axios.get<PagedResponse<SettingsItem>>(
      EntryApiClient.getItemsUrl(this.modelId),
      this.formatAxiosConfig<SettingsItem>(config)
    );
  }

  async update(
    id: ItemID,
    payload: Settings,
    config?: RichAxiosRequestConfig<SettingsItem>
  ) {
    return this.axios.patch<Response<SettingsItem>>(
      EntryApiClient.getItemUrl(this.modelId, id),
      {
        data: payload,
      },
      this.formatAxiosConfig<SettingsItem>(config)
    );
  }

  async delete(id: ItemID, config?: RichAxiosRequestConfig<SettingsItem>) {
    return this.axios.delete<Response<SettingsItem>>(
      EntryApiClient.getItemUrl(this.modelId, id),
      this.formatAxiosConfig<SettingsItem>(config)
    );
  }

  async create(
    payload: Settings,
    config?: RichAxiosRequestConfig<SettingsItem>
  ) {
    return this.axios.post<Response<SettingsItem>>(
      `${EntryApiClient.getItemsUrl(this.modelId)}/create`,
      {
        data: payload,
      },
      this.formatAxiosConfig<SettingsItem>(config)
    );
  }
}

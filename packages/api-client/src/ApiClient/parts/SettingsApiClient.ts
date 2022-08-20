import { ItemID, Settings } from "@prom-cms/shared";
import { PagedResponse, QueryParams, Response, SettingsItem } from "../../types";
import { formatQueryParams } from "../../utils";
import { ApiClientBase } from '../ApiClientBase';
import { EntryApiClient } from './EntryApiClient';

export class SettingsApiClient extends ApiClientBase {
  private modelId = 'settings';

  async getOne(id: ItemID) {
    return this.axios.get<Response<SettingsItem>>(EntryApiClient.getItemUrl(this.modelId, id));
  }

  async getMany(options: QueryParams = {}) {
    return this.axios.get<PagedResponse<SettingsItem>>(EntryApiClient.getItemsUrl(this.modelId), {
      params: formatQueryParams(options),
    });
  }

  async update(id: ItemID, payload: Settings) {
    return this.axios.patch<Response<SettingsItem>>(EntryApiClient.getItemUrl(this.modelId, id), {
      data: payload,
    });
  }

  async delete(id: ItemID) {
    return this.axios.delete<Response<SettingsItem>>(EntryApiClient.getItemUrl(this.modelId, id));
  }

  async create(payload: Settings) {
    return this.axios.post<Response<SettingsItem>>(
      `${EntryApiClient.getItemsUrl(this.modelId)}/create`,
      {
        data: payload,
      }
    );
  }
}

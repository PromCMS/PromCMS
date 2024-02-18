import { Axios, AxiosResponse } from 'axios';

import {
  ItemID,
  PagedResponse,
  Response,
  ResultItem,
  RichAxiosRequestConfig,
  SettingsItem,
} from '../../types';
import { EntryByTableNamePart } from './EntryByTableNamePart';

export class SettingsPart extends EntryByTableNamePart {
  constructor(axios: Axios) {
    super('prom__settings', axios);
  }

  getOne<T extends ResultItem = SettingsItem>(
    id: ItemID,
    config?: RichAxiosRequestConfig<T> | undefined
  ) {
    return super.getOne<T>(id, config);
  }

  getMany<T extends ResultItem = SettingsItem>(
    config?: RichAxiosRequestConfig<T> | undefined
  ): Promise<AxiosResponse<PagedResponse<T>, any>> {
    return super.getMany<T>(config);
  }

  update<T extends ResultItem = SettingsItem>(
    id: ItemID,
    payload: Omit<ResultItem, 'id'>,
    config?: RichAxiosRequestConfig<T> | undefined
  ) {
    return super.update<T>(id, payload, config);
  }

  delete<T extends ResultItem = SettingsItem>(
    id: ItemID,
    config?: RichAxiosRequestConfig<T> | undefined
  ) {
    return super.delete<T>(id, config);
  }

  create<T extends ResultItem = SettingsItem>(
    payload: Omit<ResultItem, 'id'>,
    config?: RichAxiosRequestConfig<T> | undefined
  ): Promise<AxiosResponse<Response<T, string | number>, any>> {
    return super.create<T>(payload, config);
  }
}

import { Axios } from 'axios';

import { ApiResultMaintanance, RichAxiosRequestConfig } from '../../types';
import { ApiClientPart } from '../ApiClientPart';

export type SettingsMaintanancePartEnableOptions = Partial<
  Omit<ApiResultMaintanance, 'enabled'>
>;

export class SettingsMaintanancePart extends ApiClientPart {
  constructor(axios: Axios) {
    super(axios);

    this.basePathname += `/entry-types/prom__settings/maintanance`;
  }

  async get<T extends ApiResultMaintanance = ApiResultMaintanance>(
    config?: RichAxiosRequestConfig<T>
  ) {
    return await this.request<T>({
      ...config,
      url: '/',
      method: 'GET',
    }).then((value) => ({
      ...value,
      data: {
        ...value.data,
        countdown: value.data
          ? new Date((value.data.countdown as unknown as number) * 1000)
          : null,
      },
    }));
  }

  async enable<T extends ApiResultMaintanance = ApiResultMaintanance>(
    options?: SettingsMaintanancePartEnableOptions,
    config?: RichAxiosRequestConfig<T>
  ) {
    await this.request<T>({
      ...config,
      url: '/enable',
      method: 'POST',
      data: options,
    });
  }

  async disable<T extends ApiResultMaintanance = ApiResultMaintanance>(
    config?: RichAxiosRequestConfig<T>
  ) {
    await this.request<T>({
      ...config,
      url: '/disable',
      method: 'POST',
    });
  }
}

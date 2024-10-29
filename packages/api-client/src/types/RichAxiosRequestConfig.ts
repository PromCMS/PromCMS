import { AxiosRequestConfig } from 'axios';

import { QueryParams } from './QueryParams';

export interface RichAxiosRequestConfig<T extends any>
  extends AxiosRequestConfig<T> {
  language?: string;
  params?: QueryParams;
}

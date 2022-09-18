import { ResultItem } from './ResultItem';

export interface Response<T = ResultItem> {
  /**
   * Resulted data for page
   */
  data: T;
  /**
   * Response message, if any
   */
  message?: string;
  /**
   * Special response code - if any
   */
  code?: number | string;
}

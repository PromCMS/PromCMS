import { Response } from './Response';
import { ResultItem } from './ResultItem';

export interface PagedResponse<T extends ResultItem>
  extends Omit<Response<T>, 'data'> {
  /**
   * Resulted data for page
   */
  data: T[];
  /**
   * Current resulted page
   */
  current_page: number;
  /**
   * Last possible page
   */
  last_page: number;
  /**
   * Total number of items in model
   */
  total: number;
}

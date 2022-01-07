import { DatabaseConfigModel, DatabaseTableName } from '.';

export type ItemID = number | string;

export interface ApiResultItem {
  /**
   * Every returned model item has its own ID that is unique.
   */
  id: ItemID;
  [x: string]: any;
}

export interface ApiResultModel extends DatabaseConfigModel {}

export type ApiResultModels = Record<DatabaseTableName, ApiResultModel>;

export interface PagedResult<T> {
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
   * First index in current page
   */
  from: number;
  /**
   * Number of items on page
   */
  per_page: number;
  /**
   * Last index in current page
   */
  to: number;
  /**
   * Total number of items in model
   */
  total: number;
}

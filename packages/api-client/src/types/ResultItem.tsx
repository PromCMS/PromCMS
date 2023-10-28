import type { ItemID } from '@prom-cms/shared';

export interface ResultItem {
  /**
   * Every returned model item has its own ID that is unique.
   */
  id: ItemID;
  relations?: Record<string, any | any[]> | undefined;
  [x: string]: any;
}

import { ItemID } from './ItemID';

export interface ResultItem {
  /**
   * Every returned model item has its own ID that is unique.
   */
  id: ItemID;
  [x: string]: any;
}

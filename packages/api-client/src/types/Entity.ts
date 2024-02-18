import { ItemID } from './ItemID';

export interface Entity {
  /**
   * Every returned model item has its own ID that is unique.
   */
  id: ItemID;
}

import { ItemID } from '@prom-cms/shared';

export interface ImageAlbumItemAttrs {
  id: ItemID;
  metadata?: {
    title?: string;
    description?: string;
  };
}

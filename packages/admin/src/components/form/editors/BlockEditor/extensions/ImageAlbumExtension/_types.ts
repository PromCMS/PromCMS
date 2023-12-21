import { ItemID } from '@prom-cms/api-client';

export interface ImageAlbumItemAttrs {
  id: ItemID;
  metadata?: {
    title?: string;
    description?: string;
  };
}

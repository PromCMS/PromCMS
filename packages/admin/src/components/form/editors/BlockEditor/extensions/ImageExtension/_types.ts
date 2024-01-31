import { ItemID } from '@prom-cms/api-client';

export type NodeAttrs = {
  fileId?: ItemID;
  metadata?: {
    label?: string;
    description?: string;
    stretch?: boolean;
  };
};

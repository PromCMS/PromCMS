import { ItemID } from '@prom-cms/shared';

export type NodeAttrs = {
  fileId?: ItemID;
  metadata?: {
    label?: string;
    description?: string;
    stretch?: boolean;
  };
};

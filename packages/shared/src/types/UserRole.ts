import { ModelUserPermissions } from './generateConfig';
import { ItemID } from './ItemID';

export type UserRole = {
  id: ItemID;
  slug: string;
  label: string;
  description?: string;
  permissions?: {
    hasAccessToAdmin: boolean;
    models: ModelUserPermissions;
  };
};

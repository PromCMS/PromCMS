import { ItemID } from './ItemID.js';
import { ProjectSecurityRoleModelPermission } from '@prom-cms/schema';

export type UserRole = {
  id: ItemID;
  slug: string;
  label: string;
  description?: string;
  permissions?: {
    hasAccessToAdmin: boolean;
    models: ProjectSecurityRoleModelPermission;
  };
};

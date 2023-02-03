import { ItemID } from './ItemID.js';
import { ProjectSecurityRoleModelPermission } from './ProjectSecurityRoleModelPermission.js';

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

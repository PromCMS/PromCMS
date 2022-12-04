import { ItemID } from './ItemID';
import { ProjectSecurityRoleModelPermission } from './ProjectSecurityRoleModelPermission';

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

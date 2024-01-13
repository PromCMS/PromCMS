import { ProjectSecurityRole } from '@prom-cms/schema';

export type UserRole = {
  id: string;
  /**
   * @deprecated
   */
  slug: string;
  label: string;
  description?: string;
  permissions: {
    hasAccessToAdmin: boolean;
    entities: ProjectSecurityRole['modelPermissions'];
  };
};

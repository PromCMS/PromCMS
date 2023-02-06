import { z } from 'zod';
import { projectSecurityRoleModelPermissionSchema } from './projectSecurityRoleModelPermissionSchema.js';

export const projectSecurityRoleSchema = z.object({
  /**
   * Role name
   */
  name: z.string(),

  /**
   * Model permissions
   */
  modelPermissions: z.record(
    z.enum(['users', 'userRoles', 'files']).or(z.string()),
    projectSecurityRoleModelPermissionSchema
  ),

  /**
   * If user can use admin - this does not mean user cant log in
   *
   * @default true
   */
  hasAccessToAdmin: z.boolean().default(true),
});

import { z } from 'zod';
import { projectSecurityRoleModelPermissionSchema } from './projectSecurityRoleModelPermissionSchema';

export const projectSecurityRoleSchema = z.object({
  /**
   * Role name
   */
  name: z.string(),

  /**
   * Model permissions
   */
  modelPermissions: z.object({
    users: projectSecurityRoleModelPermissionSchema,
    userRoles: projectSecurityRoleModelPermissionSchema,
    files: projectSecurityRoleModelPermissionSchema,
    // TODO: this is dynamic - should autocomplete models
  }),

  /**
   * If user can use admin - this does not mean user cant log in
   *
   * @default true
   */
  hasAccessToAdmin: z.boolean().default(true).nullish(),
});

import { z } from 'zod';

import { projectSecurityRoleModelPermissionSchema } from './projectSecurityRoleModelPermissionSchema.js';

export const projectSecurityRoleSchema = z.object({
  /**
   * Role name
   */
  name: z.string(),
  /**
   * Role slug
   */
  slug: z.string(),

  /**
   * Model permissions
   */
  modelPermissions: z.record(
    z
      .enum([
        'prom__users',
        'prom__files',
        'prom__settings',
        'prom__general_translations',
      ])
      .or(z.string()),
    projectSecurityRoleModelPermissionSchema
      .or(z.enum(['allow-all', 'deny']))
      .default('deny')
  ),

  /**
   * If user can use admin - this does not mean user cant log in
   *
   * @default true
   */
  hasAccessToAdmin: z.boolean().default(true),
});

export type ProjectSecurityRole = z.infer<typeof projectSecurityRoleSchema>;

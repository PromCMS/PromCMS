import { z } from 'zod';

import { projectSecurityRoleSchema } from './projectSecurityRoleSchema.js';

export const projectSecurityConfigSchema = z.object({
  secret: z.string().optional(),

  /**
   * Project security roles
   */
  roles: z.array(projectSecurityRoleSchema).optional(),
});

import { z } from 'zod';

import { projectSecurityRoleSchema } from './projectSecurityRoleSchema.js';

export const projectSecurityConfigSchema = z
  .object({
    secret: z.string().optional(),

    /**
     * Project security roles
     */
    roles: z
      .array(projectSecurityRoleSchema)
      .describe('Project security roles')
      .optional(),
  })
  .describe('Projects security config');

export type ProjectSecurityConfig = z.infer<typeof projectSecurityConfigSchema>;

import { z } from 'zod';

import { projectSecurityRoleSchema } from './projectSecurityRoleSchema';

export const projectSecurityConfigSchema = z.object({
  secret: z.string().nullish(),

  /**
   * Project security roles
   */
  roles: z.array(projectSecurityRoleSchema).nullish(),
});

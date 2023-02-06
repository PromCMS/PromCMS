import { z } from 'zod';

import { projectSecurityConfigSchema } from './projectSecurityConfigSchema.js';

export const projectConfigSchema = z.object({
  /**
   * A project name
   */
  name: z.string(),

  /**
   * A project name
   */
  slug: z.string().optional(),

  /**
   * Final project url
   */
  url: z.string(),

  /**
   * If final project will be hosted on different folder that in the root
   */
  prefix: z.string().optional(),

  /**
   * Projects security config
   */
  security: projectSecurityConfigSchema.optional(),
});

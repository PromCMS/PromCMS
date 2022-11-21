import { z } from 'zod';

import { projectSecurityConfigSchema } from './projectSecurityConfigSchema';

export const projectConfigSchema = z.object({
  /**
   * A project name
   */
  name: z.string(),

  /**
   * Final project url
   */
  url: z.string(),

  /**
   * If final project will be hosted on different folder that in the root
   */
  prefix: z.string().nullish(),

  /**
   * Projects security config
   */
  security: projectSecurityConfigSchema.nullish(),
});

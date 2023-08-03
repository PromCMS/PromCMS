import { z } from 'zod';

import { projectSecurityConfigSchema } from './projectSecurityConfigSchema.js';

export const projectConfigSchema = z.object({
  /**
   * A project name
   */
  name: z.string().describe('A project name'),

  /**
   * A project slug
   */
  slug: z.string().describe('A project slug').optional(),

  /**
   * Final project url
   */
  url: z.string().describe('Final project url'),

  /**
   * If final project will be hosted on different folder that in the root
   */
  prefix: z
    .string()
    .describe(
      'If final project will be hosted on different folder that in the root'
    )
    .optional(),

  /**
   * Projects security config
   */
  security: projectSecurityConfigSchema.optional(),
});

export type ProjectConfig = z.infer<typeof projectConfigSchema>;

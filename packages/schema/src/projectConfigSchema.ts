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
   * Final project url, accepts pathname if app should accept requests from subpath
   */
  url: z
    .string()
    .url('Not a valid url')
    .describe(
      'Final project url, accepts pathname if app should accept requests from subpath'
    ),

  /**
   * Projects security config
   */
  security: projectSecurityConfigSchema.optional(),

  languages: z.array(z.string()).min(1).default(['en']),
});

export type ProjectConfig = z.infer<typeof projectConfigSchema>;

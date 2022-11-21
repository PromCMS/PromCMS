import { z } from 'zod';
import { projectSecurityConfigSchema } from '../schemas';

export type ProjectSecurityConfig = z.infer<typeof projectSecurityConfigSchema>;

import { z } from 'zod';
import { projectSecurityConfigSchema } from '../index.js';

export type ProjectSecurityConfig = z.infer<typeof projectSecurityConfigSchema>;

import { z } from 'zod';
import { projectSecurityRoleSchema } from '../index.js';

export type ProjectSecurityRole = z.infer<typeof projectSecurityRoleSchema>;

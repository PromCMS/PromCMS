import { z } from 'zod';
import { projectSecurityRoleSchema } from '../schemas';

export type ProjectSecurityRole = z.infer<typeof projectSecurityRoleSchema>;

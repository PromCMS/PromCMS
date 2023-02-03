import { z } from 'zod';
import { projectSecurityRoleModelPermissionSchema } from '../index.js';

export type ProjectSecurityRoleModelPermission = z.infer<
  typeof projectSecurityRoleModelPermissionSchema
>;

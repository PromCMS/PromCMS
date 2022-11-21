import { z } from 'zod';
import { projectSecurityRoleModelPermissionSchema } from '../schemas';

export type ProjectSecurityRoleModelPermission = z.infer<
  typeof projectSecurityRoleModelPermissionSchema
>;

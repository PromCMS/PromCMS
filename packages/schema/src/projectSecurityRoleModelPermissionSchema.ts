import { z } from 'zod';

export enum SecurityOptionOptions {
  ALLOW_ALL = 'allow-all',
  ALLOW_OWN = 'allow-own',
  DISABLED = 'deny',
}

const ZodSecurityOptionOptions = z.nativeEnum(SecurityOptionOptions);

export const projectSecurityRoleModelPermissionSchema = z
  .object({
    /**
     * Create
     * @default 'deny';
     */
    c: ZodSecurityOptionOptions.default(SecurityOptionOptions.DISABLED),

    /**
     * Read
     * @default 'deny';
     */
    r: ZodSecurityOptionOptions.default(SecurityOptionOptions.DISABLED),

    /**
     * Update
     * @default 'deny';
     */
    u: ZodSecurityOptionOptions.default(SecurityOptionOptions.DISABLED),

    /**
     * Delete
     * @default 'deny';
     */
    d: ZodSecurityOptionOptions.default(SecurityOptionOptions.DISABLED),
  })
  .or(z.enum(['allow-all', 'deny']));

export type ProjectSecurityRoleModelPermission = z.infer<
  typeof projectSecurityRoleModelPermissionSchema
>;

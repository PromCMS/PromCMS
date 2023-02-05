import { z } from 'zod';

export enum SecurityOptionOptions {
  ALLOW_EVERYTHING = 'allow-everything',
  ALLOW_OWN = 'allow-own',
  DISABLED = 0,
}

const ZodSecurityOptionOptions = z.nativeEnum(SecurityOptionOptions);

export const projectSecurityRoleModelPermissionSchema = z.object({
  /**
   * Create
   * @default false;
   */
  c: ZodSecurityOptionOptions.default(0),

  /**
   * Read
   * @default false;
   */
  r: ZodSecurityOptionOptions.default(0),

  /**
   * Update
   * @default false;
   */
  u: ZodSecurityOptionOptions.default(0),

  /**
   * Delete
   * @default false;
   */
  d: ZodSecurityOptionOptions.default(0),
});

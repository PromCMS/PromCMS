import { z } from 'zod';

export enum FieldPlacements {
  MAIN = 'main',
  ASIDE = 'aside',
}

export const columnTypeBaseAdminConfigSchema = z.object({
  /**
   * If column is hidden in admin ui
   */
  isHidden: z.boolean().default(false),

  /**
   * Editor config
   */
  editor: z
    .object({
      placement: z.nativeEnum(FieldPlacements).default(FieldPlacements.MAIN),
    })
    .default({}),
});

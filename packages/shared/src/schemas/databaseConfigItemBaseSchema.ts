import { z } from 'zod';
import * as iconSet from 'tabler-icons-react';

const keys = Object.keys(iconSet);

export const databaseConfigItemBaseSchema = z.object({
  /**
   * Generated icon for this model, is visible in admin
   */
  icon: z.string().refine((value) => keys.includes(value)),

  /**
   * If seeding process should be omitted for this model
   * @defaultValue false
   */
  ignoreSeeding: z.boolean().default(false).nullish(),
});

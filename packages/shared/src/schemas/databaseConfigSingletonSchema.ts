import { z } from 'zod';
import { columnTypeSchema } from './columnType/columnTypeSchema.js';
import { databaseConfigItemBaseSchema } from './databaseConfigItemBaseSchema.js';

export const databaseConfigSingletonSchema =
  databaseConfigItemBaseSchema.extend({
    /**
     * If generated singleton should have timestamps
     *
     * @defaultValue true
     */
    timestamp: z.boolean().default(true).optional(),

    /**
     * Custom singleton name to model
     * @default string Key of this object
     */
    name: z.string().min(1).optional(),

    /**
     * Toggles the multi language functionality for current model
     *
     * @default true,
     */
    intl: z.boolean().default(true).optional(),

    /**
     * Admin config
     */
    admin: z
      .object({
        /**
         * Indicates the resulted template for this singleton. "post-like" option generates default column "content" which is a block editor
         * @defaultValue post-like
         */
        layout: z.enum(['simple', 'post-like']).default('post-like').optional(),
      })
      .default({})
      .optional(),

    /**
     * Table columns
     */
    columns: z.record(columnTypeSchema),
  });

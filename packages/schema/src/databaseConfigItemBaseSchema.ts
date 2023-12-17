import { z } from 'zod';
import * as iconSet from 'tabler-icons-react';

import { columnTypeSchema } from './columnType/columnTypeSchema.js';

const keys = Object.keys(iconSet);

export const databaseConfigItemBaseSchema = z.object({
  tableName: z.string().min(1).describe('Table name for entry type'),

  title: z
    .string()
    .min(1)
    .describe('Human readable form of current model')
    .optional(),

  /**
   * Columns preset, useful when you want to build something basic:
   * - post:
   *      title<type=string, unique=true, required=true>,
   *      content<type=json, admin.fieldType=blockEditor, default={}>,
   *      slug<type=slug, of=title, editable=false>;
   */
  preset: z.enum(['post']).optional(),

  /**
   * If seeding process should be omitted for this model
   * @defaultValue false
   */
  ignoreSeeding: z.boolean().default(false),

  /**
   * If entries should have timestamps
   *
   * @defaultValue true
   */
  timestamp: z.boolean().default(true),

  /**
   * Admin config
   */
  admin: z.object({
    hidden: z.boolean().default(false),

    /**
     * Generated icon for this model, is visible in admin
     */
    icon: z.string().refine((value) => keys.includes(value)),
  }),

  /**
   * API config
   */
  api: z
    .object({
      /**
       * If current model is enabled in api requests
       */
      enabled: z
        .boolean()
        .describe('If current model is enabled in api requests')
        .default(true),
    })
    .default({}),

  /**
   * Table columns
   */
  columns: z.array(columnTypeSchema),
});

export type DatabaseConfigItemBase = z.infer<
  typeof databaseConfigItemBaseSchema
> & {
  icon: keyof typeof iconSet;
};

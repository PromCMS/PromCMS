import { z } from 'zod';
import * as iconSet from 'tabler-icons-react';

import { columnTypeSchema } from './columnType/columnTypeSchema.js';

const keys = Object.keys(iconSet);

export const databaseConfigItemBaseSchema = z.object({
  // TODO: move this into admin object in next major release
  /**
   * Generated icon for this model, is visible in admin
   */
  icon: z.string().refine((value) => keys.includes(value)),

  /**
   * If seeding process should be omitted for this model
   * @defaultValue false
   */
  ignoreSeeding: z.boolean().default(false),

  /**
   * If generated singleton should have timestamps
   *
   * @defaultValue true
   */
  timestamp: z.boolean().default(true),

  /**
   * Admin config
   */
  admin: z
    .object({
      hidden: z.boolean().default(false),
    })
    .default({}),

  /**
   * If current model is enabled in api requests
   */
  enabled: z
    .boolean()
    .describe('If current model is enabled in api requests')
    .default(true),

  /**
   * Columns preset, useful when you want to build something basic:
   * - post:
   *      title<type=string, unique=true, required=true>,
   *      content<type=json, admin.fieldType=blockEditor, default={}>,
   *      slug<type=slug, of=title, editable=false>;
   */
  preset: z.enum(['post']).optional(),

  title: z
    .string()
    .min(1)
    .describe('Human readable form of current model')
    .optional(),

  /**
   * Table columns
   */
  columns: z
    .record(columnTypeSchema)
    .transform((columns) => new Map(Object.entries(columns))),

  // TODO: rename this into "localizations" in the next major release
  /**
   * Toggles the multi language functionality for current model
   *
   * @default true,
   */
  intl: z.boolean().default(true),
});

export type DatabaseConfigItemBase = z.infer<
  typeof databaseConfigItemBaseSchema
> & {
  icon: keyof typeof iconSet;
};

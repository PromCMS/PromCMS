import { z } from 'zod';
import { columnTypeBaseAdminConfigSchema } from './columnTypeBaseAdminConfigSchema.js';
import { columnTypeBaseSchema } from './columnTypeBaseSchema.js';

export const columnTypeFileSchema = columnTypeBaseSchema.extend({
  // TODO add option to foreign - it has advantage
  // https://stackoverflow.com/questions/13541057/laravel-relationships-in-migrations
  type: z.enum(['file']),
  /**
   * If user can select multiple files
   */
  multiple: z.boolean().default(false),

  /**
   * MimeType type part filter
   */
  typeFilter: z.string().optional(),

  /**
   * Admin settings
   */
  admin: columnTypeBaseAdminConfigSchema
    .extend({ fieldType: z.enum(['normal', 'big-image']).default('normal') })
    .default({}),
});

export type ColumnTypeFile = z.infer<typeof columnTypeFileSchema>;

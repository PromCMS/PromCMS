import { z } from 'zod';

import { columnTypeBaseAdminConfigSchema } from './columnTypeBaseAdminConfigSchema.js';

export const columnTypeBaseSchema = z.object({
  /**
   * Human readable title. Defaults to the column key of this object
   */
  title: z.string(),

  /**
   * Column name in database and api responses
   */
  name: z.string(),

  /**
   * Decides if column should be required or not
   * @default true
   */
  required: z.boolean().default(true),

  /**
   * Determines if column should be unique across table, if is a string then its considered as part of a unique group
   * @default false
   */
  unique: z.boolean().or(z.string()).default(false),

  /**
   * If current field can be translated
   * @default false;
   */
  localized: z.boolean().default(false),

  database: z
    .object({
      columnName: z.string().optional(),
    })
    .optional(),

  /**
   * Admin settings
   */
  admin: columnTypeBaseAdminConfigSchema.default({}),

  description: z.string().optional(),

  /**
   * Controls the lifetime of data inside every entry.
   * If false field can be updated as per usual.
   * If true then field is omitted from updating after entry is created.
   */
  readonly: z.boolean().default(false),

  /**
   * Decides if column should be visible in api response and returned.
   * @default false
   */
  hide: z.boolean().default(false),

  /**
   * If true marks the current column as identifier and removes the default 'id'
   */
  identifier: z.boolean().default(false),
});

export type ColumnTypeBase = z.infer<typeof columnTypeBaseSchema>;

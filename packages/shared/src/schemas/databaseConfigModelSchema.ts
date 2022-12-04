import { z } from 'zod';
import { databaseConfigItemBaseSchema } from './databaseConfigItemBaseSchema';
import { columnTypeSchema } from './columnType';

export const databaseConfigModelSchema = databaseConfigItemBaseSchema.extend({
  /**
   * If generated table should have timestamps
   *
   * @defaultValue false
   */
  timestamp: z.boolean().default(false).optional(),

  /**
   * Custom table name to model
   * @default string Key of this object
   */
  tableName: z.string().min(1).optional(),

  /**
   * If generated table have entries with soft-delete
   *
   * @defaultValue false
   */
  softDelete: z.boolean().default(false).optional(),

  /**
   * Enable drafting of items
   *
   * @defaultValue false
   */
  draftable: z.boolean().default(false).optional(),

  /**
   * Enable sorting for entries by drag and drop
   *
   * @defaultValue false
   */
  sorting: z.boolean().default(false).optional(),

  /**
   * If user can share its entry and define permissions for other users to access
   * @default true
   */
  sharable: z.boolean().default(true).optional(),

  /**
   * Determines if every entry should keep info about who changed|created entry
   *
   * @default true
   */
  ownable: z.boolean().default(true).optional(),

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
       * Indicates the resulted template for this model. "post-like" option generates default column "content" which is a block editor
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

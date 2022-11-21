import { z } from 'zod';
import { databaseConfigItemBaseSchema } from './databaseConfigItemBaseSchema';
import { columnTypeSchema } from './columnType';

export const databaseConfigModelSchema = databaseConfigItemBaseSchema.extend({
  /**
   * If generated table should have timestamps
   *
   * @defaultValue false
   */
  timestamp: z.boolean().default(false).nullish(),

  /**
   * Custom table name to model
   * @default string Key of this object
   */
  tableName: z.string().min(1),

  /**
   * If generated table have entries with soft-delete
   *
   * @defaultValue false
   */
  softDelete: z.boolean().default(false).nullish(),

  /**
   * Enable drafting of items
   *
   * @defaultValue false
   */
  draftable: z.boolean().default(false).nullish(),

  /**
   * Enable sorting for entries by drag and drop
   *
   * @defaultValue false
   */
  sorting: z.boolean().default(false).nullish(),

  /**
   * If user can share its entry and define permissions for other users to access
   * @default true
   */
  sharable: z.boolean().default(true).nullish(),

  /**
   * Determines if every entry should keep info about who changed|created entry
   *
   * @default true
   */
  ownable: z.boolean().default(true).nullish(),

  /**
   * Toggles the multi language functionality for current model
   *
   * @default true,
   */
  intl: z.boolean().default(true).nullish(),

  /**
   * Admin config
   */
  admin: z
    .object({
      /**
       * Indicates the resulted template for this model. "post-like" option generates default column "content" which is a block editor
       * @defaultValue post-like
       */
      layout: z.enum(['simple', 'post-like']).default('post-like').nullish(),
    })
    .default({ layout: 'post-like' })
    .nullish(),

  /**
   * Table columns
   */
  columns: z.record(columnTypeSchema),
});

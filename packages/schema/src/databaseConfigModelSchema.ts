import * as iconSet from 'tabler-icons-react';
import { z } from 'zod';
import { databaseConfigItemBaseSchema } from './databaseConfigItemBaseSchema.js';

export const databaseConfigModelSchema = databaseConfigItemBaseSchema.extend({
  /**
   * If generated table have entries with soft-delete
   *
   * @defaultValue false
   */
  softDelete: z.boolean().default(false),

  /**
   * Enable drafting of items
   *
   * @defaultValue false
   */
  draftable: z.boolean().default(false),

  /**
   * Enable sorting for entries by drag and drop
   *
   * @defaultValue false
   */
  sorting: z.boolean().default(false),

  /**
   * If user can share its entry and define permissions for other users to access
   * @default true
   */
  sharable: z.boolean().default(true),

  /**
   * Determines if every entry should keep info about who changed|created entry
   *
   * @default true
   */
  ownable: z.boolean().default(true),
});

export type DatabaseConfigModel = z.infer<typeof databaseConfigModelSchema> & {
  icon: keyof typeof iconSet;
};

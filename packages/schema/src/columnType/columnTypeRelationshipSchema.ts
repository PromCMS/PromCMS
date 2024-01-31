import { z } from 'zod';

import { columnTypeBaseSchema } from './columnTypeBaseSchema.js';

export const columnTypeRelationshipSchema = columnTypeBaseSchema.extend({
  type: z.enum(['relationship']),

  /**
   * Specify target model
   */
  targetModelTableName: z.string(), // TODO make verify target model if model exists

  /**
   *
   */
  labelConstructor: z.string(), // TODO -- in the future we want some logic behind this to collect multiple keys and attach them in multiple string

  /**
   * If we target many entries
   *
   * @default boolean false
   */
  multiple: z.boolean().default(false),

  /**
   * Specify a field name that the target model has to hook on to
   *
   * @default string 'id'
   */
  foreignKey: z.string().default('id'), // TODO make verify
});

export type ColumnTypeRelationship = z.infer<
  typeof columnTypeRelationshipSchema
>;

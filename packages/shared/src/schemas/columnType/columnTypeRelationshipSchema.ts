import { z } from 'zod';
import { columnTypeBaseSchema } from './columnTypeBaseSchema.js';

export const columnTypeRelationshipSchema = columnTypeBaseSchema.extend({
  type: z.enum(['relationship']),

  /**
   * Specify target model
   */
  targetModel: z.string(), // TODO make verify target model if model exists

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
   * Specifies that the column will be filled with data if has connection to real target
   *
   * @default boolean true
   */
  fill: z.boolean().default(true),

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

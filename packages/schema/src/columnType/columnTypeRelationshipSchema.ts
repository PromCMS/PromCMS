import { z } from 'zod';

import { columnTypeBaseSchema } from './columnTypeBaseSchema.js';

export enum OnDeleteRelationshipMode {
  SET_NULL = 'set-null',
  CASCADE = 'cascade',
}

export enum RelationshipCascadeMode {
  PERSIST = 'persist',
  REMOVE = 'remove',
}

export const columnTypeRelationshipSchema = columnTypeBaseSchema.extend({
  type: z.enum(['relationship']),

  // TODO: Validate them during schema validation if they are correctly setuped
  mappedBy: z.string().optional(),
  inversedBy: z.string().optional(),

  // TODO: Validate if onDelete is correctly used. This should be used only if this model is the owning side
  onDelete: z.nativeEnum(OnDeleteRelationshipMode).optional(),

  // TODO: Validate if this is used correctly - should be only at the reflection side
  cascade: z.array(z.nativeEnum(RelationshipCascadeMode)).optional(),

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

import { z } from 'zod';

import { columnTypeBaseAdminConfigSchema } from './columnTypeBaseAdminConfigSchema.js';
import { columnTypeBaseSchema } from './columnTypeBaseSchema.js';
import {
  OnDeleteRelationshipMode,
  RelationshipCascadeMode,
} from './columnTypeRelationshipSchema.js';

// TODO: it would be best to inherit options from relationship column type
export const columnTypeFileSchema = columnTypeBaseSchema.extend({
  // TODO add option to foreign - it has advantage
  // https://stackoverflow.com/questions/13541057/laravel-relationships-in-migrations
  type: z.enum(['file']),
  /**
   * If user can select multiple files
   */
  multiple: z.boolean().default(false),

  // TODO: Validate if onDelete is correctly used. This should be used only if this model is the owning side
  onDelete: z.nativeEnum(OnDeleteRelationshipMode).optional(),

  // TODO: Validate if this is used correctly - should be only at the reflection side
  cascade: z.array(z.nativeEnum(RelationshipCascadeMode)).optional(),

  /**
   * MimeType type part filter
   */
  typeFilter: z.string().optional(),

  /**
   * Admin settings
   */
  admin: columnTypeBaseAdminConfigSchema
    .extend({
      fieldType: z
        .enum(['normal', 'big-image', 'small-image'])
        .default('normal'),
      showDownloadButton: z.boolean().default(false),
    })
    .default({}),
});

export type ColumnTypeFile = z.input<typeof columnTypeFileSchema>;

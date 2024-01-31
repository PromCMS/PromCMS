import { z } from 'zod';

import { columnTypeBaseAdminConfigSchema } from './columnTypeBaseAdminConfigSchema.js';
import { columnTypeBaseSchema } from './columnTypeBaseSchema.js';
import { columnTypeNumberSchema } from './columnTypeNumberSchema.js';
import { columnTypeRelationshipSchema } from './columnTypeRelationshipSchema.js';
import { columnTypeStringSchema } from './columnTypeStringSchema.js';

const basicAdminSchema = columnTypeBaseAdminConfigSchema.extend({
  fieldType: z.enum([
    'blockEditor',
    'jsonEditor',
    'openingHours',
    'color',
    'linkButton',
  ]),
});

const basicExtend = z.object({ title: z.string().optional() });
const basicOmit = {
  admin: true,
  unique: true,
  translations: true,
  title: true,
} as const;

export const repeaterAdminSchema = columnTypeBaseAdminConfigSchema.extend({
  fieldType: z.enum(['repeater']),
  columns: z.array(
    z.discriminatedUnion('type', [
      // Updated string schema
      columnTypeStringSchema.omit(basicOmit).merge(basicExtend),
      columnTypeRelationshipSchema.omit(basicOmit).merge(basicExtend),

      // Updated number schema
      columnTypeNumberSchema
        .omit({
          ...basicOmit,
          translations: true,
        })
        .merge(basicExtend),
    ])
  ),
});

export type RepeaterAdminSchema = z.infer<typeof repeaterAdminSchema>;

export const columnTypeJSONSchema = columnTypeBaseSchema.extend({
  type: z.enum(['json']),
  defaultValue: z.string().optional(),

  admin: z
    .discriminatedUnion('fieldType', [repeaterAdminSchema, basicAdminSchema])
    .default({ fieldType: 'jsonEditor' }),
});

export type ColumnTypeJSON = z.infer<typeof columnTypeJSONSchema>;

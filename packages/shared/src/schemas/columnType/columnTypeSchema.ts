import { z } from 'zod';
import { columnTypeBooleanSchema } from './columnTypeBooleanSchema.js';
import { columnTypeEnumSchema } from './columnTypeEnumSchema.js';
import { columnTypeFileSchema } from './columnTypeFileSchema.js';
import { columnTypeNormalSchema } from './columnTypeNormalSchema.js';
import { columnTypeNumberSchema } from './columnTypeNumberSchema.js';
import { columnTypeRelationshipSchema } from './columnTypeRelationshipSchema.js';
import { columnTypeSlugSchema } from './columnTypeSlugSchema.js';

export const columnTypeSchema = z.union([
  columnTypeNormalSchema,
  columnTypeEnumSchema,
  columnTypeFileSchema,
  columnTypeNumberSchema,
  columnTypeRelationshipSchema,
  columnTypeSlugSchema,
  columnTypeBooleanSchema,
]);

export type ColumnType = z.infer<typeof columnTypeSchema>;

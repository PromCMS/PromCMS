import { z } from 'zod';
import { columnTypeBooleanSchema } from './columnTypeBooleanSchema.js';
import { columnTypeEmailSchema } from './columnTypeEmailSchema.js';
import { columnTypeEnumSchema } from './columnTypeEnumSchema.js';
import { columnTypeFileSchema } from './columnTypeFileSchema.js';
import { columnTypeJSONSchema } from './columnTypeJSONSchema.js';
import { columnTypeLongTextSchema } from './columnTypeLongTextSchema.js';
import { columnTypeNormalSchema } from './columnTypeNormalSchema.js';
import { columnTypeNumberSchema } from './columnTypeNumberSchema.js';
import { columnTypeRelationshipSchema } from './columnTypeRelationshipSchema.js';
import { columnTypeSlugSchema } from './columnTypeSlugSchema.js';
import { columnTypeStringSchema } from './columnTypeStringSchema.js';
import { columnTypeUrlSchema } from './columnTypeUrlSchema.js';

export const columnTypeSchema = z.union([
  columnTypeNormalSchema,
  columnTypeJSONSchema,
  columnTypeLongTextSchema,
  columnTypeStringSchema,
  columnTypeEnumSchema,
  columnTypeFileSchema,
  columnTypeNumberSchema,
  columnTypeRelationshipSchema,
  columnTypeSlugSchema,
  columnTypeBooleanSchema,
  columnTypeUrlSchema,
  columnTypeEmailSchema,
]);

export type ColumnType = z.infer<typeof columnTypeSchema>;

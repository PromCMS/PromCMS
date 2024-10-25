import { z } from 'zod';

import { columnTypeBooleanSchema } from './columnTypeBooleanSchema.js';
import { columnTypeDateSchema } from './columnTypeDateSchema.js';
import { columnTypeEmailSchema } from './columnTypeEmailSchema.js';
import { columnTypeEnumSchema } from './columnTypeEnumSchema.js';
import { columnTypeFileSchema } from './columnTypeFileSchema.js';
import { columnTypeJSONSchema } from './columnTypeJSONSchema.js';
import { columnTypeLongTextSchema } from './columnTypeLongTextSchema.js';
import { columnTypeNumberSchema } from './columnTypeNumberSchema.js';
import { columnTypePasswordSchema } from './columnTypePasswordSchema.js';
import { columnTypeRelationshipSchema } from './columnTypeRelationshipSchema.js';
import { columnTypeSlugSchema } from './columnTypeSlugSchema.js';
import { columnTypeStringSchema } from './columnTypeStringSchema.js';
import { columnTypeUrlSchema } from './columnTypeUrlSchema.js';

export const columnTypeSchema = z.union([
  columnTypeBooleanSchema,
  columnTypeDateSchema,
  columnTypeEmailSchema,
  columnTypeEnumSchema,
  columnTypeFileSchema,
  columnTypeJSONSchema,
  columnTypeLongTextSchema,
  columnTypeNumberSchema,
  columnTypePasswordSchema,
  columnTypeRelationshipSchema,
  columnTypeSlugSchema,
  columnTypeStringSchema,
  columnTypeUrlSchema,
]);

export type ColumnType = z.infer<typeof columnTypeSchema>;

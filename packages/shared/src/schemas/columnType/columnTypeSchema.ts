import { z } from 'zod';
import { columnTypeEnumSchema } from './columnTypeEnumSchema';
import { columnTypeFileSchema } from './columnTypeFileSchema';
import { columnTypeNormalSchema } from './columnTypeNormalSchema';
import { columnTypeNumberSchema } from './columnTypeNumberSchema';
import { columnTypeRelationshipSchema } from './columnTypeRelationshipSchema';
import { columnTypeSlugSchema } from './columnTypeSlugSchema';

export const columnTypeSchema = z.union([
  columnTypeNormalSchema,
  columnTypeEnumSchema,
  columnTypeFileSchema,
  columnTypeNumberSchema,
  columnTypeRelationshipSchema,
  columnTypeSlugSchema,
]);

export type ColumnType = z.infer<typeof columnTypeSchema>;

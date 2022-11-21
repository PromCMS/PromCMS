import { z } from 'zod';
import { columnTypeBaseSchema } from './columnTypeBaseSchema';

export const columnTypeNormalSchema = columnTypeBaseSchema.extend({
  type: z.enum([
    'string',
    'boolean',
    'date',
    'password',
    'dateTime',
    'longText',
    'json',
  ]),
  default: z.string().nullish(),
});

export type ColumnTypeNormal = z.infer<typeof columnTypeNormalSchema>;

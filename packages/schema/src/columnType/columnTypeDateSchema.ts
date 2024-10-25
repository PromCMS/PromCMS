import { z } from 'zod';

import { columnTypeBaseSchema } from './columnTypeBaseSchema.js';

export enum ColumnTypeDateDefaultValueStrictOption {
  NOW = 'NOW',
}

export const columnTypeDateSchema = columnTypeBaseSchema
  .omit({ identifier: true })
  .extend({
    type: z.enum(['date', 'dateTime']),
    defaultValue: z
      .union([z.nativeEnum(ColumnTypeDateDefaultValueStrictOption), z.string()])
      .optional(),
  });

export type ColumnTypeDate = z.infer<typeof columnTypeDateSchema>;

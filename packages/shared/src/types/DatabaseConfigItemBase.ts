import * as iconSet from 'tabler-icons-react';
import { z } from 'zod';
import { databaseConfigItemBaseSchema } from '../schemas';

export type DatabaseConfigItemBase = z.infer<
  typeof databaseConfigItemBaseSchema
> & {
  icon: keyof typeof iconSet;
};

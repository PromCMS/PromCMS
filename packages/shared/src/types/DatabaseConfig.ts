import { z } from 'zod';
import { databaseConfigSchema } from '../schemas';

export type DatabaseConfig = z.infer<typeof databaseConfigSchema>;

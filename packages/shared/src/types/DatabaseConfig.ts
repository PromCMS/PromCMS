import { z } from 'zod';
import { databaseConfigSchema } from '../index.js';

export type DatabaseConfig = z.infer<typeof databaseConfigSchema>;

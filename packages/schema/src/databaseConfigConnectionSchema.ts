import { z } from 'zod';

export const databaseConfigConnectionSchema = z.object({
  name: z.string().min(1),
  adapter: z.enum(['sqlite', 'pgsql', 'mysql', 'oracle', 'mssql']),
  dsn: z.string(),
  user: z.string(),
  password: z.string().nullable(),
});

export type DatabaseConfigConnection = z.infer<
  typeof databaseConfigConnectionSchema
>;

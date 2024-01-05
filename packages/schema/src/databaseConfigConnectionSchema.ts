import { z } from 'zod';

export const databaseConfigConnectionSchema = z.object({
  name: z.string().min(1),
  uri: z.string(),
});

export type DatabaseConfigConnection = z.infer<
  typeof databaseConfigConnectionSchema
>;

import { z } from 'zod';
import { projectConfigSchema } from '../schemas';

export type ProjectConfig = z.infer<typeof projectConfigSchema>;

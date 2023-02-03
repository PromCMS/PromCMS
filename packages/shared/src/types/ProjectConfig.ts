import { z } from 'zod';
import { projectConfigSchema } from '../index.js';

export type ProjectConfig = z.infer<typeof projectConfigSchema>;

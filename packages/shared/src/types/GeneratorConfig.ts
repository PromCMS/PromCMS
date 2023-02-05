import { z } from 'zod';
import { generatorConfigSchema } from '../schemas/generatorConfigSchema.js';

export type GeneratorConfig = z.infer<typeof generatorConfigSchema>;
export type GeneratorConfigInput = z.input<typeof generatorConfigSchema>;

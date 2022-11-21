import { z } from 'zod';
import { generatorConfigSchema } from '../schemas/generatorConfigSchema';

export type GeneratorConfig = z.infer<typeof generatorConfigSchema>;

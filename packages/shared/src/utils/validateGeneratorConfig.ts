import { generatorConfigSchema } from '../schemas/generatorConfigSchema';

export const validateGeneratorConfig = generatorConfigSchema.parseAsync;
export const validateGeneratorConfigSync = generatorConfigSchema.parse;

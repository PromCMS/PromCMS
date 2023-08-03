import { generatorConfigSchema } from '../generatorConfigSchema.js';

export const validateGeneratorConfig = generatorConfigSchema.parseAsync;
export const validateGeneratorConfigSync = generatorConfigSchema.parse;

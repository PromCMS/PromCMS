import {
  ExportConfig,
  formatGeneratorConfig,
  GENERATOR_CONFIG,
} from '@prom/shared';
import { FastifyPluginAsync } from 'fastify';
import { EntryTypeRoutes } from './[entryTypeId]';

export const EntryTypesRoutes: FastifyPluginAsync = async (
  fastify,
  options
) => {
  const config = formatGeneratorConfig(GENERATOR_CONFIG as ExportConfig)
    ?.database?.models;

  fastify.get<{ Body: typeof config }>(
    '/',
    {
      schema: {},
    },
    async () => {
      return config;
    }
  );

  fastify.register(EntryTypeRoutes, { prefix: '/:entryTypeId' });
};

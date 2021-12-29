import { FastifyPluginAsync } from 'fastify';
import { EntryTypeItemsRoutes } from './items';

export const EntryTypeRoutes: FastifyPluginAsync = async (fastify, options) => {
  fastify.register(EntryTypeItemsRoutes, { prefix: '/items' });
};

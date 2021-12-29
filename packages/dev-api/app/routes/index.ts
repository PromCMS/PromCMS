import { FastifyPluginAsync } from 'fastify';
import { EntryTypesRoutes } from './entry-types';
import { UserRoutes } from './user';

const routesPlugin: FastifyPluginAsync = async (fastify, options) => {
  fastify.register(UserRoutes, { prefix: '/user' });
  fastify.register(EntryTypesRoutes, { prefix: '/entry-types' });
};

export default routesPlugin;

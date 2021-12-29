import { FastifyPluginAsync } from 'fastify';
import { CurrentUserRoutes } from './current-user';

export const UserRoutes: FastifyPluginAsync = async (fastify, options) => {
  fastify.register(CurrentUserRoutes, { prefix: '/current-user' });
};

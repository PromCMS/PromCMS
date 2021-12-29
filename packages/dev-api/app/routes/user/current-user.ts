import { FastifyPluginAsync } from 'fastify';
import { User, UserRoles } from '@prom/shared';
import { db } from '@database';

export const CurrentUserRoutes: FastifyPluginAsync = async (
  fastify,
  options
) => {
  fastify.get('/', {}, async (request, reply) => {
    // FIXME: generator may not generate a user with admin, make sure it does
    const tableContent = db.data?.users.find(
      (item) => item.role == UserRoles.Admin
    ) as User;

    return tableContent;
  });
};

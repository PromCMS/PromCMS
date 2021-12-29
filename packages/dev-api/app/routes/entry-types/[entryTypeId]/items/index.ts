import { db } from '@database';
import { FastifyPluginAsync } from 'fastify';
import { EntryTypeItemRoutes } from './[itemId]';

export const EntryTypeItemsRoutes: FastifyPluginAsync = async (
  fastify,
  options
) => {
  fastify.get<{
    Querystring: { entryTypeId: string };
  }>(
    '/',
    {
      schema: {
        querystring: {
          entryTypeId: String,
        },
        body: {},
      },
    },
    (req, res) => {
      const { entryTypeId } = req.query;

      const tableContent = (db.data || {})[entryTypeId];

      // ensure that specified entry exists - if it exists it will be an array
      if (tableContent) {
        return tableContent;
      } else {
        res.code(404);
        return;
      }
    }
  );

  fastify.register(EntryTypeItemRoutes, { prefix: '/:itemId' });
};

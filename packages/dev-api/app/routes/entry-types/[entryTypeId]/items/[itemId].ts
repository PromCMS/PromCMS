import { db } from '@database';
import { FastifyPluginAsync } from 'fastify';
import find from 'lodash.find';

export const EntryTypeItemRoutes: FastifyPluginAsync = async (
  fastify,
  options
) => {
  fastify.get<{ Querystring: { entryTypeId: string; entryId: number } }>(
    '/',
    {
      schema: {
        querystring: {
          entryTypeId: String,
          entryId: Number,
        },
      },
    },
    async (req, reply) => {
      const {
        query: { entryTypeId, entryId },
      } = req;

      try {
        const tableContent = (db.data || {})[String(entryTypeId)];
        if (!tableContent) throw 'This table does not exist';

        const entry = find(tableContent, { id: Number(entryId) });
        if (!entry) throw 'This entry does not exist;';

        return entry;
      } catch {
        reply.code(404);
        return;
      }
    }
  );
};

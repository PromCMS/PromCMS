import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

export const Route = createFileRoute('/_authorized/files/')({
  validateSearch(search) {
    return z
      .object({
        folder: z.string().default('/'),
      })
      .parse(search);
  },
});

export const FilesOverviewRoute = Route;

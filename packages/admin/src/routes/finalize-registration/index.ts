import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';

export const Route = createFileRoute('/finalize-registration/')({
  validateSearch: (search: Record<string, unknown>) => {
    return z
      .object({
        token: z.string(),
      })
      .parse(search);
  },
  beforeLoad({ context, params }) {
    if (context.auth?.user || !(params as any).token) {
      throw redirect({
        to: '/',
      });
    }
  },
});

export const FinalizeRegistrationRoute = Route;

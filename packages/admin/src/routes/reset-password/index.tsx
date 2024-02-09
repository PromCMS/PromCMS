import { createFileRoute, redirect, useSearch } from '@tanstack/react-router';
import { z } from 'zod';

import { FinalizeForm } from './-components/FinalizeForm';
import { InitializeForm } from './-components/InitializeForm';

export const Route = createFileRoute('/reset-password/')({
  validateSearch: (search: Record<string, unknown>) => {
    return z
      .object({
        token: z.string().optional(),
      })
      .parse(search);
  },
  beforeLoad({ context }) {
    if (context.auth?.user) {
      throw redirect({
        to: '/',
      });
    }
  },
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { token } = useSearch({ from: '/reset-password/' });

  return token ? <FinalizeForm token={token as string} /> : <InitializeForm />;
}

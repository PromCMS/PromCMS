import { useUser } from '@hooks/useUser';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authorized/users/$userId/')({
  async loader({ params }) {
    await useUser.prefetch(Number(params.userId));
  },
});

export const UserUnderpageRoute = Route;

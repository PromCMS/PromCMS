import { createLazyFileRoute } from '@tanstack/react-router';

import { ChangePassword } from '../../-components/ChangePassword';

export const Route = createLazyFileRoute(
  '/_authorized/settings/profile/password/change/'
)({
  component: () => {
    return <ChangePassword />;
  },
});

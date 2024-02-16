import { createLazyFileRoute } from '@tanstack/react-router';

import { Form } from './-components/Form';

export const Route = createLazyFileRoute('/finalize-registration/')({
  component: () => <Form />,
});

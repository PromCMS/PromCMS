import { createLazyFileRoute } from '@tanstack/react-router';

import { Content } from '../-components/Content';
import { ContextProvider } from '../-context';

export const Route = createLazyFileRoute('/_authorized/users/$userId/')({
  component: () => {
    return (
      <ContextProvider view="update">
        <Content />
      </ContextProvider>
    );
  },
});

import { PageLayout } from '@layouts/PageLayout';
import { createLazyFileRoute, useLoaderData } from '@tanstack/react-router';

import { Content } from '../-components/Content';
import { ContextProvider } from '../-context';

export const Route = createLazyFileRoute('/_authorized/users/$userId/')({
  component: () => {
    return (
      <PageLayout>
        <ContextProvider view="update">
          <Content />
        </ContextProvider>
      </PageLayout>
    );
  },
});

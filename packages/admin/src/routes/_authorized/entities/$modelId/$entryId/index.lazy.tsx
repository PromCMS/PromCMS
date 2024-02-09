import { createLazyFileRoute } from '@tanstack/react-router';

import { EntryPageContent } from './-components/EntryPageContent';

export const Route = createLazyFileRoute(
  '/_authorized/entities/$modelId/$entryId/'
)({
  component: () => <EntryPageContent viewType="update" />,
});

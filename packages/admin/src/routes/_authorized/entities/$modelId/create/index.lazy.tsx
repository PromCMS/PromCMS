import { createLazyFileRoute } from '@tanstack/react-router';

import { EntryPageContent } from '../$entryId/-components/EntryPageContent';

export const Route = createLazyFileRoute(
  '/_authorized/entities/$modelId/create/'
)({
  component: () => <EntryPageContent viewType="create" />,
});

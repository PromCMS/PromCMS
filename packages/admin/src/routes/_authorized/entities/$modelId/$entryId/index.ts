import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_authorized/entities/$modelId/$entryId/'
)({});

export const EntityUnderpageRoute = Route;

import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_authorized/entities/singletons/$singletonId/'
)({});

export const SingletonUnderpageRoute = Route;

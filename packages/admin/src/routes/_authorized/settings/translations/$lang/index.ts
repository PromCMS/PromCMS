import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_authorized/settings/translations/$lang/'
)({});

export const TranslationsForLanguageRoute = Route;

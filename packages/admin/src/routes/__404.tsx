import { MESSAGES } from '@constants';
import { Button } from '@mantine/core';
import { Link, createFileRoute } from '@tanstack/react-router';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

const NotFoundPage: FC<{ text?: string }> = ({ text = 'Missing' }) => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen">
      <div className="m-auto text-center">
        <h1 className="mb-5 text-6xl font-semibold">404</h1>
        <hr className="mx-auto my-4 w-1/4 border-t-8 border-blue-100" />
        <p className="text-xl text-gray-500">{text}</p>
        <Button to="/" mt="lg" component={Link}>
          {t(MESSAGES.GO_HOME)}
        </Button>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/__404')({
  component: NotFoundPage,
});

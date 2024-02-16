import { PageLayout } from '@layouts/PageLayout';
import { Button } from '@mantine/core';
import { Link } from '@tanstack/react-router';
import { FC } from 'react';
import { LockAccessOff } from 'tabler-icons-react';

export const UnauthorizedPageContent: FC = () => {
  return (
    <PageLayout>
      <div className="w-full h-full px-5 flex">
        <div className="m-auto text-center">
          <div>
            <LockAccessOff size={50} />
          </div>
          <h1 className="max-w-lg">
            You don't have required permissions to access this page
          </h1>
          <Button component={Link} to="/">
            Go home
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

import { useRouterQuery } from '@hooks/useRouterQuery';
import { FC } from 'react';
import { FinalizeForm } from './FinalizeForm';
import { InitializeForm } from './InitializeForm';

export const Form: FC = () => {
  const token = useRouterQuery('token');

  return token ? <FinalizeForm token={token as string} /> : <InitializeForm />;
};

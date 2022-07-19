import { useRouter } from 'next/router';
import { VFC } from 'react';
import { FinalizeForm } from './FinalizeForm';
import { InitializeForm } from './InitializeForm';

export const Form: VFC = () => {
  const { query } = useRouter();

  return query?.token ? (
    <FinalizeForm token={query?.token as string} />
  ) : (
    <InitializeForm />
  );
};

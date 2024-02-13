import { VFC } from 'react';

import { Breadcrumbs } from './Breadcrumbs';
import { Buttons } from './Buttons';

export const Menu: VFC = () => {
  return (
    <section className="mb-5 flex h-[55px] p-2 items-center rounded-prom shadow-md shadow-blue-100 bg-white dark:bg-transparent dark:shadow-none border-blue-200 border dark:border-none">
      <Breadcrumbs />
      <Buttons />
    </section>
  );
};

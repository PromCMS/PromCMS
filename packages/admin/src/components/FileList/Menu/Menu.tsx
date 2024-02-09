import { VFC } from 'react';

import { Breadcrumbs } from './Breadcrumbs';
import { Buttons } from './Buttons';

export const Menu: VFC = () => {
  return (
    <section className="mb-5 flex h-[55px]">
      <Breadcrumbs />
      <Buttons />
    </section>
  );
};

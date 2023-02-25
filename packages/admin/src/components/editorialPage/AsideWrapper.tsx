import clsx from 'clsx';
import { FC, PropsWithChildren } from 'react';

export const AsideWrapper: FC<PropsWithChildren<{ isOpen: boolean }>> = ({
  isOpen,
  children,
}) => (
  <aside
    className={clsx(
      'sticky top-0 z-10 transition-[width] duration-300 w-full xl:mx-9 xl:mt-0 lg:mt-5 container mx-auto',
      isOpen ? 'lg:w-[500px]' : 'lg:h-0 lg:w-0 lg:overflow-hidden'
    )}
  >
    <div
      className={clsx(
        'flex h-full lg:w-[500px] flex-col gap-5 lg:pt-5 pb-5 lg:pl-8'
      )}
    >
      {children}
    </div>
  </aside>
);

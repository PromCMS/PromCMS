import clsx from 'clsx';
import { FC, PropsWithChildren } from 'react';

export const AsideWrapper: FC<PropsWithChildren<{ isOpen: boolean }>> = ({
  isOpen,
  children,
}) => (
  <aside
    className={clsx(
      'sticky top-0 z-10 transition-[width] duration-300',
      isOpen ? 'w-[500px]' : 'h-0 w-0 overflow-hidden'
    )}
  >
    <div className={clsx('flex h-full w-[500px] flex-col gap-5 py-5 pl-8')}>
      {children}
    </div>
  </aside>
);

import clsx from 'clsx';
import { FC, PropsWithChildren, ReactNode } from 'react';

export const UnderpageLayout: FC<
  PropsWithChildren<{ asideOutlet?: ReactNode }>
> = ({ children, asideOutlet }) => {
  return (
    <>
      <div
        className={clsx(
          'bg-white shadow-md rounded-t-xl sm:rounded-none w-full h-full',
          asideOutlet ? 'sm:rounded-tr-prom' : ''
        )}
      >
        {children}
      </div>
      {asideOutlet ? (
        <aside className="flex-none ml-2 mr-2">{asideOutlet}</aside>
      ) : null}
    </>
  );
};

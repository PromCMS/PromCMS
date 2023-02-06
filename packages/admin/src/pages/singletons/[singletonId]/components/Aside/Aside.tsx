import { useAsideToggle } from '@hooks/useAsideToggle';
import clsx from 'clsx';
import { FC } from 'react';
import { Internationalization } from './Internationalization';
import { PublishInfo } from './PublishInfo';

export const Aside: FC = () => {
  const { isOpen } = useAsideToggle();

  return (
    <aside
      className={clsx(
        'sticky top-0 z-10 transition-[width] duration-300',
        'flex flex-col gap-5',
        isOpen ? 'w-[500px]' : 'h-0 w-0 overflow-hidden'
      )}
    >
      <div className={clsx('h-full w-[500px] py-5 pl-8')}>
        <PublishInfo />
        <Internationalization />
      </div>
    </aside>
  );
};

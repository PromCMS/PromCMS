import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import { FC, Fragment, PropsWithChildren } from 'react';

export const AsideWrapper: FC<PropsWithChildren<{ isOpen: boolean }>> = ({
  isOpen,
  children,
}) => (
  <Transition
    show={isOpen}
    as={Fragment}
    enter="duration-300"
    enterFrom="opacity-0 scale-75 w-0"
    enterTo="opacity-100 scale-100 w-[calc(400px+1.5rem)]"
    leave="duration-300"
    leaveFrom="opacity-100 scale-100 w-[calc(400px+1.5rem)]"
    leaveTo="opacity-0 scale-75 w-0"
  >
    <div
      className={clsx(
        'flex h-full lg:w-[300px] xl:w-[350px] flex-col gap-2 overflow-hidden flex-none'
      )}
    >
      {children}
    </div>
  </Transition>
);

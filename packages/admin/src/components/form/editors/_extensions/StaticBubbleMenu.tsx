import { Transition } from '@headlessui/react';
import { Paper } from '@mantine/core';
import { FC, Fragment, PropsWithChildren } from 'react';

export const StaticBubbleMenu: FC<PropsWithChildren<{ open: boolean }>> = ({
  open,
  children,
}) => {
  return (
    <Transition
      show={open}
      enter="transition duration-200 ease-out"
      enterFrom="transform scale-75 translate-y-7 opacity-0"
      enterTo="transform scale-100 translate-y-0 opacity-100"
      leave="transition duration-200 ease-out"
      leaveFrom="transform scale-100 translate-y-0 opacity-100"
      leaveTo="transform scale-75 translate-y-7 opacity-0"
      as={Fragment}
    >
      <div className="sticky bottom-7 left-1/2 w-0 h-0">
        <Paper
          p="0.3rem"
          withBorder
          className="flex flex-row gap-1 absolute top-0 -translate-x-1/2 -translate-y-1/2 left-1/2"
          shadow={'lg'}
        >
          {children}
        </Paper>
      </div>
    </Transition>
  );
};

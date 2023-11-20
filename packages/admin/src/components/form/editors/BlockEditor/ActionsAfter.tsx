import { Popover, Tooltip, UnstyledButton } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import clsx from 'clsx';
import { FC } from 'react';
import { Plus } from 'tabler-icons-react';

export const ActionsAfter: FC = () => {
  const [open, toggle] = useToggle();

  return null;

  return (
    <Popover opened={open} onClose={toggle} onOpen={toggle} withArrow>
      <Popover.Target>
        <Tooltip disabled={open} label="Add new block" withArrow>
          <UnstyledButton
            className={clsx(
              'relative w-full h-10 mt-10',
              open ? '' : 'opacity-0  hover:opacity-100'
            )}
            onClick={() => toggle()}
          >
            <hr className="group-hover:opacity-100 border-b-2 border-blue-500 m-auto" />
            <div className="text-blue-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-blue-100 ring-8 rounded-xl ring-gray-50">
              <Plus />
            </div>
          </UnstyledButton>
        </Tooltip>
      </Popover.Target>
      <Popover.Dropdown></Popover.Dropdown>
    </Popover>
  );
};

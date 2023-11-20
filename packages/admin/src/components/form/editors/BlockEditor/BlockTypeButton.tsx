import { ActionIcon, Tooltip } from '@mantine/core';
import clsx from 'clsx';
import { forwardRef, MouseEventHandler } from 'react';
import { Icon } from 'tabler-icons-react';

export const BlockTypeButton = forwardRef<
  HTMLButtonElement,
  {
    icon: Icon;
    label: string;
    active?: boolean;
    className?: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    canBeDisabled?: boolean;
  }
>(
  (
    {
      icon: Icon,
      onClick,
      active,
      className,
      label,
      disabled,
      canBeDisabled = true,
    },
    ref
  ) => (
    <Tooltip disabled={disabled} label={label} withArrow transition="scale">
      <ActionIcon
        ref={ref}
        variant="filled"
        color="blue"
        disabled={disabled}
        size="xl"
        className={clsx(
          active
            ? 'bg-sky-100 text-sky-600'
            : 'bg-white hover:bg-gray-50 text-gray-700',

          active
            ? canBeDisabled
              ? 'hover:bg-red-200 hover:text-red-600'
              : 'hover:bg-sky-100 hover:text-sky-600'
            : '',
          disabled ? 'cursor-not-allowed' : '',
          className
        )}
        onClick={onClick}
      >
        <Icon className="w-3/4 h-3/4" />
      </ActionIcon>
    </Tooltip>
  )
);

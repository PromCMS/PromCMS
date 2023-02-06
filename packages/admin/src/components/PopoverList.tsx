import { UnstyledButton } from '@mantine/core';
import * as iconSet from 'tabler-icons-react';
import clsx from 'clsx';
import { MouseEventHandler } from 'react';
import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';

export interface PopoverListProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLUListElement>,
    HTMLUListElement
  > {}

export interface PopoverListItemProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement>,
    'onClick'
  > {
  icon?: keyof typeof iconSet;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const PopoverListItem: FC<PopoverListItemProps> = ({
  className,
  icon,
  children,
  onClick,
  ...rest
}) => {
  const Icon = icon ? iconSet[icon] : null;

  return (
    <li {...rest}>
      <UnstyledButton
        className={clsx(
          'flex w-full items-center rounded-lg px-4 py-1.5 text-lg font-semibold',
          className?.includes('red') ? 'hover:bg-red-50' : 'hover:bg-blue-50',
          className
        )}
        onClick={onClick}
      >
        {Icon && <Icon className="mr-2.5 inline-block w-5" />}
        {children}
      </UnstyledButton>
    </li>
  );
};

const PopoverList: FC<PopoverListProps> & { Item: typeof PopoverListItem } = ({
  children,
  className,
  ...rest
}) => (
  <ul
    className={clsx('-mx-2.5 list-none text-lg font-semibold', className)}
    {...rest}
  >
    {children}
  </ul>
);

PopoverList.Item = PopoverListItem;

export default PopoverList;

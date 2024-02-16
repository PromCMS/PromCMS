import { UnstyledButton } from '@mantine/core';
import clsx from 'clsx';
import { MouseEventHandler } from 'react';
import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import * as iconSet from 'tabler-icons-react';

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
          'flex w-full items-center rounded-prom px-4 py-1.5 text-lg font-semibold',
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

const PopoverList: FC<PopoverListProps> & {
  Item: typeof PopoverListItem;
  Divider: typeof PopoverListDivider;
} = ({ children, className, ...rest }) => (
  <ul
    className={clsx('-mx-2.5 list-none text-lg font-semibold', className)}
    {...rest}
  >
    {children}
  </ul>
);

const PopoverListDivider: FC = () => {
  return (
    <li>
      <hr className="h-0.5 bg-gray-100 my-2 w-full" />
    </li>
  );
};

PopoverList.Item = PopoverListItem;
PopoverList.Divider = PopoverListDivider;

export default PopoverList;

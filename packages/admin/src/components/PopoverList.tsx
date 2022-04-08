import { iconSet } from '@prom-cms/icons'
import clsx from 'clsx'
import { DetailedHTMLProps, FC, HTMLAttributes } from 'react'

export interface PopoverListProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLUListElement>,
    HTMLUListElement
  > {}

export interface PopoverListItemProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement> {
  icon?: keyof typeof iconSet
}

const PopoverListItem: FC<PopoverListItemProps> = ({
  className,
  icon,
  children,
  ...rest
}) => {
  const Icon = icon ? iconSet[icon] : null

  return (
    <li
      className={clsx(
        'rounded-lg px-4 py-1.5 text-lg',
        rest.onClick ? 'cursor-pointer' : 'cursor-default',
        className?.includes('red') ? 'hover:bg-red-50' : 'hover:bg-blue-50',
        className
      )}
      {...rest}
    >
      {Icon && <Icon className="mr-2.5 -mt-1 inline-block w-5" />}
      {children}
    </li>
  )
}

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
)

PopoverList.Item = PopoverListItem

export default PopoverList

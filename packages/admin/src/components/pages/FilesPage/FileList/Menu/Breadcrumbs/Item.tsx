import { iconSet } from '@prom-cms/icons'
import clsx from 'clsx'
import { VFC } from 'react'

type ItemProps = {
  icon: typeof iconSet.AB
  title?: string
  onClick: () => void
  isLast?: boolean
  label?: string
}

export const Item: VFC<ItemProps> = ({
  isLast,
  onClick,
  icon: Icon,
  title,
  label,
}) => (
  <>
    <button
      onClick={onClick}
      className={clsx(
        'flex flex-none items-center',
        isLast && 'pointer-events-none'
      )}
      title={label}
    >
      <Icon className="w-6 text-blue-500" />
      {title && (
        <span
          className={clsx('ml-2 text-lg font-semibold', isLast && 'underline')}
        >
          {title}
        </span>
      )}
    </button>
    {!isLast && (
      <span className="mx-2 flex-none text-2xl font-semibold text-gray-300">
        /
      </span>
    )}
  </>
)

import { QuestionMarkCircleIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import { DetailedHTMLProps, HTMLAttributes, VFC } from 'react'
import { useTranslation } from 'react-i18next'

export type ItemsMissingMessageProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>

const ItemsMissingMessage: VFC<ItemsMissingMessageProps> = ({
  className,
  ...rest
}) => {
  const { t } = useTranslation()

  return (
    <div
      className={clsx(
        'flex min-h-[300px] flex-col justify-center text-center text-xl font-semibold text-gray-400',
        className
      )}
      {...rest}
    >
      <QuestionMarkCircleIcon className="mx-auto w-10" />
      <p>{t('No items available...')}</p>
    </div>
  )
}

export default ItemsMissingMessage

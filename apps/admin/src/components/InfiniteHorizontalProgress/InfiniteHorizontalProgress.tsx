import clsx from 'clsx'
import { DetailedHTMLProps, HTMLAttributes, VFC } from 'react'

export interface InfiniteHorizontalProgressProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const InfiniteHorizontalProgress: VFC<InfiniteHorizontalProgressProps> = ({
  className,
  ...rest
}) => {
  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-full bg-blue-50',
        className
      )}
      {...rest}
    >
      <span className="animate-infiniteLoader absolute top-0 h-full bg-blue-400 rounded-full" />
    </div>
  )
}

export default InfiniteHorizontalProgress
